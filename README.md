# Compass

Welcome to Compass, our (Janavi Chadha, Suvas Kota, Saurabh Shah, Sara Strenger, Kat Wang) Senior Design Project! 
Compass aims to provide useful course reccomendations to Penn students. Right now we are focusing on two types of reccomendations:
1. Reccomending based on career interests/goals
2. Reccomending based on predicted interest scores

(1) Is implemented using modern neural embeddings (e.g. BERT and family) while (2) is implemented using classical collaborative filtering. 

To add AWS 

Open the IAM console at https://console.aws.amazon.com/iam/.

On the navigation menu, choose Users.

Choose your IAM user name (not the check box).

Open the Security credentials tab, and then choose Create access key.

To see the new access key, choose Show. Your credentials resemble the following:

Access key ID: AKIAIOSFODNN7EXAMPLE

Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

To download the key pair, choose Download .csv file. Store the .csv file with keys in a secure location.


Go to the senior design folder and navigate to the server folder add a file called config.json that will have the following 

{
    "accessKeyId" : "your_accessKeyId",
    "secretAccessKey" : "your_secretAccessKeyId",
    "region" : "your_region",
    "endpoint" : "your_endpoint"
}



To run : 
From the senior design folder run the following two lines : 
1 ) npm install
2 ) npm start 

In a seperate terminal navigate to frontend folder  and run the following two lines : 
1 ) npm install
2 ) npm start 