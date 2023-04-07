import * as db from "./database.js";
import { spawn } from "child_process";
import dgram from "dgram";

const COLLAB_SCRIPT = "./RecSystem/CollabFilterRecommender.py";
const EMBEDDING_SCRIPT = "./RecSystem/EmbeddingRecommender.py";
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
  const user = req.body.username;
  const pass = req.body.password;
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

function isEmail(email) {

  if(!email) return false;

  const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  return emailRegex.test(email);
}

function isValidYear(year) {
  if (isNaN(year)) return false;

  if (year < 2000) return false;

  const currentYear = new Date().getFullYear();
  if (year > currentYear) return false;

  return true;
}
export function signup(req, res) {
  console.log("signup request received");
  const params = req.body;
  console.log(params);
  params.year = parseInt(params.year, 10);
  if (
    isEmptyStr(params.first) ||
    isEmptyStr(params.last) ||
    isEmptyStr(params.username) ||
    isEmptyStr(params.password) || // todo: password validation? letters, numbers etc
    !isEmail(params.email) ||
    !isValidYear(params.entranceYear) ||
    isEmptyStr(params.major)
  ) {
    res.json({ success: false, errorMsg: "Invalid input" });
    return;
  }

  console.log("params valid");
  // try to create db entry
  db.createUser(params, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Username already exists" });
    } else {
      setCookie(req.session, params.username);
      res.json({ success: true });
    }
  });
}

function isValidRating(rating) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

function isValidWorkload(workload) {
  if (
    workload === undefined ||
    !Array.isArray(workload) ||
    workload.length != 4
  ) {
    return false;
  }

  for (let i = 0; i < workload.length; i++) {
    if (isNaN(workload[i]) || workload[i] < 0 || workload[i] > 5) {
      return false;
    }
  }
  return true;
}

export function addEvaluation(req, res) {
  console.log("add class request received");
  const params = req.body;
  const session = req.session;
  console.log(session.userid);
  console.log(req.body);
  if (!session.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }

  const interest = req.body?.interest;
  const difficulty = req.body?.difficulty;
  const workload = req.body?.workload;
  const year = parseInt(req.body?.year, 10);
  const semester = req.body?.semester;
  const department = req.body?.department;
  const number = parseInt(req.body?.number, 10);
  const validSemesters = ["Fall", "Spring", "Summer"];
  if (
    !isValidRating(interest) ||
    !isValidRating(difficulty) ||
    !isValidWorkload(workload) ||
    isNaN(year) ||
    semester === undefined ||
    !validSemesters.includes(semester) ||
    !department ||
    !department?.length ||
    !department?.length > 0 ||
    isNaN(number)
  ) {
    res.json({
      success: false,
      errorMsg: "Invalid parameters! Please ensure all form inputs are valid.",
    });
  }
  db.addEvaluation(session.userid, params, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Class already exists" });
    } else {
      res.json({ success: true });
    }
  });
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

export function getReccomendations(req, res) {
  const session = req.session;
  if (session?.userid) {
    const searchTerm = req.body.searchTerm;
    if (searchTerm == undefined) {
      console.log("get Recommendations failed");
      res.json({ success: false, errorMsg: "Unable to perform operation." });
      return;
    }
    const pythonProcess = spawn("python3", [
      "-u",
      EMBEDDING_SCRIPT,
      "-i",
      searchTerm,
      "-n",
      "3",
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
      console.log(data.toString());
    });

    pythonProcess.stderr.on("data", (data) => {
      // Do something with the data returned from python script
      err += data.toString();
      console.log(data.toString());
    });

    pythonProcess.on("exit", (code) => {
      console.log(`child process finished with code ${code}`);
      console.log("response: " + response);
      const data = response.split("\n");
      res.json({ success: true, searchTerm, data: data });
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
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
  const courseId = req.params.id;
  db.getCourseInfo(courseId, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, errorMsg: "Unable to perform operation." });
    } else {
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
