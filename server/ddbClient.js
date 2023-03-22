import AWS  from "aws-sdk";
import {fromIni} from "@aws-sdk/credential-providers";
import fs from "fs";

const credentials = await import('./config.json', {
    assert: { type: 'json' }
});

// var fs = require("fs");

// const credentials = await fs.promises.readFile("./server/config.txt",  "utf-8", function(err, obj) {
//     // print your json file to the screen
//     if (err) { 
//     console.log(err);
//     return {err} 
//     }
//     else {
//     // parse the obj string and convert it to an actual object
//     console.log(obj);
//     const parsed = JSON.parse(obj); 
//     console.log("parsed"+parsed);
//     return parsed;
//     } 
// })
// console.log("creds:")
// console.log(credentials);

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