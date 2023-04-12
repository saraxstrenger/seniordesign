import * as db from "./database.js";

import stopword from "stopword";
import natural from "natural";
import { stemmer } from "stemmer";
db.getCourseInfo("CIS 1600", (err, data) => {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
})
