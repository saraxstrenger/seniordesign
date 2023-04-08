import { ddbDocClient } from "./ddbDocClient.js";

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
      interests: {},
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
 * updates _user_'s interest list to include _interest_ 
 * @param {string} user
 * @param {string} interest
 * @param {function(err, data)} callback
 */
export function addInterest(user, interest, callback) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "SET interests.#newInterest = :emptyRecommendation",
    ExpressionAttributeNames: {
      "#newInterest": interest,
    },
    ExpressionAttributeValues: {
      ":emptyRecommendation": [],
    },
    ConditionExpression: "attribute_not_exists(interests.#newInterest)",
  };
  ddbDocClient.update(params, callback);
}

/**
 * updates _user_'s interest list to remove _interest_
 * @param {string} user
 * @param {string} interest
 * @param {function(err, data)} callback
 */
export function removeInterest(user, interest, callback) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "REMOVE interests.#interest",
    ExpressionAttributeNames: {
      "#interest": interest,
    },
  };
  ddbDocClient.update(params, callback);
}

/**
 *
 * @param {*} user username
 * @param {*} oldPassword
 * @param {*} newPassword
 * @param {*} callback see other examples, callback from endpoints.js
 */
export function updatePassword(user, { oldPassword, newPassword }, callback) {}

export async function addEvaluation(
  user,
  { department, number, year, semester, difficulty, interest, workload},
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
    }
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
      workload1: workload[0],
      workload2: workload[1],
      workload3: workload[2],
      workload4: workload[3],
    },
    ConditionExpression: "attribute_not_exists(id)",
  };

  const transactionParams = {
    TransactItems: [
      { Update: userUpdateParams },
      { Put: courseCreationParams },
    ],
  };

  ddbDocClient.transactWrite(transactionParams, (err, data )=>callback(err, courseCreationParams.Item));
}

/**
 * gets course evaluation for a user.
 */
export async function getEvaluation(
  evaluationId,
  callback
) {
  const params = {
    TableName: EVAL_TABLE,
    Key: {
      id: evaluationId,
    },
  };

  ddbDocClient.get(params, callback); 
}

/**
 * updates course evaluation for a user. !!before executing!!, check if user has
 * already evaluated course
 * (can use getEvaluation for this and do update in callback, see endpoints.js
 * for how to use callbacks).
 */
export async function updateEvaluation(
  user,
  { department, number, year, semester, difficulty, interest, workload }, 
  callback
) {

  const evaluationId = [user, department, number, year, semester].join("_");

  // Checking if user has already evaluted course
  getEvaluation(evaluationId, (err, data) => {
    // means course evaluation doesn't exist
    if (err) {
      callback(err, data);
    // course evaluation exists
    } else {
      const params = {
        TableName: EVAL_TABLE,
        Key: {
          id: evaluationId,
        },
        UpdateExpression:
          "SET #difficulty = :difficulty, #interest = :interest, #workload1 = :workload1, #workload2 = :workload2, #workload3 = :workload3, #workload4 = :workload4",
        ExpressionAttributeNames: {
          "#difficulty": "difficulty",
          "#interest": "interest",
          "#workload1": "workload1",
          "#workload2": "workload2",
          "#workload3": "workload3",
          "#workload4": "workload4",
        },
        ExpressionAttributeValues: {
          ":difficulty": difficulty,
          ":interest": interest,
          ":workload1": workload[0],
          ":workload2": workload[1],
          ":workload3": workload[2],
          ":workload4": workload[3],
        },
      };
      ddbDocClient.update(params, callback);
    }
  });
}

/**
 * Deletes course evaluation for a user. before executing, check if user has
 * already evaluated course. Must be deleted from evaluations table and user's
 * course list. Use transaction.
 */
export async function deleteEvaluation(
  user,
  { department, number, year, semester },
  callback
) {
  const evaluationId = [user, department, number, year, semester].join("_");
  //check if evaluation exists
  getEvaluation(evaluationId, (err, data) => {
    // means course evaluation doesn't exist
    if (err) {
      callback(err, data);
    // course evaluation exists
    } else {
      const evalDeleteParams = {
        TableName: EVAL_TABLE,
        Key: {
          id: evaluationId,
        },
      };
      const userUpdateParams = {
        TableName: USER_TABLE,
        Key: {
          username: user,
        },
        UpdateExpression: "DELETE #courses :item",
        ExpressionAttributeNames: {
          "#courses": "courses",
        },
        ExpressionAttributeValues: {
          ":item": ddbDocClient.createSet([evaluationId]),
        },
      };
      const transactionParams = {
        TransactItems: [
          { Delete: evalDeleteParams },
          { Update: userUpdateParams },
        ],
      };
      ddbDocClient.transactWrite(transactionParams, callback);
    }
  });

}

/**
 * adds courseId to "likedCourses" (string set, does not exist yet.
 * see updateInterests for example).
 */
export async function addLikedCourse(user, { courseId }, callback) {
  // TODO: implement
  const likedCoursesParams = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "ADD #likedCourses :item",
    ExpressionAttributeNames: {
      "#likedCourses": "likedCourses",
    },
    ExpressionAttributeValues: {
      ":item": ddbDocClient.createSet([courseId]),
    }
  };
  ddbDocClient.update(likedCoursesParams, callback);
}

/**
 * removes courseId from "likedCourses" (string set, does not exist yet.
 * see updateInterests for example).
 */
export async function removeLikedCourse(user, { courseId }, callback) {
  // TODO: implement
}

/**
 * STRETCH GOAL! Delete user's profile and all evaluations associated with it.
 * @param user
 */
export async function deleteAccount(user) {
  // TODO: implement
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
