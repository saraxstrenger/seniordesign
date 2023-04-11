import stopword from "stopword";
import natural from "natural";
import csv from "csvtojson";
import { stemmer } from "stemmer";
import { ddbDocClient } from "../server/ddbDocClient.js";
const INDEX_TABLE = "index";
// make sure to add your aws credentials to a config.json file
// const config = JSON.parse(fs.readFileSync("config.json"));

// aws.config.update(config);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readCSVFile() {
  // SEND WORDS TO LOWER CASE
  // TOKENIZE
  // REMOVE STOP WORDS
  // STEMMER

  const invertedIndex = {};
  const phraseToTokens = (phrase) => {
    var normalized = phrase.toLowerCase();
    var tokens = tokenizer.tokenize(normalized);
    tokens = stopword.removeStopwords(tokens);
    tokens = tokens.map((token) => stemmer(token));
    return tokens;
  };

  const tokenizer = new natural.WordTokenizer();
  const courses = await csv().fromFile("course_catalog.csv");
  // const dynamodb = new aws.DynamoDB.DocumentClient();
  courses.map((course) => {
    var titleTokens = phraseToTokens(course["courseTitle"]);
    var codeTokes = phraseToTokens(course["id"]);
    // var courseDescriptionTokens = phraseToTokens(course["courseDescription"]);

    var codeTokens = course["id"].toLowerCase().split(" ");
    var tokens = titleTokens
      .concat(codeTokes)
      .concat(courseDescriptionTokens)
      .concat(codeTokens);
    tokens = [...new Set(tokens)];
    // const tokenList = Array.from(tokens);
    tokens.forEach((token) => {
      if (invertedIndex[token] == undefined) {
        invertedIndex[token] = [course["id"]];
      } else {
        invertedIndex[token].push(course["id"]);
      }
    });
  });

  const tokens = Object.keys(invertedIndex);
  const requests = tokens.map((token) => {
    return {
      token: token,
      courses: invertedIndex[token],
    };
  });

  const batchSize = 25; // number of items to write per batch
  const batches = Math.ceil(tokens.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const batchItems = requests.slice(
      i * batchSize,
      Math.min((i + 1) * batchSize, tokens.length)
    );
    const params = {
      RequestItems: {
        [INDEX_TABLE]: batchItems.map((item) => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    };

    const result = await ddbDocClient.batchWrite(params, (err, data) => {
      if (err) {
        console.error("Error writing batch:", err);
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

await readCSVFile();
