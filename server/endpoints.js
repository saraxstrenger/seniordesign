import * as db from "./database.js";
import { spawn } from "child_process";
import dgram from "dgram";

const COLLAB_SCRIPT = "./RecSystem/CollabFilterRecommender.py";
const EMBEDDING_SCRIPT = "./RecSystem/EmbeddingRecommender.py";
const REC_SERVER_PORT = 3030;

export function auth(req, res) {
  if (req.session?.userid) {
    res.send(200); // OK - user is logged in
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
  req.session.user = null;
  req.session.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    // req.session.destroy();
    req.session.regenerate(function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
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
  //TODO
  return true;
}

function isNumber(num) {
  return !isNaN(num);
}

export function signup(req, res) {
  const params = req.body;
  params.year = parseInt(params.year, 10);
  if (
    isEmptyStr(params.first) ||
    isEmptyStr(params.last) ||
    isEmptyStr(params.username) ||
    isEmptyStr(params.password) || // todo: password validation? letters, numbers etc
    isEmail(params.email) ||
    isNumber(params.entranceYear) ||
    isEmptyStr(params.major)
  ) {
    // send error code
  }

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

export function addCourse(req, res) {
  console.log("add class request received");
  const params = req.body;
  const session = req.session;
  console.log(session.userid);
  if (session?.userid) {
    db.addCourse(session.userid, params, (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Class already exists" });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
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
  const evalId = req.params.id;
  const evalInfo = evalId.split("_");
  const evalOwner = evalInfo[0];
  // only the owner of the eval should be able to access it
  if (session?.userid && evalOwner == session.userid) {
    db.getEval(id, (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, errorMsg: "Unable to perform operation." });
      } else {
        res.json({ success: true, data: data });
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
    !isNumber(params.entranceYear) ||
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

export function updateInterests(req, res) {
  if (!req.session?.userid) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  const newInterests = req.body?.interests;

  if (newInterests === undefined) {
    res.json({ success: false, errorMsg: "Unable to perform operation." });
    return;
  }
  db.updateInterests(req.session.userid, newInterests, (err, data) => {
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

/**
 * Queues a user to be updated in the recommendation server
 * @param {string} user 
 */
export function queueUser(args) {
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
