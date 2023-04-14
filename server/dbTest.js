import * as db from "./database.js";

import stopword from "stopword";
import natural from "natural";
import { stemmer } from "stemmer";
// db.getCourseInfo("CIS 1600", (err, data) => {
//     if (err) {
//         console.log("Error", err);
//     } else {
//         console.log("Success", data);
//     }
// })

// db.deleteEvaluation("sara", "janavic_cis_1605_2022_Fall", (err, data) => {
//     if (err) {
//         console.log("Error", err);
//     }
//     else {
//         console.log("Success", data);
//     }
// });

const num = "5"
if(num < 6){
    console.log("true")
}

if(num > 4){
    console.log("true")
}