import React, { useEffect, useState } from "react";

export default function CourseInfoCard(props) {
  const [courseInfo, setCourseInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    fetch("/course/" + props.courseId, {
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
          console.log(resJson.data);
          setCourseInfo(resJson.data);
        } else {
          setErrorMsg(resJson.error);
        }
      });
  }, [props]);

  return (
    <div>
      {errorMsg ? (
        errorMsg
      ) : (
        <>
          <h3>{courseInfo.Course_Code}</h3>
          {courseInfo.Description}
          <br />
          <b>Difficulty:</b> {courseInfo.Difficulty}
          <br />
          <b>Interest:</b> {courseInfo.Interest}
        </>
      )}
    </div>
  );
}
