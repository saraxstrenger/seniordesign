import * as db from "./database.js";
import { spawn } from "child_process";
import dgram from "dgram";
import * as utils from "./utils.js";
const COLLAB_SCRIPT = "./RecSystem/CollabFilterRecommender.py";
const DATABASE_PATH = "../seniordesign.sqlite";
const REC_SERVER_PORT = 3030;

export function auth(req, res) {
  if (req.session?.userid) {
    res.sendStatus(200); // OK - user is logged in
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

// source: https://www.npmjs.com/package/express-session
export function logout(req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session = null;
  res.sendStatus(200);
  // req.session.save(function (err) {
  //   if (err) {
  //     res.sendStatus(500);
  //     return;
  //   }

  //   // regenerate the session, which is good practice to help
  //   // guard against forms of session fixation
  //   // req.session.destroy();
  //   req.session.regenerate(function (err) {
  //     if (err) {
  //       res.sendStatus(500);
  //       return;
  //     }
  //     res.sendStatus(200);
  //   });
  // });
}

export async function login(req, res) {
  const user = req.body?.username;
  const pass = req.body?.password;
  if (user === null || pass === null) {
    res.sendStatus(400); // Bad Request
    return;
  }
  // TODO: encrypt password
  const errorMsg = {
    success: false,
    errorMsg: "Incorrect username or password",
  };
  const password = await db.getUser(user, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json(errorMsg);
    } else {
      if (data.Item === undefined) {
        res.json(errorMsg);
        return;
      }
      const password = data.Item.password;
      if (password !== null && password === pass) {
        req.session = setCookie(req.session, user);
        // res.cookie('usersession', 'encryptedmumbojumbo', { maxAge: 60*60*24*3, httpOnly: false });
        res.json({ success: true });
      } else {
        res.json({
          success: false,
          errorMsg: "Incorrect username or password",
        });
      }
    }
  });
}

function setCookie(session, username) {
  session.userid = username;
  return session;
}
function isEmptyStr(str) {
  return !str || str.length == 0;
}

export function signup(req, res) {
  console.log("signup request received");
  const params = req?.body ?? null;
  if (params === null) {
    res.sendStatus(400);
    return;
  }
  console.log(params);
  const first = utils.validateName(params.first);
  const last = utils.validateName(params.last);
  const username = utils.validateUsername(params.username);
  const password = utils.validatePassword(params.password);
  const email = utils.validateEmail(params.email);
  const entranceYear = utils.validateYear(params.entranceYear);
  const major = utils.validateMajor(params.major);

  console.log({ username, password, first, last, email, entranceYear, major });

  if (
    first === undefined ||
    last === undefined ||
    username === undefined ||
    password === undefined ||
    email === undefined ||
    entranceYear === undefined ||
    major === undefined
  ) {
    res.json({ success: false, errorMsg: "Invalid input" });
    return;
  }
  console.log("params valid");
  // try to create db entry
  db.createUser(
    { username, password, first, last, email, entranceYear, major },
    (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Username already exists" });
      } else {
        setCookie(req.session, params.username);
        res.json({ success: true });
      }
    }
  );
}

export function addEvaluation(req, res) {
  console.log("add class request received");
  const params = req.body;
  if (params === null) {
    res.sendStatus(400);
    return;
  }

  const session = req.session;
  if (!session.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }

  const interest = utils.validateRating(req.body?.interest);
  const difficulty = utils.validateRating(req.body?.difficulty);
  const workload = utils.validateWorkload(req.body?.workload);
  const year = utils.validateYear(req.body?.year);
  const semester = utils.validateSemester(req.body?.semester);
  const department = utils.validateDepartment(req.body?.department);
  const number = utils.validateCourseNumber(req.body?.number);
  if (
    interest === undefined ||
    difficulty === undefined ||
    workload === undefined ||
    year === undefined ||
    semester === undefined ||
    department === undefined ||
    number === undefined
  ) {
    res.json({
      success: false,
      errorMsg: "Invalid parameters! Please ensure all form inputs are valid.",
    });
    return;
  }

  db.addEvaluation(
    session.userid,
    { department, number, year, semester, difficulty, interest, workload },
    (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Class already exists" });
      } else {
        console.log("Success adding eval", data);
        res.json({ success: true, courseId: data.id });
      }
    }
  );
}

export function updateEvaluation(req, res) {
  console.log("update eval request received");
  const params = req.body;
  if (params === null) {
    res.sendStatus(400);
    return;
  }

  const user = req.session.userid;
  // check if all parameters are valid
  const department = utils.validateDepartment(req.body?.department);
  const number = utils.validateCourseNumber(req.body?.number);
  const year = utils.validateYear(req.body?.year);
  const semester = utils.validateSemester(req.body?.semester);
  const interest = utils.validateRating(req.body?.interest);
  const difficulty = utils.validateRating(req.body?.difficulty);
  const workload = utils.validateWorkload(req.body?.workload);
  if (
    department === undefined ||
    number === undefined ||
    year === undefined ||
    semester === undefined ||
    interest === undefined ||
    difficulty === undefined ||
    workload === undefined
  ) {
    res.sendStatus(400); // Bad request
    return;
  }

  db.updateEvaluation(
    user,
    { department, number, year, semester, difficulty, interest, workload },
    (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Unable to update evaluation" });
      } else {
        console.log("Success updating eval", data);
        res.json({ success: true });
      }
    }
  );
}

export function getEvaluations(req, res) {
  db.getUser(req.session.userid, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      const user = data.Item;
      res.json({ success: true, courses: user.courses });
    }
  });
}

export function getEvaluation(req, res) {
  const session = req.session;
  const id = req.params.id;
  const evalInfo = id.split("_");
  const evalOwner = evalInfo[0];
  // only the owner of the evaluation should be able to access it
  if (session?.userid && evalOwner == session.userid) {
    db.getEvaluation(id, (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Unable to perform operation." });
      } else {
        const evaluation = data.Item;
        const workload = [
          evaluation?.workload1 ?? 2,
          evaluation?.workload2 ?? 2,
          evaluation?.workload3 ?? 2,
          evaluation?.workload4 ?? 2,
        ];
        delete evaluation.workload1;
        delete evaluation.workload2;
        delete evaluation.workload3;
        delete evaluation.workload4;
        evaluation.workload = workload;
        res.json({ success: true, data: evaluation });
      }
    });
    return;
  }
  res.sendStatus(401); // Unauthorized
}

export function getProfile(req, res) {
  console.log("get profile request received");
  const session = req.session;
  if (!session?.userid || !session?.username === "") {
    res.sendStatus(401); // Unauthorized
    return;
  }
  db.getUser(session.userid, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      const user = data.Item;
      delete user.password;
      res.json({ success: true, user });
    }
  });
}

export function updateProfile(req, res) {
  if (!req.session?.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  const params = req.body;
  if (params.year === undefined) {
    res.sendStatus(400); // Bad Request
    return;
  }
  params.year = parseInt(params.year, 10);
  if (
    isEmptyStr(params.first) ||
    isEmptyStr(params.last) ||
    !isEmail(params.email) ||
    isNaN(params.entranceYear) ||
    isEmptyStr(params.major)
  ) {
    res.json({
      success: false,
      errorMsg: "Please make sure all fields are completed with valid values.",
    });
    return;
  }
  db.updateUser(req.session.userid, params, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      res.json({ success: true });
    }
  });
}

export function getCourseInfo(req, res) {
  const courseId = req.params?.id;

  if (courseId === undefined) {
    res.sendStatus(400); // Bad Request
    return;
  }
  console.log("[" + courseId + "]");
  console.log(courseId.split(" "));

  db.getCourseInfo(courseId, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      if (data === undefined || data.Item === undefined) {
        console.log("Unable to find course with id: " + courseId + ".");
        res.sendStatus(404); // Not Found
        return;
      }
      delete data.Item?.embedding;
      console.log("Course found: " + data.Item.code);
      res.json({ success: true, data: data.Item });
    }
  });
}

export function changePassword(req, res) {
  // TODO
}

export function addInterest(req, res) {
  if (!req.session?.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  const newInterest = req.body?.interest;

  if (newInterest === undefined) {
    res.json({ success: false, errorMsg: "Unable to perform operation." });
    return;
  }
  db.addInterest(req.session.userid, newInterest, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      res.json({ success: true });
    }
  });
  // send message to server to update recommendations
  queueUser(req.session.userid);
}

export function removeInterest(req, res) {
  if (!req.session?.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  const interest = req.body?.interest;

  if (interest === undefined) {
    res.json({ success: false, errorMsg: "Unable to perform operation." });
    return;
  }
  db.removeInterest(req.session.userid, interest, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      res.json({ success: true });
    }
  });
}

/**
 * Queues a user to be updated in the recommendation server
 * @param {string} user
 */
export function queueUser(user) {
  const client = dgram.createSocket("udp4");
  const message = Buffer.from("recs " + user);
  client.send(message, REC_SERVER_PORT, "localhost", (err) => {
    client.close();
  });
}

export function getHome(req, res) {
  const session = req.session;
  if (!session?.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  db.getUser(session.userid, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      const interests = data.Item.interests ?? [];
      const courses = data.Item.courses;
      const recs = data.Item.recs;
      // Todo: add more info?
      res.json({ success: true, interests, courses, recs });
    }
  });
}

export function getPredictions(req, res) {
  const courseId = req.params.id;
  const user = req.session?.userid;

  getPersonalizedPredictions(user, courseId, (predictions) => {
    res.json(predictions);
  });
}

function getPersonalizedPredictions(user, course, callback) {
  const pythonProcess = spawn("python3", [
    COLLAB_SCRIPT,
    "-p", // database path argument
    DATABASE_PATH,
    "-s", // student argument
    user,
    "-c", // course argument
    course,
  ]);

  let response = "";
  let err = "";
  pythonProcess.on("connect", (code) => {
    console.log(`child process connected `);
  });
  pythonProcess.stdout.setEncoding("utf8");
  pythonProcess.stdout.on("data", (data) => {
    // Do something with the data returned from python script
    response += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    // Do something with the data returned from python script
    err += data.toString();
  });

  pythonProcess.on("exit", (code) => {
    console.log(`child process finished with code ${code}`);
    if (err) {
      console.log("ERROR: ", err);
    }
    const predictions = JSON.parse(response);
    const difficulty = predictions?.difficulty;
    const interest = predictions?.interest;
    const workload1 = predictions?.workload1;
    const workload2 = predictions?.workload2;
    const workload3 = predictions?.workload3;
    const workload4 = predictions?.workload4;

    if (
      difficulty == undefined ||
      interest == undefined ||
      workload1 == undefined ||
      workload2 == undefined ||
      workload3 == undefined ||
      workload4 == undefined
    ) {
      callback({
        error: true,
        errorMsg:
          `Unable to generate predictions for ${course} at this time.`,
      });
    } else {
      const formattedPredictions = {
        difficulty,
        interest,
        workload: [workload1, workload2, workload3, workload4],
      };
      callback({ success: true, data: formattedPredictions });
    }
  });
}

export function getSearchResults(req, res) {
  const searchTerm = req.body?.searchTerm;
  if (searchTerm === undefined) {
    res.json({ success: false, errorMsg: "Invalid request body." });
    return;
  }

  db.getSearchResults(searchTerm, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
      var trimmedData = data.slice(0, Math.min(25, data.length));
      trimmedData = trimmedData.map((item) => {
        return item[0];
      });
      res.json({ success: true, data: trimmedData });
    }
  });
}

export function deleteEvaluation(req, res) {
  const user = req.session?.userid;
  const department = utils.validateDepartment(req.body?.department);
  const number = utils.validateCourseNumber(req.body?.number);
  const year = utils.validateYear(req.body?.year);
  const semester = utils.validateSemester(req.body?.semester);
  console.log({ department, number, year, semester });
  if (
    department === undefined ||
    number === undefined ||
    year === undefined ||
    semester === undefined
  ) {
    res.sendStatus(400); // Bad Request
    return;
  }

  db.deleteEvaluation(
    user,
    { department, number, year, semester },
    (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Unable to perform operation." });
      } else {
        res.json({ success: true });
      }
    }
  );
}

export function editEvaluation(req, res) {
  const user = req.session.userid;
  const department = utils.validateDepartment(req.body?.department);
  const number = utils.validateCourseNumber(req.body?.number);
  const year = utils.validateYear(req.body?.year);
  const semester = utils.validateSemester(req.body?.semester);
  const interest = utils.validateRating(req.body?.interest);
  const difficulty = utils.validateRating(req.body?.difficulty);
  const workload = utils.validateWorkload(req.body?.workload);

  if (
    department === undefined ||
    number === undefined ||
    year === undefined ||
    semester === undefined ||
    interest === undefined ||
    difficulty === undefined ||
    workload === undefined
  ) {
    res.sendStatus(400); // Bad Request
    return;
  }

  res.sendStatus(501); // Not Implemented

  // db.editEvaluation(user, {, (err, data) => {
  //   if (err) {
  //     console.log("Error", err.stack);
  //     rsp.json({ success: false, errorMsg: "Unable to perform operation." });
  //   } else {
  //     rsp.json({ success: true });
  //   }
  // });
}
