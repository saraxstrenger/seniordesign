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
    },
    ConditionExpression: "attribute_not_exists(username)",
  };
  ddbDocClient.put(params, callback);
}

export function getPassword(username, callback) {
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
  { courseDept, courseCode, year, semester, difficulty, interest },
  callback
) {
  // Set the parameters.
  const params = {
    TableName: EVAL_TABLE,
    Item: {
      id: user + courseDept + courseCode + year + semester,
      user,
      courseDept,
      courseCode,
      year,
      semester,
      difficulty,
      interest,
    },
    ConditionExpression: "attribute_not_exists(id)",
  };
  ddbDocClient.put(params, callback);
}
