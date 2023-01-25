const express = require("express");

const PORT = 3001;

const app = express();

app.get("/home", (req, res) => {
    res.json({ message: "Hello from server!" });
  });


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


