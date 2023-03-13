import { DynamoDBClient } from "@aws-sdk/client-dynamodb";




const credentials = await import('./config.json', {
    assert: { type: 'json' }
});

const config = {
    // apiVersion: "2010-12-01",
    accessKeyId: credentials.default.accessKeyId, // hardcoding credentials is a bad practice
    accessSecretKey: credentials.default.secretAccessKey, // please use env vars instead
    region: "us-east-1"
}

// Set the AWS Region.
const REGION = "us-east-1"; 

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient(config);


export { ddbClient };

export const dynamoClient = null;
