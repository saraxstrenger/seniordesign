import stopword from 'stopword';
import natural from 'natural';
import fs from 'fs';
import csv from 'csvtojson';
import aws from 'aws-sdk';

// make sure to add your aws credentials to a config.json file
const config = JSON.parse(fs.readFileSync('config.json'));

aws.config.update(config);

async function readCSVFile() {
  const tokenizer = new natural.WordTokenizer();
  const courses = await csv().fromFile('course_catalog.csv');
  const dynamodb = new aws.DynamoDB.DocumentClient();
  console.log(courses[0]);
  courses.forEach(course => { 
    var titleTokens = tokenizer.tokenize(course['courseTitle'])
    titleTokens = stopword.removeStopwords(titleTokens)

    var codeTokes = tokenizer.tokenize(course['id'])

    var tokens = new Set(titleTokens.concat(codeTokes))

    course.courseCode = course.id
    delete course.id
    var requests = []
    tokens.forEach(token => {
      const request = {
        PutRequest: {
          Item: {
            'word': token,
            'courseCode': course.courseCode,
            'courseTitle': course.courseTitle,
            'courseDescription': course.courseDescription,
            'interest': course.interest,
            'difficulty': course.difficulty
          }
        }
      }

      requests.push(request)
  })

  const params = {
    RequestItems: {
      'invertedIndex': requests
    }
  }

  dynamodb.batchWrite(params, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data)
    }
  }) 
  })
}


readCSVFile()

