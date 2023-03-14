import React, { useState } from "react";
import NavBar from "./NavBar";
import style from "./css/utils.module.css";
import CoursesAddCoursesForm from "./CoursesAddCoursesForm";

const col = {
  display: "flex",
  // justifyContent: "center",
  flexDirection: "column",
};
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

function Courses() {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const courses = ["CIS 1600", "CIS 1601", "CIS 1602"];
  return (
    <div className={style.page}>
      <NavBar />
      <div className={style.pageBody} style={{ ...col }}>
        <h1>Courses</h1>
        <button hidden={showAddCourse} onClick={() => setShowAddCourse(true)}>
          Add Courses
        </button>
        {showAddCourse ? (
          <CoursesAddCoursesForm
            afterFormSubmit={() => setShowAddCourse(false)}
          />
        ) : null}
        {/* <div style={col}> */}
        <div style={{minWidth:"75%", marginLeft: 20, justifyContent: "left"}}>
          <h2>Your Courses:</h2>
        </div>
        {courses.map((course) => {
          return <CourseEvalCard id={course} course={course} />;
        })}
        {/* </div> */}
      </div>
    </div>
  );
}

function CourseEvalCard({ course }) {
  const [expand, setExpand] = useState(false);

  return (
    // <div className={style.padded}>
    <div
      className={style.cardColor}
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: "70%",
        padding: 12,
        margin: 12,
        filter: "drop-shadow(1px 1px 2px black)",
        borderRadius: 4,
        ...col,
      }}
    >
      <div style={{ ...row, justifyContent: "space-between" }}>
        <div>{course}</div>
        <div>
          <button onClick={() => setExpand(!expand)}>
            {expand ? "Unexpand" : "Expand"}
          </button>
        </div>
      </div>
      {expand ? <CourseEvalCardInfo course /> : null}
    </div>
    // </div>
  );
}

function CourseEvalCardInfo({ course }) {
  //TODO: add info
  return (
    <div>
      <hr></hr>
      <div>Course Info</div>
    </div>
  );
}

export default Courses;
