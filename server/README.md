# Part 1: Necessary File Modification

If you haven't yet set up your local SQLite database, skip to Part 2 first and then come back to Part 1. Once you have set up your local SQLite database, make sure to modify the value of LOCAL_DB_PATH variable in server/database.js to the file path of your local SQLite database (should be right below all the import statements). To find the path to your local database, run .databases in the sqlite3 shell (if you don't know what this is, look at Part 2). As an example you enter:
```
sqlite> .databases
```
And then the terminal should return:
```
main: /Users/suvaskota/Downloads/seniordesign.sqlite r/w
```
So now, I update the LOCAL_DB_PATH variable in database.js in the following manner:
```
const LOCAL_DB_PATH = "/Users/suvaskota/Downloads/seniordesign.sqlite";
```


# Part 2: Setting up SQLite Database locally

1. Go to the following link (https://www.sqlite.org/download.html) and download the appropriate SQLite package based on Mac or Windows

2. Navigate in your terminal to the directory containing this repo. This is where the database will be located. 
   Create the database with the following command:
   ```
   $ sqlite3 seniordesign.sqlite 
   ```
   This creates a database called seniordesign in your chosen directory. Once you enter this command, you should enter the sqlite shell, i.e, each line on    the terminal should start with:
   ```
   sqlite>
   ```

3. Now we can create an evaluations table within the local database with the following code:
     ```
     CREATE TABLE evaluations (
        id  TEXT PRIMARY KEY, 
        number TEXT, 
        semester TEXT, 
        year TEXT, 
        user TEXT,
        difficulty INTEGER, 
        interest INTEGER, 
        department TEXT, 
        workload1 INTEGER, 
        workload2 INTEGER, 
        workload3 INTEGER, 
        workload4 INTEGER);
      ```
4. To check if a table has been created, you can enter 
   ```
   .tables 
   ```
    and it should return with "evaluations"

5. The data to upload to this table is in seniordesign/data/new_course_evals.csv

6. To upload this csv to the table, we first enter 
   ```.mode csv```
   Then we execute the following command: 
    ```
    .import filepathtocsv evaluations
   ```
   where evaluations is the name of the table we want to upload it to. Make sure to change "filepathtocsv" to the actual filepath of the csv file.

7. To confirm if this worked, run the following query:
   ``` 
   SELECT * FROM evaluations;
   ```
   and it should display all the contents of the table

8. To exit the sqlite shell, type 
   ```
   .exit 
   ```
   If you want to go back to the database, run this following command in the directory where your database is
    ```
   $ sqlite3 seniordesign.sqlite 
   ```
