import React, { useState } from "react";
import styles from "./css/utils.module.css";

const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

export default function CoursesAddCoursesForm(props) {
  const [department, setDepartment] = useState("");
  const [courseNumber, setCourseNumber] = useState("");
  const [semesterTaken, setSemesterTaken] = useState("");
  const [yearTaken, setYearTaken] = useState("");
  const [difficulty, setDifficulty] = useState(-1);
  const [interest, setInterest] = useState(-1);

  const tryAddCourses = function (e) {
    e.preventDefault();
    console.log("tryAddCourses");
    console.log(department);
    console.log(courseNumber);
    console.log(semesterTaken);
    console.log(yearTaken);
    console.log(difficulty);
    console.log(interest);

    props.afterFormSubmit();
  };
  return (
    <div style={{ minWidth: "75%" }}>
      <h2 style={{ margin: 0 }}>New Course:</h2>
      <form style={col} onSubmit={tryAddCourses}>
        <div style={row}>
          <input
            className={styles.inputWrapping}
            name="department"
            id="department"
            type="text"
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            placeholder={"Course Dept (e.g. CIS)"}
            required
          />

          <input
            className={styles.inputWrapping}
            name="courseNumber"
            id="courseNumber"
            type="number"
            onChange={(e) => setCourseNumber(e.target.value)}
            value={courseNumber}
            placeholder={"Course # (e.g. 1600)"}
            min={1}
            required
          />

          <select
            className={styles.inputWrapping}
            name="semesterTaken"
            id="semesterTaken"
            onChange={(e) => setSemesterTaken(e.target.value)}
            required
          >
            <option label="-"></option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>

          <input
            className={styles.inputWrapping}
            name="yearTaken"
            id="yearTaken"
            type="number"
            step="1"
            min={2015}
            max={new Date().getFullYear()}
            onChange={(e) => setYearTaken(e.target.value)}
            value={yearTaken}
            placeholder={"Year Taken"}
            required
          />
        </div>
        <div style={row}>
          <div>
            <label className={styles.inputWrapping} for="interest">
              Interest:
            </label>

            <select
              className={styles.inputWrapping}
              name="interest"
              id="interest"
              onChange={(e) => setInterest(e.target.value)}
              required
            >
              <option label="-"></option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div>
            <label className={styles.inputWrapping} for="difficulty">
              Difficulty:
            </label>
            <select
              className={styles.inputWrapping}
              name="difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option unselectable label="-"></option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
        <div style={{ ...row, justifyContent: "center" }}>
          {/* <button className={styles.inputWrapping} type="button">
          Add Another Course
        </button> */}
          <input
            className={styles.inputWrapping}
            type="submit"
            value="Submit"
          />
          <button
            className={styles.inputWrapping}
            onClick={props.afterFormSubmit}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
