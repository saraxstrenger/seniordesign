var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "XXXXXXXXXXXX", "secretAccessKey": "XXXXXXXXXXX"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {

        //Populating the Evaluation Table
        const fs = require('fs')
        const csv = require('fast-csv');
        const data = [];
        const items = [];
     
        fs.createReadStream('./new_course_evals.csv')
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => data.push(row))
            .on('end', function(){
                for (i = 0; i < data.length; i++) {
                    if (data[i]["id"] != 0) {
                        var input = {
                            "id": data[i]["id"], 
                            "department": data[i]["department"], 
                            "difficulty": parseInt(data[i]["difficulty"]), 
                            "interest": parseInt(data[i]["interest"]),
                            "number": data[i]["number"],
                            "semester": data[i]["semester"],
                            "user": data[i]["user"],
                            "workload1": parseInt(data[i]["workload1"]),
                            "workload2": parseInt(data[i]["workload2"]),
                            "workload3": parseInt(data[i]["workload3"]),
                            "workload4": parseInt(data[i]["workload4"]),
                            "year": data[i]["year"],
                        };
                        items.push(input);
                    }
                }
                const batchSize = 25;
                const batchCount = Math.ceil(items.length / batchSize);
                for (let i = 0; i < batchCount; i++) {
                    const startIndex = i * batchSize;
                    const endIndex = Math.min((i + 1) * batchSize, items.length);
                    const batch = items.slice(startIndex, endIndex);
                    const params = {
                        RequestItems: {
                            'evaluations': batch.map(item => ({
                            PutRequest: { Item: item },
                            })),
                        },
                    };    
                    docClient.batchWrite(params, function (err, data) {
                        if (err) {
                            console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
                        } else {
                            console.log("users::save::success");                      
                        }
                    });
                } 
            })

        // Populating the User Table
        // const fs = require('fs')
        // const csv = require('fast-csv');
        // const data = [];
     
        // fs.createReadStream('./test_students.csv')
        //     .pipe(csv.parse({ headers: true }))
        //     .on('error', error => console.error(error))
        //     .on('data', row => data.push(row))
        //     .on('end', function(){
        //         for (i = 0; i < data.length; i++) {
        //             if (data[i]["id"] != 0) {
        //                 var input = {
        //                     "Username": data[i]["id"], 
        //                     "Class_List": data[i]["class_list"], 
        //                     "Standing": data[i]["standing"], 
        //                     "Major": data[i]["major"]
        //                 };
        //                 var params = {
        //                     TableName: "User_Table",
        //                     Item:  input
        //                 };
        //                 docClient.put(params, function (err, data) {
                    
        //                     if (err) {
        //                         console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        //                     } else {
        //                         console.log("users::save::success" );                      
        //                     }
        //                 });
        //             } 
        //         }
        //     })
    
        //Populating the Course Table
        // const fs = require('fs')
        // const csv = require('fast-csv');
        // const data = [];
    
        // fs.createReadStream('./test_courses.csv')
        //     .pipe(csv.parse({ headers: true }))
        //     .on('error', error => console.error(error))
        //     .on('data', row => data.push(row))
        //     .on('end', function(){
        //         for (i = 0; i < data.length; i++) {
        //             var input = {
        //                 "Course_Code": data[i]["Code2"], 
        //                 "Difficulty": data[i]["Difficulty"], 
        //                 "Interest": data[i]["Interest"], 
        //                 "Description": data[i]["Description"]
        //             };
        //             var params = {
        //                 TableName: "Course_Table",
        //                 Item:  input
        //             };
        //             docClient.put(params, function (err, data) {
                
        //                 if (err) {
        //                     console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
        //                 } else {
        //                     console.log("users::save::success" );                      
        //                 }
        //             });
        //         }
        //     })
}

save();