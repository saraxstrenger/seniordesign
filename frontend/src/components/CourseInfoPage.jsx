import { useState, useEffect, useContext } from "react";
import WorkloadChart from "./WorkloadChart";
import { AuthAPI } from "./../context";
import LoadingDots from "./LoadingDots";
const row = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
};
const col = {
  display: "flex",
  flexDirection: "column",
  width: "50%"
};

export default function CourseInfoPage(props) {
  const { course } = props;
  const [predictions, setPredictions] = useState(null);
  const setLoggedIn = useContext(AuthAPI);
  useEffect(() => {
    fetch("/predictions/" + course.code, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          //unauthorized
          setLoggedIn(false);
        } else return res.json();
      })
      .then((resJson) => {
        if (resJson.success) {
          setPredictions(resJson.data);
        } else {
          setPredictions(null);
        }
      });
  }, [course]);

  console.log(course);
  return (
    <div style={{minHeight: 300}}>
      <h2 style={{ margin: 0 }}>{course?.Course_Code}</h2>
      <div style={row}>
        <div style={col}>
          <h3>Course Name TODO</h3>
          <div> {course?.Description}</div>
        </div>
        <div style={col}>
          <h3>Personalized Predictions</h3>
          {predictions !== null ? (
            <>
              <h3>Interest: {predictions?.interest}/5</h3>
              <h3>Difficulty: {predictions?.difficulty}/5</h3>
              <h3>Workload:</h3>
              <WorkloadChart
                height={300}
                width={300}
                data={predictions?.workload}
                editEnabled={false}
              />
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingDots />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
