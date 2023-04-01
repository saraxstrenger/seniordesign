import stopword from 'stopword';
import natural from 'natural';
import fs from 'fs';
import csv from 'csvtojson';
import aws from 'aws-sdk';

aws.config.update({
  region: 'us-east-1',
  credentials: new aws.Credentials({
    accessKeyId: 'AKIA3TXP5GDN355XASFM',
    secretAccessKey: '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'
  })
});

async function readCSVFile() {
  const tokenizer = new natural.WordTokenizer();
  const courses = await csv().fromFile('course_catalog.csv');
  const dynamodb = new aws.DynamoDB.DocumentClient();
  console.log(courses[0]);
  fs.writeFileSync('course_catalog.json', JSON.stringify(courses))
  courses.forEach(course => { 
    var titleTokens = tokenizer.tokenize(course['courseTitle'])
    titleTokens = stopword.removeStopwords(titleTokens)

    var codeTokes = tokenizer.tokenize(course['id'])

    var tokens = titleTokens.concat(codeTokes)

    course.courseCode = course.id
    delete course.id
    var requests = []
    tokens.forEach(token => {
      // console.log(typeof token);
      // console.log(typeof course.courseCode);
      const request = {
        PutRequest: {
          // Item: {
          //   'word': {S: token},
          //   'courseCode': {S: course.courseCode},
          //   'courseTitle': {S: course.courseTitle},
          //   'courseDescription': {S: course.courseDescription},
          //   'interest': {S: course.interest},
          //   'difficulty': {S: course.difficulty}
          // }
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
      //console.log(request)
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

