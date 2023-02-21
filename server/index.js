const PORT = 3001;

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var sessions = require("express-session");

/* Session Setup */
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json());
app.set("trust proxy", 1); // trust first proxy
app.use(
  sessions({
    // genid: function(req) {
    //   return genuuid() // use UUIDs for session IDs
    // },
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    secret: "keyboard cat", // used to sign session ID cookie
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    name: "session",
    // cookie: { secure: true }, // cookie: Settings object for the session ID cookie.
  })
);
app.use(cookieParser());
var http = require("http").createServer(app);

const usernames = ["sara", "janavi", "suvas", "kat", "saurabh"];

// Session management setup
// middleware to test if authenticated

// source: https://www.npmjs.com/package/express-session
function isAuthenticated(req, res, next) {
  if (req.session.userid) {
    next();
  } else {
    console.log("user not logged in");
    res.redirect("/");
  }
}

// GET REQUESTS
app.get("/home", isAuthenticated, (req, res) => {
  console.log("home request received");
  if (req.session?.userid) {
    res.json({ message: "You are logged in!" });
  } else {
    res.json({ message: "You are not logged in!" });
  }
});

app.get("/auth", (req, res) => {
  if (req.session?.userid) {
    res.sendStatus(200); // OK - user is logged in
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.redirect("/");
});

// source: https://www.npmjs.com/package/express-session
app.post("/logout", isAuthenticated, function (req, res, next) {
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
    req.session.regenerate(function (err) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// POST REQUESTS
// POST method route
app.post("/login", express.urlencoded({ extended: false }), (req, res) => {
  user = req.body.username;
  pass = req.body.password;
  console.log("Login request received");

  if (usernames.includes(user) && pass == "pass") {
    session = req.session;
    session.userid = user;
    res.json({ success: true });
  } else {
    res.json({ success: false, error: "Incorrect username or password" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
