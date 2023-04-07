import * as db from "./database.js";
// import * as req from "./endpoints.js";

// db.createUser(
//   {
//     username: "testUser",
//     password: "pass",
//     first: "first",
//     last: "last",
//     email: "test@gmail.com",
//     entranceYear: 2019,
//     major: "Test Major",
//   },
//   (err, data) => {}
// );

db.removeInterest("testUser", "interest", (err, data) => {
    if(err) console.log(err);
    else console.log(data);
});
