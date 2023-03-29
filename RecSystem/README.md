# Rec System
Before using this, make sure you run 
```
pip3 install -r requirements.txt
```
This is the "brain" of the reccomendations. Here you'll find three scipts for creating reccomendations:
1. EmbeddingRecommender.py
2. CollabFilterRecommender.py
3. Database.py

You can call them as so
```
python3 EmbeddingRecommender.py -i "Machine Learning" -n 3
```
^This will retrieve 3 course recs for the topic/interest "Machine Learning"

```
python3 CollabFilterRecommender.py -s s10 -c "CIS 2400" -p difficulty
```
^This will return the predicted difficulty for student "s10" for the coures CIS 2400. 
You can toggle -p interest to predict interest instead.

```
python3 Database.py -u saurabh -i "Natural Language Processing" -n 5
```
^This will upload to the DynamoDB users table. It will add 5 course recs for user saurabh for an interest Natural Language Processing.

You can run python scripts from the Node app as follows:
```javascript
const { spawn } = require('child_process');

const collabScript = '/../RecSystem/CollabFilterRecommender.py';

const pythonProcess = spawn('python', [collabScript]);

pythonProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

