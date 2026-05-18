import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-2' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        // Handle both proxy and non-proxy formats
        let body;
        if (event.body) {
            body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        } else if (event.testType) {
            body = event;
        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No body provided' })
            };
        }
        
        // Validate required fields (including designator)
        if (!body.testType || !body.elapsedTime || !body.playerName || 
            !body.country || !body.branch || !body.designator || 
            !body.nifeClass || body.score !== 100) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing or invalid required fields' })
            };
        }
        
        // Create unique identifier using name, designator, and class
        const playerKey = `${body.playerName}-${body.designator}-${body.nifeClass}`.toUpperCase();
        
        // Check for existing scores by this player for this test type
        const queryCommand = new QueryCommand({
            TableName: 'FlightTestLeaderboard',
            KeyConditionExpression: 'testType = :testType',
            ExpressionAttributeValues: {
                ':testType': body.testType
            }
        });
        
        const existingScores = await dynamodb.send(queryCommand);
        
        // Remove any existing score for this player
        for (const item of existingScores.Items || []) {
            const existingKey = `${item.playerName}-${item.designator}-${item.nifeClass}`.toUpperCase();
            if (existingKey === playerKey) {
                const deleteCommand = new DeleteCommand({
                    TableName: 'FlightTestLeaderboard',
                    Key: {
                        testType: body.testType,
                        elapsedTime: item.elapsedTime
                    }
                });
                await dynamodb.send(deleteCommand);
                console.log(`Deleted old score for ${playerKey}`);
            }
        }
        
        // Build the item to save
        const item = {
            testType: body.testType,
            elapsedTime: Number(body.elapsedTime),
            playerName: body.playerName.slice(0, 4).toUpperCase(),
            country: body.country.slice(0, 4).toUpperCase(),
            branch: body.branch.slice(0, 4).toUpperCase(),
            designator: body.designator.toUpperCase(),
            nifeClass: body.nifeClass,
            score: 100,
            timestamp: new Date().toISOString()
        };
        
        // Add time breakdowns if they exist
        if (body.limitsTime) {
            item.limitsTime = Number(body.limitsTime);
        }
        if (body.epsTime) {
            item.epsTime = Number(body.epsTime);
        }
        
        const putCommand = new PutCommand({
            TableName: 'FlightTestLeaderboard',
            Item: item
        });
        
        await dynamodb.send(putCommand);
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Score submitted successfully'
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to submit score' })
        };
    }
};