import React, { useState } from "react";
import styles from "./css/utils.module.css";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import HC_more from "highcharts/highcharts-more"; //module
import WorkloadChart from "./WorkloadChart";
// HC_more(Highcharts); //init module

// require("highcharts/modules/draggable-points")(Highcharts);
// require("highcharts/modules/accessibility")(Highcharts);

const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

export default function CoursesAddCoursesForm(props) {
  const { evaluations, setEvaluations } = props;
  const [errorMsg, setErrorMsg] = useState("");
  const [workloadData, setWorkloadData] = useState([2, 2, 2, 2]);
  const [addCourse, setAddCourse] = useState(false);
  console.log(workloadData);
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
      const updated = evaluations.concat([
       courseData
      ]);
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
    <div style={{ minWidth: "75%" }}>
      {!addCourse ? (
        <div style={{ width: "100%", ...row }}>
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

                placeholder={"Course Dept (e.g. CIS)"}
                required
              />

              <input
                className={styles.inputWrapping}
                name="number"
                id="number"
                type="number"

                placeholder={"Course # (e.g. 1600)"}
                min={1}
                required
              />

              <select
                className={styles.inputWrapping}
                name="semester"
                id="semester"
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

                placeholder={"Year Taken"}
                required
              />
            </div>
            <div style={row}>
              <div>
                <label className={styles.inputWrapping}>
                  Interest:
                  <select
                    className={styles.inputWrapping}
                    name="interest"
                    id="interest"
                    type="number"
                    required
                  >
                    <option label="-"></option>
                    <option value={1} > 1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </label>
              </div>
              <div>
                <label className={styles.inputWrapping}>
                  Difficulty:
                  <select
                    className={styles.inputWrapping}
                    name="difficulty"
                    type="number"
                    required
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
                className={styles.inputWrapping}
                type="submit"
                value="Submit"
              />
              <button
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

// function CoursesWorkloadChart(props) {
//   const { data, updateData } = props;

//   const afterRender = (chart) => {
//     console.log("afterRender");
//     console.log(chart.series[0].data);
//   };
//   return (
//     <div id="container">
//       <HighchartsReact
//         highcharts={Highcharts}
//         options={config}
//         callback={afterRender}
//         // updateArgs={[true]}
//         allowChartUpdate={true}
//       />
//     </div>
//   );
// }
