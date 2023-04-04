import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CourseInfoCard(props) {
  const [courseInfo, setCourseInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const { courseId, isShown } = props;
  useEffect(() => {
    console.log(courseId);

    fetch("/course/" + courseId, {
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
          setCourseInfo(resJson.data);
        } else {
          setErrorMsg(resJson.error);
        }
      });
  }, [courseId]);

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
            {errorMsg ? (
              errorMsg
            ) : (
              <>
                {/* <h3>{courseInfo.Course_Code}</h3> */}
                {courseInfo.Description}
                <br />
                <b>Difficulty:</b> {courseInfo.Difficulty}
                <br />
                <b>Interest:</b> {courseInfo.Interest}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
