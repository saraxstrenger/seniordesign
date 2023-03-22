import * as db from "./database.js";

console.log("hello");
db.addCourse(
  "sara",
  {
    department: "FREN",
    number: 1210,
    year: 2019,
    semester: "Fall",
    difficulty: 3,
    interest: 3,
  },
  (err, data) => {
    if (err) {
      console.log("Error", err.stack);
    } else {
      console.log("Success", data.Item);
    }
  }
);
