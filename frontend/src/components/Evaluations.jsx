import React, { useState, useEffect, useContext } from "react";
import NavBar from "./NavBar";
import style from "./css/utils.module.css";
import EvaluationsAddEvaluationForm from "./EvaluationsAddCoursesForm";
import { AiFillCaretDown } from "react-icons/ai";
import EvaluationsInfoCard from "./EvaluationsInfoCard";
import { AuthAPI } from "../context";

// const USER = 1;
const DEPT = 1;
const NUM = 2;
const YEAR = 3;
const SEM = 4;

const col = {
  display: "flex",
  flexDirection: "column",
};
// const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

function Courses(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [errorMsg, setErrorMsg] = useState("");
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    fetch("/evaluations", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then(async (res) => {
      if (res.status === 401) {
        // unauthorized
        props.setLoggedIn(false);
      } else if (res.status !== 200) {
        setErrorMsg("Unable to get evaluations at this time.");
      } else {
        const data = await res.json();
        if (data.courses === undefined || data.courses.length === 0) {
          setEvaluations([]);
          return;
        }
        const evals = data.courses.map((evaluation) => {
          const attributes = evaluation.split("_");
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
        <EvaluationsAddEvaluationForm
          evaluations={evaluations}
          setEvaluations={setEvaluations}
        />

        <div style={{ minWidth: "75%" }}>
          <h2 style={{ margin: 0 }}>Your Evaluations:</h2>
        </div>

        {errorMsg ? (
          <div>{errorMsg}</div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {evaluations.length === 0 ? (
              <div style={{padding: "24px 12px", fontSize:"large"}}>
                <center>
                  No evaluations found!
                  <br />
                  Add an evaluation above to start getting personalized course
                  recommendations.
                </center>
              </div>
            ) : (
              evaluations.map((evaluation) => {
                return <CourseEvalCard {...evaluation} key={evaluation.id} />;
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CourseEvalCard({ department, number, semester, year, id }) {
  const [expand, setExpand] = useState(false);

  const handleClick = () => {
    setExpand(!expand);
  };

  return (
    <div
      className={style.cardColor}
      style={{
        width: 350,
        margin: 10,
        padding: 8,
        filter: "drop-shadow(1px 1px 2px #2B4162)",
        borderRadius: 12,
      }}
    >
      <div style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            {department + " " + number}
          </div>
          <div>{semester + " " + year}</div>
        </div>
      </div>
      <div style={{ padding: "12px" }}>
        <div style={{ marginBottom: "8px" }}>
          <AiFillCaretDown
            style={{
              transform: `rotate(${expand ? "-90deg" : "0deg"})`,
              transition: "transform 0.3s ease",
            }}
            onClick={handleClick}
          />
        </div>
        {expand && <EvaluationsInfoCard evaluationId={id} isShown={expand} />}
      </div>
    </div>
  );
}

export default Courses;
