import { useState, useContext } from "react";
import Modal from "./Modal";
import { EvaluationsContext } from "../context";
import "./css/Buttons.css";
const col = {
  display: "flex",
  flexDirection: "column",
};

export default function DeleteEvaluationModal({
  isShown,
  setIsShown,
  evaluationInfo,
}) {
  const setEvaluations = useContext(EvaluationsContext).setEvaluations;
  const [errorMsg, setErrorMsg] = useState("");
  const tryDeleteEvaluation = function () {
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
