# Rec System
Before using this, make sure you run 
```
pip install -r requirements.txt
```
This is the "brain" of the reccomendations. Here you'll find two scipts for creating reccomendations:
1. EmbeddingRecommender.py
2. CollabFilterRecommender.py

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

<<<<<<< HEAD
<<<<<<< HEAD
```
=======
```
>>>>>>> made rec system more friendly for use from node
=======
```
>>>>>>> Update README.md
