import React, { useContext, useEffect, useState } from "react";
import { RecommendationsContext } from "../context";
import "./css/Buttons.css";

export default function CoursePreviewCard(props) {
  const { courseId } = props;
  const [courseInfo, setCourseInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const description = courseInfo?.Description ?? "";
  const setFocusedCourse = useContext(RecommendationsContext).setFocusedCourse;
  const truncateDescription = (description, n) => {
    if (description.length <= n) {
      return description;
    }
    const truncated = description.slice(0, n);
    const lastSpace = truncated.lastIndexOf(" ");
    return truncated.slice(0, lastSpace) + "...";
  };

  const openModal = () => {
    // Code to open the modal
  };

  useEffect(() => {
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
  }, [courseId, setCourseInfo]);

  return (
    <div onClick={(e) => {
      e.stopPropagation();
      setFocusedCourse(courseId);
    }} style={{ cursor: "pointer" }}>
      <h3 style={{ marginTop: 0 }}>{courseId}</h3>
      <div>{errorMsg ? errorMsg : truncateDescription(description, 250)}</div>
      <div style={{ display: "flex", justifyContent: "flex-end" , color: "#FF8811"}}>
          See more
      </div>
    </div>
  );
}
