import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

// Make sure this matches where your table is
const client = new DynamoDBClient({ region: 'us-east-2' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }
    
    try {
        console.log('Event:', JSON.stringify(event, null, 2));
        
        const testType = event.queryStringParameters?.testType;
        
        if (!testType) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'testType parameter is required' })
            };
        }
        
        const command = new QueryCommand({
            TableName: 'FlightTestLeaderboard',
            KeyConditionExpression: 'testType = :testType',
            ExpressionAttributeValues: {
                ':testType': testType
            },
            Limit: 10,
            ScanIndexForward: true
        });
        
        const result = await dynamodb.send(command);
        console.log('Query result:', JSON.stringify(result, null, 2));
        console.log('Items:', JSON.stringify(result.Items, null, 2));
        
        const leaderboard = (result.Items || []).map((item, index) => ({
            rank: index + 1,
            playerName: item.playerName,
            country: item.country,
            branch: item.branch,
            designator: item.designator,
            nifeClass: item.nifeClass,
            time: item.elapsedTime,
            limitsTime: item.limitsTime,
            epsTime: item.epsTime,
            formattedTime: formatTime(item.elapsedTime),
            formattedLimitsTime: item.limitsTime ? formatTime(item.limitsTime) : null,
            formattedEpsTime: item.epsTime ? formatTime(item.epsTime) : null,
            timestamp: item.timestamp
        }));
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                leaderboard: leaderboard,
                count: leaderboard.length
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to retrieve leaderboard' })
        };
    }
};

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}