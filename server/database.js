import { ddbDocClient } from "./ddbDocClient.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const USER_TABLE = "users";
const COURSE_TABLE = "Course_Table"; // not updated
const EVAL_TABLE = "evaluations";

export async function createUser(
  { username, password, first, last, email, entranceYear, major },
  callback
) {
  // Set the parameters.
  const params = {
    TableName: USER_TABLE,
    Item: {
      username,
      password,
      first,
      last,
      email,
      entranceYear,
      major,
      courses : [],
    },
    ConditionExpression: "attribute_not_exists(username)",
  };
  ddbDocClient.put(params, callback);
}

export function getUser(username, callback) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username,
    },
  };

  ddbDocClient.get(params, callback);
}

export async function addCourse(
  user,
  { department, number, year, semester, difficulty, interest },
  callback
) {
  const evaluationId= [user, department, number, year, semester].join("_");
  // Add course to user profile
  const userUpdateParams = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "ADD #courses :item",
    ExpressionAttributeNames: {
      "#courses": "courses",
    },
    ExpressionAttributeValues: {
      ":item": ddbDocClient.createSet([evaluationId]),
    },
  };

  // create course evaluation
  const courseCreationParams = {
    TableName: EVAL_TABLE,
    Item: {
      id: evaluationId,
      user,
      department,
      number,
      year,
      semester,
      difficulty,
      interest,
    },
    ConditionExpression: "attribute_not_exists(id)",
  };

  const transactionParams = {
    TransactItems: [
      {Update:userUpdateParams},
      {Put:courseCreationParams}]};

  // ddbDocClient.put(courseCreationParams, callback);

  ddbDocClient.transactWrite(transactionParams, callback);
}
