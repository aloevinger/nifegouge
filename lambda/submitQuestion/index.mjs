import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, GetCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-2' }));

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    const path = event.path || '';
    const method = event.httpMethod || '';
    
    try {
        // Get all questions
        if (path.includes('get-questions') && method === 'GET') {
            return await handleGetQuestions(headers);
        }
        
        // Submit new question
        if (path.includes('submit-question') && method === 'POST') {
            return await handleSubmitQuestion(event, headers);
        }
        
        // Edit existing question
        if (path.includes('edit-question') && method === 'POST') {
            return await handleEditQuestion(event, headers);
        }
        
        // Vote on question
        if (path.includes('vote-question') && method === 'POST') {
            return await handleQuestionVote(event, headers);
        }
        
        // Vote on pending question (community moderation)
        if (path.includes('vote-pending-question') && method === 'POST') {
            return await handlePendingQuestionVote(event, headers);
        }
        
        // Get pending questions (for moderation)
        if (path.includes('get-pending-questions') && method === 'GET') {
            return await handleGetPendingQuestions(headers);
        }
        
        // Approve/reject question (action:'cleanup' triggers dead-question deletion)
        if (path.includes('moderate-question') && method === 'POST') {
            const body = JSON.parse(event.body || '{}');
            if (body.action === 'cleanup') return await handleCleanupDeadQuestions(headers);
            return await handleModerateQuestion(event, headers);
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Endpoint not found' })
        };
    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

// Helper: paginated scan
async function scanAll(params) {
    const items = [];
    let lastKey;
    do {
        const result = await dynamodb.send(new ScanCommand({
            ...params,
            ExclusiveStartKey: lastKey
        }));
        items.push(...(result.Items || []));
        lastKey = result.LastEvaluatedKey;
    } while (lastKey);
    return items;
}

// Get all approved questions
async function handleGetQuestions(headers) {
    try {
        const questions = await scanAll({
            TableName: 'NIFEQuestions',
            FilterExpression: '#status = :status',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':status': 'approved' }
        });

        questions.sort((a, b) => {
            const aVotes = (a.upvotes || 0) - (a.downvotes || 0);
            const bVotes = (b.upvotes || 0) - (b.downvotes || 0);
            if (aVotes !== bVotes) return bVotes - aVotes;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        console.log(`Found ${questions.length} approved questions`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, questions })
        };

    } catch (error) {
        console.error('Error fetching questions:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Failed to fetch questions', message: error.message })
        };
    }
}

// Submit new question
async function handleSubmitQuestion(event, headers) {
    try {
        const body = JSON.parse(event.body);
        
        // Validate required fields
        if (!body.topic || !body.question || !body.correctAnswer) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields' 
                })
            };
        }
        
        const timestamp = Date.now();
        const questionItem = {
            questionId: `q_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            topic: body.topic.toLowerCase(),
            lecture: body.lecture || '',
            question: body.question.slice(0, 1000),
            correctAnswer: body.correctAnswer.slice(0, 500),
            incorrectAnswer1: body.incorrectAnswer1?.slice(0, 500) || '',
            incorrectAnswer2: body.incorrectAnswer2?.slice(0, 500) || '',
            incorrectAnswer3: body.incorrectAnswer3?.slice(0, 500) || '',
            status: 'pending', // Options: pending, approved, rejected
            submittedBy: body.submittedBy || 'anonymous',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            editHistory: [],
            type: body.type || 'new',  // 'new' or 'edit'
            approveCount: 0,  // Community approval votes
            rejectCount: 0    // Community rejection votes
        };
        
        const putCommand = new PutCommand({
            TableName: 'NIFEQuestions',
            Item: questionItem
        });
        
        await dynamodb.send(putCommand);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Question submitted for review',
                questionId: questionItem.questionId
            })
        };
        
    } catch (error) {
        console.error('Error submitting question:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to submit question',
                message: error.message
            })
        };
    }
}

// Edit existing question
async function handleEditQuestion(event, headers) {
    try {
        const body = JSON.parse(event.body);

        if (!body.originalQuestionId || !body.topic || !body.question || !body.correctAnswer) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields'
                })
            };
        }

        // Block duplicate pending edits for the same original question
        const existingPending = await scanAll({
            TableName: 'NIFEQuestions',
            FilterExpression: '#status = :pending AND originalQuestionId = :origId',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':pending': 'pending',
                ':origId': body.originalQuestionId
            }
        });
        if (existingPending.length > 0) {
            return {
                statusCode: 409,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'An edit is already pending review for this question. Check back after the community votes on it.'
                })
            };
        }

        // Get the original question to preserve its history
        const getCommand = new GetCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.originalQuestionId }
        });

        const originalResult = await dynamodb.send(getCommand);
        const originalQuestion = originalResult.Item;

        if (!originalQuestion) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Original question not found'
                })
            };
        }

        // Reject if the edit is identical to the original (question text + answer set)
        const norm = (s) => (s || '').trim().toLowerCase();
        const origAnswers = new Set(
            [originalQuestion.correctAnswer, originalQuestion.incorrectAnswer1,
             originalQuestion.incorrectAnswer2, originalQuestion.incorrectAnswer3]
            .map(norm).filter(Boolean)
        );
        const editAnswers = new Set(
            [body.correctAnswer, body.incorrectAnswer1,
             body.incorrectAnswer2, body.incorrectAnswer3]
            .map(norm).filter(Boolean)
        );
        const answersIdentical = origAnswers.size === editAnswers.size &&
            [...origAnswers].every(a => editAnswers.has(a));
        if (norm(originalQuestion.question) === norm(body.question) && answersIdentical) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'This edit is identical to the existing question. Make a meaningful change before submitting.'
                })
            };
        }

        const timestamp = Date.now();
        const editedQuestionItem = {
            questionId: `q_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
            topic: body.topic.toLowerCase(),
            lecture: body.lecture || '',
            question: body.question.slice(0, 1000),
            correctAnswer: body.correctAnswer.slice(0, 500),
            incorrectAnswer1: body.incorrectAnswer1?.slice(0, 500) || '',
            incorrectAnswer2: body.incorrectAnswer2?.slice(0, 500) || '',
            incorrectAnswer3: body.incorrectAnswer3?.slice(0, 500) || '',
            status: 'pending',
            submittedBy: body.submittedBy || 'anonymous',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0,
            type: 'edit',  // Mark as edit type
            originalQuestionId: body.originalQuestionId,
            editHistory: [...(originalQuestion.editHistory || []), body.originalQuestionId],
            approveCount: 0,  // Community approval votes
            rejectCount: 0    // Community rejection votes
        };
        
        const putCommand = new PutCommand({
            TableName: 'NIFEQuestions',
            Item: editedQuestionItem
        });
        
        await dynamodb.send(putCommand);
        
        // Mark original question as having an edit pending
        const updateCommand = new UpdateCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.originalQuestionId },
            UpdateExpression: 'SET hasPendingEdit = :true, latestEditId = :editId',
            ExpressionAttributeValues: {
                ':true': true,
                ':editId': editedQuestionItem.questionId
            }
        });
        
        await dynamodb.send(updateCommand);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Question edit submitted for review',
                questionId: editedQuestionItem.questionId
            })
        };
        
    } catch (error) {
        console.error('Error editing question:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to edit question',
                message: error.message
            })
        };
    }
}

// Vote on approved question (regular voting)
async function handleQuestionVote(event, headers) {
    try {
        const body = JSON.parse(event.body);
        
        if (!body.questionId || !body.voteType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields' 
                })
            };
        }
        
        const updateExpression = body.voteType === 'good' 
            ? 'SET upvotes = if_not_exists(upvotes, :zero) + :one'
            : 'SET downvotes = if_not_exists(downvotes, :zero) + :one';
        
        const updateCommand = new UpdateCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.questionId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: {
                ':one': 1,
                ':zero': 0
            },
            ReturnValues: 'ALL_NEW'
        });
        
        const result = await dynamodb.send(updateCommand);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Vote recorded',
                upvotes: result.Attributes?.upvotes,
                downvotes: result.Attributes?.downvotes
            })
        };
        
    } catch (error) {
        console.error('Error recording vote:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to record vote',
                message: error.message
            })
        };
    }
}

// Vote on pending question (community moderation)
async function handlePendingQuestionVote(event, headers) {
    try {
        const body = JSON.parse(event.body);
        
        if (!body.questionId || !body.voteType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields' 
                })
            };
        }
        
        // Update approve/reject counts
        const updateExpression = (body.voteType === 'approve' || body.voteType === 'better')
            ? 'SET approveCount = if_not_exists(approveCount, :zero) + :one'
            : 'SET rejectCount = if_not_exists(rejectCount, :zero) + :one';
        
        const updateCommand = new UpdateCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.questionId },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: {
                ':one': 1,
                ':zero': 0
            },
            ReturnValues: 'ALL_NEW'
        });
        
        const result = await dynamodb.send(updateCommand);
        
        const approveCount = result.Attributes?.approveCount || 0;
        const rejectCount = result.Attributes?.rejectCount || 0;
        const netScore = approveCount - rejectCount;
        
        // Check if threshold is met
        let approved = false;
        let rejected = false;
        
        if (netScore >= 3) {
            // Auto-approve the question
            approved = true;
            console.log(`Question ${body.questionId} auto-approved with net score of ${netScore}`);
            
            // Note: The frontend will call moderate-question endpoint to handle the approval
        } else if (netScore <= -3) {
            // Auto-reject the question
            rejected = true;
            console.log(`Question ${body.questionId} auto-rejected with net score of ${netScore}`);
            
            // Note: The frontend will call moderate-question endpoint to handle the rejection
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Vote recorded',
                approveCount: approveCount,
                rejectCount: rejectCount,
                netScore: netScore,
                approved: approved,
                rejected: rejected
            })
        };
        
    } catch (error) {
        console.error('Error recording pending question vote:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to record vote',
                message: error.message
            })
        };
    }
}

// Get pending questions for moderation
async function handleGetPendingQuestions(headers) {
    try {
        const questions = await scanAll({
            TableName: 'NIFEQuestions',
            FilterExpression: '#status = :status',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: { ':status': 'pending' }
        });

        questions.forEach(q => {
            if (!q.type) q.type = q.originalQuestionId ? 'edit' : 'new';
            q.approveCount = q.approveCount || 0;
            q.rejectCount = q.rejectCount || 0;
        });

        questions.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, questions })
        };

    } catch (error) {
        console.error('Error fetching pending questions:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: 'Failed to fetch pending questions', message: error.message })
        };
    }
}

// Approve or reject question
async function handleModerateQuestion(event, headers) {
    try {
        const body = JSON.parse(event.body);
        
        if (!body.questionId || !body.action) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Missing required fields' 
                })
            };
        }
        
        const newStatus = body.action === 'approve' ? 'approved' : 'rejected';
        
        // Get the question first to check if it's an edit
        const getCommand = new GetCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.questionId }
        });
        
        const questionResult = await dynamodb.send(getCommand);
        const question = questionResult.Item;
        
        if (!question) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Question not found' 
                })
            };
        }
        
        // Update the question status
        const updateCommand = new UpdateCommand({
            TableName: 'NIFEQuestions',
            Key: { questionId: body.questionId },
            UpdateExpression: 'SET #status = :status, moderatedAt = :timestamp, moderatedBy = :moderator',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': newStatus,
                ':timestamp': new Date().toISOString(),
                ':moderator': body.moderator || 'anonymous'
            },
            ReturnValues: 'ALL_NEW'
        });
        
        const result = await dynamodb.send(updateCommand);
        
        // If this was an edit approval, replace the original question
        if (newStatus === 'approved' && question.type === 'edit' && question.originalQuestionId) {
            // Mark the original as replaced
            const replaceCommand = new UpdateCommand({
                TableName: 'NIFEQuestions',
                Key: { questionId: question.originalQuestionId },
                UpdateExpression: 'SET #status = :status, replacedBy = :replacedBy, replacedAt = :timestamp, hasPendingEdit = :false',
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: {
                    ':status': 'replaced',
                    ':replacedBy': body.questionId,
                    ':timestamp': new Date().toISOString(),
                    ':false': false
                }
            });
            await dynamodb.send(replaceCommand);
            console.log(`Original question ${question.originalQuestionId} replaced by approved edit ${body.questionId}`);

            // Auto-reject all other pending edits for the same original (cleans up vote-diluting duplicates)
            const siblings = await scanAll({
                TableName: 'NIFEQuestions',
                FilterExpression: '#status = :pending AND originalQuestionId = :origId AND questionId <> :thisId',
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: {
                    ':pending': 'pending',
                    ':origId': question.originalQuestionId,
                    ':thisId': body.questionId
                }
            });
            await Promise.all(siblings.map(sibling =>
                dynamodb.send(new UpdateCommand({
                    TableName: 'NIFEQuestions',
                    Key: { questionId: sibling.questionId },
                    UpdateExpression: 'SET #status = :rejected, moderatedAt = :timestamp, moderatedBy = :moderator',
                    ExpressionAttributeNames: { '#status': 'status' },
                    ExpressionAttributeValues: {
                        ':rejected': 'rejected',
                        ':timestamp': new Date().toISOString(),
                        ':moderator': 'auto-sibling-cleanup'
                    }
                }))
            ));
            if (siblings.length > 0) {
                console.log(`Auto-rejected ${siblings.length} sibling pending edits for original ${question.originalQuestionId}`);
            }
        }

        // If this was an edit rejection, clear the pending edit flag on the original
        if (newStatus === 'rejected' && question.type === 'edit' && question.originalQuestionId) {
            const clearEditCommand = new UpdateCommand({
                TableName: 'NIFEQuestions',
                Key: { questionId: question.originalQuestionId },
                UpdateExpression: 'SET hasPendingEdit = :false, latestEditId = :null',
                ExpressionAttributeValues: {
                    ':false': false,
                    ':null': null
                }
            });
            await dynamodb.send(clearEditCommand);
            console.log(`Cleared pending edit flag on original question ${question.originalQuestionId}`);
        }
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: `Question ${newStatus}`,
                question: result.Attributes
            })
        };
        
    } catch (error) {
        console.error('Error moderating question:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to moderate question',
                message: error.message
            })
        };
    }
}

// One-time cleanup: delete all rejected and replaced questions
async function handleCleanupDeadQuestions(headers) {
    try {
        const toDelete = [
            ...await scanAll({
                TableName: 'NIFEQuestions',
                FilterExpression: '#status = :s',
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: { ':s': 'rejected' }
            }),
            ...await scanAll({
                TableName: 'NIFEQuestions',
                FilterExpression: '#status = :s',
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: { ':s': 'replaced' }
            })
        ];

        await Promise.all(toDelete.map(item =>
            dynamodb.send(new DeleteCommand({
                TableName: 'NIFEQuestions',
                Key: { questionId: item.questionId }
            }))
        ));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, deleted: toDelete.length })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
}