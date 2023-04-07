import * as routes from "./endpoints.js";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import http from "http";
import cookieSession from "cookie-session";

const PORT = 3001;
/* Session Setup */
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json());
app.set("trust proxy", 1); // trust first proxy
app.use(
  cookieSession({
    name: "session",
    keys: ["keyboard cat"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: false
  })
  // session({
  //   resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
  //   saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
  //   secret: "keyboard cat", // used to sign session ID cookie
  //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
  //   name: "session",
  //   // cookie: { secure: true }, // cookie: Settings object for the session ID cookie.
  // })
);
app.use(cookieParser());
var httpServer = http.createServer(app);

// Session management setup

// middleware to test if authenticated
// source: https://www.npmjs.com/package/express-session
function isAuthenticated(req, res, next) {
  console.log(req.session);
  if (req.session.userid) {
    console.log(
      "request body" + JSON.stringify(req.body ?? { body: "no body" })
    );
    next();
  } else {
    console.log("user not logged in");
    res.send("/"); // Unauthorized
  }
}

// GET REQUESTS

app.get("/auth", routes.auth);

app.get("/evaluations/:id", isAuthenticated, routes.getEvaluation);
app.get("/evaluations", isAuthenticated, routes.getEvaluations);
app.get("/profile", isAuthenticated, routes.getProfile);
app.get("/course/:id", isAuthenticated, routes.getCourseInfo);
app.get("/home", isAuthenticated, routes.getHome);
// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  // TODO: 404 page?
  res.redirect("/");
});

// POST REQUESTS
app.post("/logout", isAuthenticated, routes.logout);
app.post("/login", express.urlencoded({ extended: false }), routes.login);
app.post("/signup", routes.signup);
app.post("/addEvaluation", isAuthenticated, routes.addEvaluation);
app.post("/search", isAuthenticated, routes.getReccomendations);
app.post("/updateProfile", isAuthenticated, routes.updateProfile);
app.post("/addInterest", isAuthenticated, routes.addInterest);
app.post("/removeInterest", isAuthenticated, routes.removeInterest);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
