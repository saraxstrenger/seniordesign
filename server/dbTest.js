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

// db.removeInterest("testUser", "interest", (err, data) => {
//     if(err) console.log(err);
//     else console.log(data);
// });

// const params = { department: "CIS", number: "1210", year: "2020", semester: "Spring", difficulty: "3.5", interest: "4", workload:[4,4,4,4]};
// db.addEvaluation("skota", params, (err, data) => {
//     if (err) {
//         console.log("Error", err.stack);
//     } else {
//         console.log(data);
//     }
// });

// const params = { department: "CIS", number: "1210", year: "2020", semester: "Spring"};
// db.deleteEvaluation("skota", params, (err, data) => {
//     if (err) {
//         console.log("Error", err.stack);
//     } else {
//         console.log(data);
//     }
// });

// const params = { courseId: "CIS 1210"};
// db.addLikedCourse("skota", params, (err, data) => {
//     if (err) {
//         console.log("Error", err.stack);
//     } else {
//         console.log(data);
//     }
// });