import React, { useState } from "react";
import styles from "./css/utils.module.css";
import WorkloadChart from "./WorkloadChart";
import "./css/Forms.css";

const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

const inputFormat = {
  border: "1px solid black",
  borderRadius: "10px",
  padding: "12px 16px",
  width: "40%",
  marginRight: "10px",
  fontSize: "16px",
  backgroundColor: "#f6f6f6",
  color: "#333333",
};

const buttonFormat = {
  borderRadius: "6px",
  border: "none",
  padding: "12px 32px",
  fontSize: "18px",
  fontWeight: "bold",
  backgroundColor: "#0077FF",
  color: "white",
  cursor: "pointer",
};

export default function CoursesAddCoursesForm(props) {
  const { evaluations, setEvaluations } = props;
  const [errorMsg, setErrorMsg] = useState("");
  const [workloadData, setWorkloadData] = useState([2, 2, 2, 2]);
  const [addCourse, setAddCourse] = useState(false);

  const resetForm = function () {
    setWorkloadData([2, 2, 2, 2]);
    setErrorMsg("");
  };

  const tryAddCourses = async function (e) {
    e.preventDefault();
    const courseData = {
      department: e.target.department.value,
      number: e.target.number.value,
      semester: e.target.semester.value,
      year: e.target.year.value,
      difficulty: parseInt(e.target.difficulty.value),
      interest: parseInt(e.target.interest.value),
    };
    let res = await fetch("/addCourse", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    let resJson = await res.json();
    if (resJson.success === true) {
      const updated = evaluations.concat([courseData]);
      setEvaluations(updated);
      setAddCourse(false);
      resetForm();
    } else {
      setErrorMsg(
        resJson?.errorMsg ??
          "Unable to add course. Please try again and verify that the course is not already in your list."
      );
    }
  };

  return (
    <div style={{ minWidth: "75%", padding: "8px" }}>
      {!addCourse ? (
        <div style={{ width: "100%", ...row }}>
          <center>
            <button
              style={{ ...buttonFormat }}
              onClick={() => setAddCourse(true)}
            >
              Add Course
            </button>
          </center>
        </div>
      ) : (
        <>
          <h2 style={{ margin: "20px 0" }}>New Course:</h2>
          <form style={col} onSubmit={tryAddCourses}>
            <div style={{ marginBottom: "20px", ...row }}>
              <input
                className={styles.inputWrapping}
                name="department"
                id="department"
                type="text"
                placeholder={"Course Dept (e.g. CIS)"}
                required
                style={inputFormat}
              />

              <input
                className={styles.inputWrapping}
                name="number"
                id="number"
                type="number"
                placeholder={"Course # (e.g. 1600)"}
                min={1}
                required
                style={{
                  ...inputFormat,
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />

              <select
                className={styles.inputWrapping}
                name="semester"
                id="semester"
                required
                style={inputFormat}
              >
                <option
                  value=""
                  style={{ color: "gray" }}
                  disabled
                  selected
                  hidden
                >
                  Semester
                </option>
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
                placeholder={"Year Taken"}
                required
                style={inputFormat}
              />
            </div>

            <div style={row}>
              <div style={{ width: "30%" }}>
              <label className={styles.inputWrapping}>
                  Interest:
                  <select
                    className={styles.inputWrapping}
                    name="interest"
                    id="interest"
                    type="number"
                    required
                    style={inputFormat}
                  >
                    <option label="-"></option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                  </label>
              </div>

              <div style={{ width: "30%" }}>
                <label className={styles.inputWrapping}>
                  Difficulty:
                  <select
                    className={styles.inputWrapping}
                    name="difficulty"
                    type="number"
                    required
                    style={inputFormat}
                  >
                    <option label="-"></option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>
              </div>
            </div>

            <div style={{ ...row, height: 350 }}>
              <WorkloadChart
                data={workloadData}
                updateData={setWorkloadData}
                onDrop={function (e) {
                  // round to one decimal place
                  const y = Math.round(e.target.options.y * 10) / 10;
                  // update event to reflect new rounded y value
                  e.target.options.y = y;
                  const x = e.target.index;
                  setWorkloadData((oldData) => {
                    oldData[x] = y;
                    return oldData;
                  });
                  // return data so chart updates
                  return workloadData;
                }}
              />
            </div>

            {errorMsg !== "" ? (
              <center>
                <div style={{ color: "red", fontSize: "small" }}>
                  {errorMsg}
                </div>
              </center>
            ) : null}
            <div style={{ ...row, justifyContent: "center" }}>
              <input
                style={{ ...buttonFormat }}
                className={styles.inputWrapping}
                type="submit"
                value="Submit"
              />
              <button
                style={{ ...buttonFormat }}
                className={styles.inputWrapping}
                onClick={() => {
                  setAddCourse(false);
                  resetForm();
                }}
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
