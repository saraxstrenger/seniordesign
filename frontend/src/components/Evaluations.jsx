import React, { useState, useEffect, useContext } from "react";
import NavBar from "./NavBar";
import style from "./css/utils.module.css";
import EvaluationsAddEvaluationForm from "./EvaluationsAddCoursesForm";
import EvaluationsInfoCard from "./EvaluationsInfoCard";
import { AuthAPI } from "../context";
import "./css/Card.css";
import "./css/Buttons.css";
import { AnimatePresence, motion } from "framer-motion";

// const USER = 1;
const DEPT = 1;
const NUM = 2;
const YEAR = 3;
const SEM = 4;

const col = {
  display: "flex",
  flexDirection: "column",
};
const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};
// const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

function Courses(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [errorMsg, setErrorMsg] = useState("");
  const [evaluations, setEvaluations] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
        {showForm ? (
          <EvaluationsAddEvaluationForm
            evaluations={evaluations}
            setEvaluations={setEvaluations}
            setShowForm={setShowForm}
          />
        ) : null}

        <div style={{ minWidth: "75%", padding: "8px" }}>
          <div style={{ ...row, justifyContent: "space-between", alignItems:"center" }}>
            <h2>Your Evaluations:</h2>
            <br />
            {showForm === false ? (
              <center>
                <button
                  className={"btn btn-primary"}
                  onClick={() => setShowForm(true)}
                >
                  Add Evaluation
                </button>
              </center>
            ) : null}
          </div>

          {errorMsg ? (
            <div>{errorMsg}</div>
          ) : (
            <div
              style={{
                display: "flex",
                // flexWrap: "wrap",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {evaluations.length === 0 ? (
                <div style={{ padding: "24px 12px", fontSize: "large" }}>
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
    </div>
  );
}

function CourseEvalCard({ department, number, semester, year, id }) {
  const [expand, setExpand] = useState(false);

  const handleClick = () => {
    setExpand(!expand);
  };

  return (
    <div className={expand ? "card-no-hover" : "card"}>
      <div
        style={{ padding: "8px 16px", cursor: "pointer" }}
        onClick={() => setExpand(!expand)}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>{department + " " + number}</h4>
          <div>{semester + " " + year}</div>
        </div>
      </div>

      {expand && (
        <AnimatePresence>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "fit-content", transition: { duration: 0.3 } }}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "8px 0px",
            }}
            exit={{ height: 0, transition: { duration: 0.3 } }}
            id="evaluations-info-card"
          >
            <EvaluationsInfoCard
              evaluationId={id}
              isShown={expand}
              setIsShown={setExpand}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Courses;
