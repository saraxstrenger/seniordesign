import * as routes from "./endpoints.js";
const PORT = 3001;

// import path from "path" ;
import express from "express";

// const express = require("express");
// const cookieParser = require("cookie-parser");
import cookieParser from "cookie-parser";

// const bodyParser = require("body-parser");
import bodyParser from "body-parser";

import session from "express-session";

import http from "http";
// var sessions = require("express-session");

/* Session Setup */
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(bodyParser.json());
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
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
var httpServer = http.createServer(app);

// TODO: connect to dynamo
const usernames = ["sara", "janavi", "suvas", "kat", "saurabh"];

// Session management setup

// middleware to test if authenticated
// source: https://www.npmjs.com/package/express-session
function isAuthenticated(req, res, next) {
  console.log(req.session);
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

app.get("/auth", routes.auth);

app.get("/evaluations/:id", isAuthenticated, (req, res) => {
  console.log("evaluations request received");
  routes.getEvaluations(req, res);
});
app.get("/evaluations", isAuthenticated, routes.getEvaluations);
app.get("/profile", isAuthenticated, routes.getProfile);
// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.redirect("/");
});

// POST REQUESTS
app.post("/logout", isAuthenticated, routes.logout);
app.post("/login", express.urlencoded({ extended: false }), routes.login);
app.post("/signup", routes.signup);
app.post("/addCourse", isAuthenticated, routes.addCourse);
app.post("/search", isAuthenticated, routes.getReccomendations);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
