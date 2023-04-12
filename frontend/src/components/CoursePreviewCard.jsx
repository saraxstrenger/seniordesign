import React, { useContext, useEffect, useState } from "react";
import { RecommendationsContext } from "../context";
import "./css/Buttons.css";

const col = {
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-evenly",
};
export default function CoursePreviewCard(props) {
  const { courseId } = props;
  const [courseInfo, setCourseInfo] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const description = courseInfo?.description ?? "";
  const title = courseInfo?.title ?? "";
  const setFocusedCourse = useContext(RecommendationsContext).setFocusedCourse;

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
        } else if (res.status !== 200) {
          return {
            success: false,
            error: "Unable to load course information at this time.",
          };
        }
        return res.json();
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
      style={{
        width: "100%",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setFocusedCourse(courseInfo);
      }}
    >
      <div className={"sliderCard card card-container"} style={{flexGrow:1}}>
        <div>
          <div style={{ ...col, justifyContent: "space-between" }}>
            <h3 style={{ margin: 0, color: "#2C5530" }}>{courseId}</h3>

            <h4 style={{ margin: "4px 0px 12px 0px", color: "#739E82" }}>
              {title}
            </h4>
          </div>
          <div className={"truncate"}>{errorMsg ? errorMsg : description}</div>
        </div>
      </div>
    </div>
  );
}
