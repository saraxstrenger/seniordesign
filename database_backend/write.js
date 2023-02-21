var AWS = require("aws-sdk");
let awsConfig = {
    "region": "us-east-1",
    "endpoint": "http://dynamodb.us-east-1.amazonaws.com",
    "accessKeyId": "XXXXXXXX", "secretAccessKey": "XXXXXXXXX"
};
AWS.config.update(awsConfig);

let docClient = new AWS.DynamoDB.DocumentClient();

let save = function () {

        //Populating the Evaluation Table
        const fs = require('fs')
        const csv = require('fast-csv');
        const data = [];
     
        fs.createReadStream('./test_evaluations.csv')
            .pipe(csv.parse({ headers: true }))
            .on('error', error => console.error(error))
            .on('data', row => data.push(row))
            .on('end', function(){
                for (i = 0; i < data.length; i++) {
                    if (data[i]["e_id"] != 0) {
                        var input = {
                            "Evaluation_Id": data[i]["e_id"], 
                            "Course_Code": data[i]["code"], 
                            "Difficulty": data[i]["difficulty"], 
                            "Interest": data[i]["interest"]
                        };
                        var params = {
                            TableName: "Evaluation_Table",
                            Item:  input
                        };
                        docClient.put(params, function (err, data) {
                    
                            if (err) {
                                console.log("users::save::error - " + JSON.stringify(err, null, 2));                      
                            } else {
                                console.log("users::save::success" );                      
                            }
                        });
                    } 
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