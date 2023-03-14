import AWS  from "aws-sdk";
import {fromIni} from "@aws-sdk/credential-providers";

const credentials = await import('./config.json', {
    assert: { type: 'json' }
});

// credentials.region="us-east-1";
// credentials.endpoint="http://dynamodb.us-east-1.amazonaws.com";
// let awsConfig = {
//     "region": "us-east-1",
//     "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
//     "accessKeyId": "XXXXXXX", "secretAccessKey": "XXXXXXXX"
// };
AWS.config.update(credentials.default);

let ddb = AWS.DynamoDB;


// const awsCreds = AwsBasicCredentials.create(
//     "your_access_key_id",
//     "your_secret_access_key");


// Set the AWS Region.

// Create an Amazon DynamoDB service client object.
// const ddbClient = new DynamoDBClient({credentials: fromIni({profile: 'default'})});



export { ddb };

// export const dynamoClient = null;

// aws dynamodb put-item  --table-name "users"  --item "{\"username\": {\"S\": \"test\"}, \"password\": {\"S\": \"pass\"}, \"first\": {\"S\": \"Test\"}, \"last\": {\"S\": \"User\"}}"
// {"username": {"S": "test"}, "password: {"S": "pass"}, "first: {"S": "Test"}, "last": {"S": "User"}}