var getIndex = function (req, res) {
  res.json({ message: "Info for index" });
};

var getHomepage = function (req, res) {
  res.json({ message: "Info for /home" });
  // return res.render("login.ejs", { errorMessage: null });
};

var routes = {
  getIndex: getIndex,
  getHomepage: getHomepage,
};
