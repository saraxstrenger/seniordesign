import * as db from "./database.js";

console.log("hello");
// db.updateInterests("mario", ["physics"], (err, data) => {
//   if (err) {
//     console.log("Error", err.stack);
//   } else {
//     console.log("Success", JSON.stringify(data));
//   }
// });


db.getUser("mario", (err, data) => {
  if (err) {
    console.log("Error", err.stack);
  } else {
    console.log("Success", JSON.stringify(data));
  }
});