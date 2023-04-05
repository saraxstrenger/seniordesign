import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";
import WorkloadChart from "./WorkloadChart";

const row = {
  display: "flex",
  flexDirection: "row",
};
export default function EvaluationsInfoCard({ evaluationId, isShown }) {
  const [evaluationInfo, setEvaluationInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [workloadData, setWorkloadData] = useState([]);
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
    <AnimatePresence>
      {isShown && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "fit-content", transition: { duration: 0.3 } }}
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 0px",
          }}
          exit={{ height: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div style={{ ...row, justifyContent: "space-around" }}>
              <div>
                <b>Difficulty: </b>
                {evaluationInfo.difficulty}
              </div>
              <div>
                <b>Interest: </b>
                {evaluationInfo.interest}{" "}
              </div>
            </div>

            <div
              style={{
                height: 350,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {errorMsg ? (
                { errorMsg }
              ) : workloadData.length === 4 ? (
                <WorkloadChart
                  height={350}
                  width={350}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
