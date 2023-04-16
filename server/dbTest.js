import * as db from "./database.js";

import stopword from "stopword";
import natural from "natural";
import { stemmer } from "stemmer";
// import { getReccomendations } from "./endpoints.js";
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

// getReccomendations("sara", "CIS 5210");

db.removeInterest("larry", "0", (err, data) => {
    if (err) {
        console.log("Error", err);
    }
    else {
        console.log("Success", data);
    }
});
