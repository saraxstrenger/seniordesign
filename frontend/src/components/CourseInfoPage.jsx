import { useState, useEffect, useContext } from "react";
import WorkloadChart from "./WorkloadChart";
import { AuthAPI } from "./../context";
import LoadingDots from "./LoadingDots";
const row = {
  display: "flex",
  flexDirection: "row",
};
const col = {
  display: "flex",
  flexDirection: "column",
  width: "50%",
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
    <div>
      <h2 style={{ marginTop: 0 }}>{course?.Course_Code}</h2>
      <div style={{ ...row, overflow: "hidden", height: 360 }}>
        <div style={{ ...col, padding:  "0px 8px" }}>
          <h3 style={{ margin: 0 }}>Course Name TODO</h3>
          <div
            style={{
              overflowY: "auto",
              padding: 8,
              textAlign: "left",
              textIndent: 50,
            }}
          >
            {course?.Description}
          </div>
        </div>
        <div style={{...col, padding:  "0px 8px"}}>
          <h3 style={{ margin: 0 }}>Personalized Predictions</h3>
          {predictions !== null ? (
            <>
              <div>
                <hr />
              </div>
              <div style={{ ...row, justifyContent: "space-evenly" }}>
                <div style={row}>
                  <b>Interest:</b> {predictions?.interest}/5
                </div>
                <div style={row}>
                  <b>Difficulty: </b> {predictions?.difficulty}/5
                </div>
              </div>
              <div>
                <hr />
              </div>
              <h4 style={{ margin: 0 }}>Workload:</h4>
              <WorkloadChart
                height={250}
                // width={200}
                data={predictions?.workload}
                editEnabled={false}
              />
              <div>
                <hr />
              </div>
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
