import React, { useContext, useEffect, useState } from "react";
import { RecommendationsContext } from "../context";
import "./css/Buttons.css";

const row = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
};
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
    <div
      style={{ width: "100%", cursor: "pointer" }}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedCourse(courseInfo);
      }}
    >
      <div
        className={"sliderCard card card-container"}
      >
        <div>
          <div style={{ ...row, justifyContent: "space-between" }}>
            <h3 style={{ marginTop: 0 }}>{courseId}</h3>
          </div>
          <div>
            {errorMsg ? errorMsg : truncateDescription(description, 250)}
          </div>
        </div>
      </div>
    </div>
  );
}
