import csv from "csvtojson";
import {ddbDocClient} from "../server/ddbDocClient.js";

const COURSE_FILEPATH = "./course_catalog.csv";
const COURSE_TABLE = "courses";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadCourses() {
  const courses = await csv().fromFile(COURSE_FILEPATH);

  /**
   * categories:
   * id,title,description,interest,difficulty
   */
  const putRequests = courses.map((course) => {
    const putOperation = {
      PutRequest: {
        Item: {
          code: course["code"],
          title: course["title"],
          description: course["description"],
          difficulty: course["difficulty"],
          interest: course["interest"],
        },
      },
    };
    return putOperation;
  });

  const batchSize = 25; // number of items to write per batch
  const batches = Math.ceil(putRequests.length / batchSize);

  console.log(`Writing ${putRequests.length} items in ${batches} batches...`)
  for (let i = 0; i < batchSize; i++) {
    const batchItems = putRequests.slice(
      i * batchSize,
      Math.min((i + 1) * batchSize, putRequests.length)
    );
    const params = {
      RequestItems: {
        [COURSE_TABLE]: batchItems,
      },
    };

    const result = await ddbDocClient.batchWrite(params, (err, data) => {
      if (err) {
        console.error("Error writing batch:", i, err);
        return false;
      } else {
        console.log(`Batch ${i + 1}/${batches} written successfully`);
        return true;
      }
    });
    if (!result) {
      break;
    }
    await sleep(500);
  }
}

await uploadCourses();
