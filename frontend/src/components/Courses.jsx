import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import style from "./css/utils.module.css";
import CoursesAddCoursesForm from "./CoursesAddCoursesForm";

// const USER = 1;
const DEPT = 1;
const NUM = 2;
const YEAR = 3;
const SEM = 4;

const col = {
  display: "flex",
  // justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

function Courses(props) {
  const [errorMsg, setErrorMsg] = useState("");
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    fetch("/auth", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      props.setLoggedIn(res.status === 200);
    });
  });

  useEffect(() => {
    fetch("/evaluations", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (res) => {
      console.log("evals");
      console.log(res);

      if (res.status === 401) {
        // unauthorized
        props.setLoggedIn(false);
      } else if (res.status !== 200) {
        setErrorMsg("Unable to get evaluations at this time.");
      } else {
        const data = await res.json();
        console.log(data);
 
        const evals = data.courses.map((evaluation) => {
          console.log(evaluation);
          const attributes = evaluation.split("_");
          console.log(attributes);
          return {
            department: attributes[DEPT],
            number: attributes[NUM],
            semester: attributes[SEM],
            year: attributes[YEAR],
            id: evaluation,
          };
        });
        setEvaluations(evals);
      }
    });
  }, [props]);

  return (
    <div className={style.page}>
      <NavBar />
      <div className={style.pageBody} style={{ ...col }}>
        <h1>Courses</h1>

        <CoursesAddCoursesForm evaluations={evaluations} setEvaluations={setEvaluations} />

        {/* <div style={col}> */}
        <div
          style={{ minWidth: "75%", marginLeft: 20, justifyContent: "left" }}
        >
          <h2>Your Courses:</h2>
        </div>

        {errorMsg ? (
          <div>{errorMsg}</div>
        ) : (
          evaluations.map((evaluation) => {
            return <CourseEvalCard {...evaluation} />;
          })
        )}
      </div>
    </div>
  );
}

function CourseEvalCard({ department, number, semester, year, id }) {
  const [expand, setExpand] = useState(false);

  return (
    // <div className={style.padded}>
    <div
      className={style.cardColor}
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: "70%",
        padding: 12,
        margin: 12,
        filter: "drop-shadow(1px 1px 2px #2B4162)",
        borderRadius: 4,
        ...col,
      }}
    >
      <div style={{ ...row, justifyContent: "space-between" }}>
        <div>{department + " " + number}</div>
        <div>{semester + " " + year}</div>

        <div>
          <button onClick={() => setExpand(!expand)}>
            {expand ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>
      {expand ? <CourseEvalCardInfo courseId={id} /> : null}
    </div>
    // </div>
  );
}

function CourseEvalCardInfo({ courseId }) {
  //TODO: add info
  return (
    <div>
      <hr></hr>
      <div>Course Info</div>
    </div>
  );
}

export default Courses;
