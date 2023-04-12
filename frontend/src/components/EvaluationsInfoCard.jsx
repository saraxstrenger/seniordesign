import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";
import WorkloadChart from "./WorkloadChart";
import Modal from "./Modal";
const row = {
  display: "flex",
  flexDirection: "row",
};
const col = {
  display: "flex",
  flexDirection: "column",
};
export default function EvaluationsInfoCard({
  evaluationId,
  isShown,
  setIsShown,
}) {
  const [evaluationInfo, setEvaluationInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [workloadData, setWorkloadData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // eslint-disable-next-line
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
          setWorkloadData(resJson.data.workload);
          setEvaluationInfo(resJson.data);
        } else {
          setErrorMsg(resJson.error);
        }
      });
  }, [evaluationId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.2 } }}
      id="evaluationsInfoCard"
    >
      <hr style={{ margin: 0 }} />
      <div style={{ ...row }}>
        <div style={{ ...col, justifyContent: "center", flexGrow: 1 }}>
          <div
            style={{
              ...row,
              justifyContent: "space-around",
              padding: "24px 0px",
            }}
          >
            <div>
              <b>Difficulty:&#160;</b>
              {evaluationInfo.difficulty}
            </div>
            <div>
              <b>Interest:&#160;</b>
              {evaluationInfo.interest}{" "}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
            }}
          >
            {errorMsg ? (
              { errorMsg }
            ) : workloadData.length === 4 ? (
              <WorkloadChart
                height={350}
                width={450}
                data={workloadData}
                updateData={editMode ? setWorkloadData : null}
                editEnabled={editMode}
                onDrop={function (e) {
                  const y = Math.round(e.target.options.y * 10) / 10;
                  e.target.options.y = y;
                  const x = e.target.index;
                  setWorkloadData((oldData) => {
                    oldData[x] = y;
                    return oldData;
                  });
                  return workloadData;
                }}
              />
            ) : (
              <LoadingDots />
            )}
          </div>
        </div>
      </div>
      <div style={{ ...row, width: "100%" }}>
        {!editMode ? (
          <button
            className="btn btn-primary btn-small"
            style={{ width: "100%" }}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary btn-small"
              style={{ width: "inherit", boxSizing: "border-box" }}
              onClick={() => alert("implement")}
            >
              Update
            </button>
            <button
              className="btn btn-secondary btn-small"
              style={{ width: "inherit", boxSizing: "border-box" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-tertiary btn-small"
              style={{ width: "inherit", boxSizing: "border-box" }}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </button>

            <Modal isOpen={showDeleteModal}>
              <div style={{ ...col, alignItems:"center"}}>
               <div style={{marginBottom: 12}}>
                  Are you sure you want to delete this evaluation?
               </div>
                <div>
                  <button
                    className="btn btn-secondary btn-small"
                    style={{ width: "inherit", boxSizing: "border-box" }}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-tertiary btn-small"
                    style={{ width: "inherit", boxSizing: "border-box" }}
                    onClick={() => alert("implement")}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
    </motion.div>
  );
}
