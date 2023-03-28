import { ddbDocClient } from "./ddbDocClient.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./ddbClient.js";

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
      courses: [],
      interests: ddbDocClient.createSet([""]),
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

export function updateUser(
  username,
  { first, last, email, entranceYear, major },
  callback
) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username,
    },
    UpdateExpression:
      "SET #first = :first, #last = :last, #email = :email, #entranceYear = :entranceYear, #major = :major",
    ExpressionAttributeNames: {
      "#first": "first",
      "#last": "last",
      "#email": "email",
      "#entranceYear": "entranceYear",
      "#major": "major",
    },
    ExpressionAttributeValues: {
      ":first": first,
      ":last": last,
      ":email": email,
      ":entranceYear": entranceYear,
      ":major": major,
    },
  };
  ddbDocClient.update(params, callback);
}

/**
 * updates _user_'s interest list to _interests_ (set of strings)
 * @param {*} user
 * @param {*} interests
 * @param {*} callback
 */
export function updateInterests(user, interests, callback) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "SET #interests = :interests",
    ExpressionAttributeNames: {
      "#interests": "interests",
    },
    ExpressionAttributeValues: {
      ":interests": interests,
    },
  };
  ddbDocClient.update(params, callback);
}

export function updatePassword({ oldPassword, newPassword }, callback) {
  // TODO: implement
}

export async function addCourse(
  user,
  { department, number, year, semester, difficulty, interest },
  callback
) {
  const evaluationId = [user, department, number, year, semester].join("_");
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
      { Update: userUpdateParams },
      { Put: courseCreationParams },
    ],
  };

  ddbDocClient.transactWrite(transactionParams, callback);
}

export async function getCourseInfo(courseId, callback) {
  // TODO: update to new table
  const params = {
    TableName: COURSE_TABLE,
    Key: {
      Course_Code: courseId,
    },
  };

  ddbDocClient.get(params, callback);
}
