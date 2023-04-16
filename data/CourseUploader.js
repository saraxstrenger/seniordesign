import csv from "csvtojson";
import { ddbDocClient } from "../server/ddbDocClient.js";

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
  let hasUnprocessedItems = false;
  console.log(`Writing ${putRequests.length} items in ${batches} batches...`);
  for (let i = 0; i < batches && hasUnprocessedItems === false; i++) {
    const batchItems = putRequests.slice(
      i * batchSize,
      Math.min((i + 1) * batchSize, putRequests.length)
    );
    const params = {
      RequestItems: {
        [COURSE_TABLE]: batchItems,
      },
    };
    console.log(
      `writing lines ${i * batchSize} to ${Math.min(
        (i + 1) * batchSize,
        putRequests.length
      )}... `
    );
    const result = await ddbDocClient.batchWrite(params, (err, data) => {
      if (err) {
        console.error("Error writing batch:", i, err);
        return false;
      } else {
        console.log(`Batch ${i + 1}/${batches} written successfully`);
        if (data.UnprocessedItems.length > 0) {
          console.log("Unprocessed items:", data.UnprocessedItems);
          hasUnprocessedItems = true;
        }
        return true;
      }
    });
    if (!result) {
      break;
    }
    await sleep(1000);
  }
}

await uploadCourses();
