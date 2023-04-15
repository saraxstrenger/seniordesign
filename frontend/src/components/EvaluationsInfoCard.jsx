import { motion } from "framer-motion";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";
import WorkloadChart from "./WorkloadChart";
import Modal from "./Modal";
import { EvaluationsContext } from "../context";
import "./css/Forms.css";
import "./css/EvaluationCard.css";
const row = {
  display: "flex",
  flexDirection: "row",
};
const col = {
  display: "flex",
  flexDirection: "column",
};
export default function EvaluationsInfoCard({ evaluationId, setEvaluations }) {
  const [evaluationInfo, setEvaluationInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [editedWorkloadData, setEditedWorkloadData] = useState([]);
  const [savedWorkloadData, setSavedWorkloadData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    // Fetch evaluations using the course
    fetch("/evaluations/" + evaluationId, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          //unauthorized
          return { success: false, error: "Unauthorized" };
        } else return res.json();
      })
      .then((resJson) => {
        if (resJson.success) {
          console.log("updating workload");
          setEditedWorkloadData([...resJson.data.workload]);
          setSavedWorkloadData([...resJson.data.workload]);
          setEvaluationInfo(resJson.data);
        } else {
          setErrorMsg(resJson.error);
        }
      });
  }, [evaluationId]);

  console.log("savedWorkloadData", savedWorkloadData);
  const tryUpdateEvaluation = (e) => {
    console.log("TRYOING PDATE");
    e.preventDefault();
    const interest = parseInt(e.target.interest.value);
    const difficulty = parseInt(e.target.difficulty.value);
    const updatedEvaluation = {
      department: evaluationInfo.department,
      number: evaluationInfo.number,
      year: evaluationInfo.year,
      semester: evaluationInfo.semester,
      interest,
      difficulty,
      workload: [...editedWorkloadData],
    };
    fetch("/updateEvaluation/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedEvaluation),
    })
      .then((res) => {
        if (res.status === 401) {
          return { success: false, error: "Unauthorized" };
        } else if (res.status === 400) {
          return { success: false, error: "Invalid parameters" };
        } else return res.json();
      })
      .then((resJson) => {
        if (resJson.success === true) {
          setEvaluationInfo((prevInfo) => {
            return {
              ...prevInfo,
              interest,
              difficulty,
              workload: [...editedWorkloadData],
            };
          });
          setSavedWorkloadData([...editedWorkloadData]);
          setEditMode(false);
        } else {
          setEditErrorMsg(resJson.error ?? "An unknown error occurred");
        }
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.2 } }}
      id="evaluationsInfoCard"
    >
      <hr style={{ margin: 0 }} />
      <form onSubmit={tryUpdateEvaluation} id={evaluationId}>
        <div style={{ ...col, justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              ...row,
              justifyContent: "space-around",
              padding: "24px 0px",
            }}
          >
            <div className="rating">
              <b>Difficulty:&#160;</b>
              {editMode ? (
                <select
                  className="select-input"
                  name="difficulty"
                  id="difficulty"
                  type="number"
                  min="0"
                  max="5"
                  defaultValue={evaluationInfo.difficulty}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              ) : (
                evaluationInfo.difficulty
              )}
            </div>
            <div className="rating">
              <b>Interest:&#160;</b>
              {editMode ? (
                <select
                  className="select-input"
                  name="interest"
                  id="interest"
                  type="number"
                  min={0}
                  max={5}
                  defaultValue={evaluationInfo.interest}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              ) : (
                evaluationInfo.interest
              )}
            </div>
          </div>
          {/* {workloadString} */}
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              width: 450,
            }}
          >
            {errorMsg ? (
              { errorMsg }
            ) : editedWorkloadData.length === 4 ? (
              editMode ? (
                <WorkloadChart
                  height={400}
                  width={450}
                  data={editedWorkloadData}
                  editMode={true}
                  onDrop={function (e) {
                    // round to one decimal place
                    const y = Math.round(e.target.options.y * 10) / 10;
                    // update event to reflect new rounded y value
                    e.target.options.y = y;
                    const x = e.target.index;
                    console.log("setting workload data:");
                    setEditedWorkloadData((prevData) => {
                      prevData[x] = y;
                      return prevData;
                    });
                    console.log(editedWorkloadData);
                    // return data so chart updates
                    // setWorkloadString(JSON.stringify(editedWorkloadData));
                    return editedWorkloadData;
                  }}
                />
              ) : (
                <WorkloadChart
                  height={400}
                  width={450}
                  data={[...savedWorkloadData]}
                  editMode={false}
                />
              )
            ) : (
              <LoadingDots />
            )}
          </div>
        </div>
        <EvaluationCardButtons
          editMode={editMode}
          cancelEdit={() => {
            console.log("cancelled:", savedWorkloadData);
            setEditedWorkloadData([...savedWorkloadData]);
            setEditErrorMsg("");
            setEditMode(false);
            console.log("reset:", editedWorkloadData);
          }}
          evaluationInfo={evaluationInfo}
        />
      </form>
      {editErrorMsg && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            fontSize: "small",
          }}
        >
          {"Error: "+editErrorMsg}
        </div>
      )}
      {!editMode && (
        <div style={{ ...row, width: "100%", justifyContent: "space-around" }}>
          <button
            type="button"
            id="edit"
            className="btn btn-secondary btn-small"
            style={{ width: "inherit" }}
            onClick={() => {
              console.log("SEETTING OLD DATA");
              setSavedWorkloadData([...editedWorkloadData]);
              setEditMode(true);
            }}
          >
            Edit
          </button>
        </div>
      )}
    </motion.div>
  );
}

function EvaluationCardButtons({ editMode, cancelEdit, evaluationInfo }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <>
      {editMode === true ? (
        <div style={{ ...row, width: "100%", justifyContent: "space-around" }}>
          <button
            type="submit"
            id="update"
            className="btn btn-primary btn-small"
            style={{ width: "inherit", boxSizing: "border-box" }}
            form={evaluationInfo.id}
          >
            Update
          </button>
          <button
            type="cancel"
            id="cancel"
            className="btn btn-secondary btn-small"
            style={{ width: "inherit", boxSizing: "border-box" }}
            onClick={() => cancelEdit()}
          >
            Cancel
          </button>
          <button
            type="button"
            id="delete"
            className="btn btn-tertiary btn-small"
            style={{ width: "inherit", boxSizing: "border-box" }}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>

          <DeleteEvaluationModal
            isShown={showDeleteModal}
            setIsShown={setShowDeleteModal}
            evaluationInfo={evaluationInfo}
          />
        </div>
      ) : null}
    </>
  );
}
function DeleteEvaluationModal({ isShown, setIsShown, evaluationInfo }) {
  const setEvaluations = useContext(EvaluationsContext).setEvaluations;
  const [errorMsg, setErrorMsg] = useState("");
  const tryDeleteEvaluation = function () {
    alert("hello");
    const evaluationParams = {
      department: evaluationInfo.department,
      number: evaluationInfo.number,
      year: evaluationInfo.year,
      semester: evaluationInfo.semester,
    };
    fetch("/deleteEvaluation/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(evaluationParams),
    })
      .then((res) => {
        if (res.status !== 200) {
          if (res.status === 400) {
            return { success: false, error: "Invalid parameters." };
          } else if (res.status === 401) {
            return { success: false, error: "Unauthorized." };
          } else if (res.status === 404) {
            return { success: false, error: "Evaluation not found." };
          } else {
            return { success: false, error: "Unknown error." };
          }
        } else return res.json();
      })
      .then((resJson) => {
        if (resJson.success) {
          setEvaluations((oldEvaluations) => {
            return oldEvaluations.filter(
              (evaluation) => evaluation.id !== evaluationInfo.id
            );
          });
          setIsShown(false);
        } else {
          setErrorMsg(resJson.error ?? "Unable to complete delete operation.");
        }
      });
  };
  return (
    <Modal isOpen={isShown}>
      <div style={{ ...col, alignItems: "center" }}>
        <div style={{ marginBottom: 12 }}>
          Are you sure you want to delete this evaluation?
        </div>
        <div>
          <button
            className="btn btn-secondary btn-small"
            type="button"
            style={{ width: "inherit", boxSizing: "border-box" }}
            onClick={() => setIsShown(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-tertiary btn-small"
            style={{ width: "inherit", boxSizing: "border-box" }}
            onClick={tryDeleteEvaluation}
            type="button"
          >
            Delete
          </button>
          {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
        </div>
      </div>
    </Modal>
  );
}
