routes = require("./routes.js");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 8080;

const app = express();

// have node serve the files for our built react app
app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.redirect("/index");
});

app.get("/index", (req, res) => {
  res.json({ message: "server information" });
  console.log("in index part 2");
});

app.get("/api", (req, res) => {
  console.log("connected to api");
  res.json({ message: "Hello from server!" });
});

app.post("/post", (req, res) => {
  console.log("connected to react2");
  res.redirect("/");
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});
// app.get('/home', routes.getHomepage);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
