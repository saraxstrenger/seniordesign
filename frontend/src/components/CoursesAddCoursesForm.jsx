import React, { useState } from "react";
import styles from "./css/utils.module.css";

const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

export default function CoursesAddCoursesForm(props) {
  const { evaluations, setEvaluations } = props;
  const [department, setDepartment] = useState("");
  const [number, setNumber] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [difficulty, setDifficulty] = useState(-1);
  const [interest, setInterest] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");

  const [addCourse, setAddCourse] = useState(false);
  const tryAddCourses = async function (e) {
    e.preventDefault();
    let res = await fetch("/addCourse", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        // use cookie to get user
        department,
        number,
        semester,
        year,
        difficulty,
        interest,
      }),
    });
    let resJson = await res.json();
    console.log("resjson: ", resJson);
    if (resJson.success === true) {
      const updated = evaluations.concat([
        { department, number, semester, year, difficulty, interest },
      ]);
      setEvaluations(updated);
      setAddCourse(false);
    } else {
      setErrorMsg(
        resJson?.errorMsg ?? "Unable to add course. Please try again and verify that the course is not already in your list."
      );
    }
  };

  return (
    <div style={{ minWidth: "75%" }}>
      {!addCourse ? (
        <div style={{ width: "100%", ...row}}>
          <center>
            <button onClick={() => setAddCourse("true")}>Add Course</button>
          </center>
        </div>
      ) : (
        <>
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
                name="number"
                id="number"
                type="number"
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                placeholder={"Course # (e.g. 1600)"}
                min={1}
                required
              />

              <select
                className={styles.inputWrapping}
                name="semester"
                id="semester"
                onChange={(e) => setSemester(e.target.value)}
                required
              >
                <option label="-"></option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>

              <input
                className={styles.inputWrapping}
                name="year"
                id="year"
                type="number"
                step="1"
                min={2015}
                max={new Date().getFullYear()}
                onChange={(e) => setYear(e.target.value)}
                value={year}
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
            {errorMsg !== "" ? (
              <center>
                <div style={{ color: "red", fontSize: "small" }}>
                  {errorMsg}
                </div>
              </center>
            ) : null}
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
                onClick={() => setAddCourse(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
