import { useState, useContext } from "react";
import WorkloadChart from "./WorkloadChart";
import "./css/Forms.css";
import "./css/Buttons.css";
import { EvaluationsContext } from "../context";
const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

export default function EvaluationsAddEvaluationForm(props) {
  const evalsContext = useContext(EvaluationsContext);
  const evaluations = evalsContext.evaluations;
  const setEvaluations = evalsContext.setEvaluations;
  const { setShowForm } = props;
  const [errorMsg, setErrorMsg] = useState("");
  const [workloadData, setWorkloadData] = useState([2, 2, 2, 2]);
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
      workload: workloadData,
    };
    let res = await fetch("/addEvaluation", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(courseData),
    });
    let resJson = await res.json();
    if (resJson.success === true) {
      courseData.id = resJson.courseId;
      const updated = evaluations.concat([courseData]);
      setEvaluations(updated);
      setShowForm(false);
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
      <h2>New Evaluation:</h2>
      <form style={col} onSubmit={tryAddCourses}>
        <div style={{ marginBottom: "20px", ...row }}>
          <input
            name="department"
            id="department"
            type="text"
            placeholder={"Course Dept (e.g. CIS)"}
            required
            className={"form-input"}
          />

          <input
            className={"form-input"}
            name="number"
            id="number"
            type="number"
            placeholder={"Course # (e.g. 1600)"}
            min={1}
            required
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />

          <select
            name="semester"
            id="semester"
            required
            className={"form-input"}
          >
            <option value="" style={{ color: "gray" }} disabled selected hidden>
              Semester
            </option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
          </select>

          <input
            name="year"
            id="year"
            type="number"
            step="1"
            min={2015}
            max={new Date().getFullYear()}
            placeholder={"Year Taken"}
            required
            className={"form-input"}
          />
        </div>

        <div style={row}>
          <div style={{ width: "30%", ...row, alignItems: "center" }}>
            <label style={{ paddingRight: 8 }}>Interest:</label>
            <select
              name="interest"
              id="interest"
              type="number"
              required
              className={"form-input"}
            >
              <option label="-"></option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div style={{ width: "30%", ...row, alignItems: "center" }}>
            <label style={{ paddingRight: 8 }}>Difficulty:</label>
            <select
              name="difficulty"
              type="number"
              required
              className={"form-input"}
            >
              <option label="-"></option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
        <div style={{ ...row}}>
          <WorkloadChart
            height={350}
            data={workloadData}
            editMode={true}
            // updateData={setWorkloadData}
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
            <div style={{ color: "red", fontSize: "small" }}>{errorMsg}</div>
          </center>
        ) : null}
        <div style={{ ...row, justifyContent: "center" }}>
          <button className={"btn btn-primary"} type="submit" value="Submit" >Submit</button>
          <button
            className={"btn btn-tertiary"}
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
