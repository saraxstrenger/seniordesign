import * as db from "./database.js";

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
  req.session.user = null;
  req.session.save(function (err) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.destroy();
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
  console.log("user: " + user + " pass: " + pass);
  const password = await db.getPassword(user, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, error: "Incorrect username or password" });
    } else {
      const password = data.Item.password;
      if (password !== null && password === pass) {
        // req.session.regenerate(function (err) {
        //   if (err) {
        //     console.log("error during cookie generation");
        //     next(err);
        //   }
        //   // store user information in session, typically a user id
        //   req.session.user = req.body.user;

        //   // save the session before redirection to ensure page
        //   // load does not happen before session is saved
        //   req.session.save(function (err) {
        //     console.log("session saved");
        //     if (err) {
        //       console.log("error saving session");
        //       return next(err);
        //     }
        //     res.json({ success: true });
        //   });
        // });
        const session = req.session;
        session.userid = user;
        res.json({ success: true });
      } else {
        res.json({ success: false, error: "Incorrect username or password" });
      }
    }
  });
}

function nonEmptyStr(str) {
  return str && str.length > 0;
}

function isEmail(email) {
  //TODO
  return true;
}

function isYear(yearStr) {
  return !isNaN(num);
}

export function signup(req, res) {
  const params = req.body;
  params.year = parseInt(params.year, 10);
  if (
    nonEmptyStr(params.first) ||
    nonEmptyStr(params.last) ||
    nonEmptyStr(params.username) ||
    nonEmptyStr(params.password) || // todo: password validation? letters, numbers etc
    isEmail(params.email) ||
    isYear(params.entranceYear) ||
    nonEmptyStr(params.major)
  ) {
    // send error code
  }

  // try to create db entry
  db.createUser(params, (err, data) => {
    if (err) {
      console.log("Error", err.stack);
      res.json({ success: false, error: "Username already exists" });
    } else {
      res.json({ success: true });
    }
  });
}

export function addClass(req, res) {
  console.log("add class request received");
  const params = req.body;
  const session = req.session;
  if (session?.userid) {
    db.addClass(userid, params, (err, data) => {
      if (err) {
        console.log("Error", err.stack);
        res.json({ success: false, error: "Class already exists" });
      } else {
        res.json({ success: true });
      }
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}
