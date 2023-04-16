import { ddbDocClient } from "./ddbDocClient.js";
import stopword from "stopword";
import natural from "natural";
import { stemmer } from "stemmer";
import sqlite3 from "sqlite3";

//TODO: See readme for updated local db path. DB should be located in same folder
// as senior deign repo
const LOCAL_DB_PATH = "../seniordesign.sqlite"; 

const USER_TABLE = "users";
const COURSE_TABLE = "courses";
const EVAL_TABLE = "evaluations";
const INDEX_TABLE = "index";

/**
 *
 * @param {{username:string,
 *          password:string,
 *          first:string,
 *          last:string,
 *          email:string,
 *          entranceYear:int,
 *          major:string}} userParams
 * @param {function(err, data)} callback
 */
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
  { department, number, year, semester, difficulty, interest, workload },
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

  ddbDocClient.transactWrite(transactionParams, (err, data) =>
    callback(err, courseCreationParams.Item)
  );
  //The code below is to add an evaluation to the local SQLite Database
  const db = new sqlite3.Database(LOCAL_DB_PATH);
  db.run(
    `INSERT INTO evaluations (id, number, semester, year, user, difficulty, interest, department, workload1, workload2, workload3, workload4)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evaluationId,
      number,
      semester,
      year,
      user,
      difficulty,
      interest,
      department,
      workload[0],
      workload[1],
      workload[2],
      workload[3],
    ],
    function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  );
  db.close();
}

/**
 * gets course evaluation for a user.
 */
export async function getEvaluation(evaluationId, callback) {
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
 * @param {string} user
 * @param {{department:string,
 *          number:string,
 *          year:int,
 *          semester:string,
 *          difficulty:int,
 *          interest:int,
 *          workload:[int,int,int,int]}} course
 * @param {function(err, data)} callback
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
      //The code below is to update an evaluation to the local SQLite Database
      const db = new sqlite3.Database(LOCAL_DB_PATH);

      // update or insert?
      const db_transaction = `
      insert into evaluations (id, number, semester , year, user, difficulty, interest, department, workload1, workload2, workload3, workload4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        difficulty = ?,
        interest = ?,
        workload1 = ?,
        workload2 = ?,
        workload3 = ?,
        workload4 = ?
        WHERE id = ?;
      `;

      db.run(
        db_transaction,
        [
          evaluationId,
          number,
          semester,
          year,
          user,
          difficulty,
          interest,
          workload[0],
          workload[1],
          workload[2],
          workload[3],
          difficulty,
          interest,
          department,
          workload[0],
          workload[1],
          workload[2],
          workload[3],
          evaluationId,
        ],
        function (err) {
          if (err) {
            return console.error(
              "An error occurred updating " +
                evaluationId +
                " in sqlite table: ",
              err.message
            );
          } else {
            console.log(`A row has been updated with rowid ${this.lastID}`);
          }
        }
      );

      db.close();
    }
  });
}

/**
 * Deletes course evaluation for a user.
 */
export async function deleteEvaluation(
  user,
  { department, number, year, semester },
  callback
) {
  const evaluationId = [user, department, number, year, semester].join("_");
  console.log("Deleting  " + evaluationId + " from " + user + "'s evaluations");
  const transactionParams = {
    TransactItems: [
      {
        Delete: {
          TableName: EVAL_TABLE,
          Key: {
            id: evaluationId,
          },
        },
      },
      {
        Update: {
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
            ":itemString": evaluationId,
          },
          // only delete if evaluationId is in user's evaluation list
          ConditionExpression: "contains(#courses, :itemString)",
        },
      },
    ],
  };

  //The code below is to delete an evaluation to the local SQLite Database
  const db = new sqlite3.Database(LOCAL_DB_PATH);
  db.run(
    `DELETE FROM evaluations WHERE id = ?`,
    [evaluationId],
    function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log(`Row with id ${evaluationId} deleted successfully`);
      }
    }
  );
  ddbDocClient.transactWrite(transactionParams, callback);
}

/**
 * adds courseId to "likedCourses" (string set, does not exist yet.
 * see updateInterests for example).
 */
export async function addLikedCourse(user, { courseId }, callback) {
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
    },
  };
  ddbDocClient.update(likedCoursesParams, callback);
}

/**
 * removes courseId from "likedCourses" (string set, does not exist yet.
 * see updateInterests for example).
 */
export async function removeLikedCourse(user, { courseId }, callback) {
  const likedCoursesParams = {
    TableName: USER_TABLE,
    Key: {
      username: user,
    },
    UpdateExpression: "DELETE #likedCourses :item",
    ExpressionAttributeNames: {
      "#likedCourses": "likedCourses",
    },
    ExpressionAttributeValues: {
      ":item": ddbDocClient.createSet([courseId]),
    },
  };
  ddbDocClient.update(likedCoursesParams, callback);
}

/**
 * STRETCH GOAL! Delete user's profile and all evaluations associated with it.
 * @param user
 */
export async function deleteAccount(user) {
  //TODO: Work in progress. Am able to delete user but trying to figure out how to delete all associated evaluations
  getUser(user, (err, data) => {
    // means course evaluation doesn't exist
    if (err) {
      callback(err, data);
      // course evaluation exists
    } else {
      const userDeleteParams = {
        TableName: USER_TABLE,
        Key: {
          username: user,
        },
      };
      //TODO: Work in progress
      const evalDeleteParams = {
        TableName: EVAL_TABLE,
        FilterExpression: "begins_with(myKey, :partialKey)",
        ExpressionAttributeValues: {
          ":partialKey": ddbDocClient.createSet([user]),
        },
      };
      const transactionParams = {
        TransactItems: [
          { Delete: userDeleteParams },
          { Delete: evalDeleteParams },
        ],
      };
      ddbDocClient.transactWrite(transactionParams, callback);
    }
  });
}

export async function getCourseInfo(courseId, callback) {
  // TODO: update to new table
  const params = {
    TableName: COURSE_TABLE,
    Key: {
      code: courseId,
    },
  };

  ddbDocClient.get(params, callback);
}

/**
 * Queries for courses corresponding to given tokens (from search query)
 * @param {string} searchTerm
 * @param {function(err, data)} callback
 */
export async function getSearchResults(searchTerm, callback) {
  const tokenizer = new natural.WordTokenizer();
  const normalized = searchTerm.toLowerCase();
  var tokens = tokenizer.tokenize(normalized);
  tokens = stopword.removeStopwords(tokens);
  tokens = tokens.map((token) => stemmer(token));

  var tokenSet = [...new Set(tokens)];

  if (tokenSet.length > 100) {
    tokenSet = tokenSet.slice(0, 100);
  }

  const batchGetParams = {
    TableName: INDEX_TABLE,
    RequestItems: {
      [INDEX_TABLE]: {
        Keys: tokenSet.map((token) => ({ token })),
      },
    },
  };

  ddbDocClient.batchGet(batchGetParams, (err, data) => {
    if (err) {
      return callback(err, data);
    }
    const coursePrecedenceMap = {};
    const items = data.Responses[INDEX_TABLE];
    items.forEach((item) => {
      item.courses.forEach((courseId) => {
        if (coursePrecedenceMap[courseId]) {
          coursePrecedenceMap[courseId] += 1;
        } else {
          coursePrecedenceMap[courseId] = 1;
        }
      });
    });
    const coursePrecedenceList = Object.entries(coursePrecedenceMap).sort(
      (a, b) => b[1] - a[1]
    );
    return callback(err, coursePrecedenceList);
  });
}
