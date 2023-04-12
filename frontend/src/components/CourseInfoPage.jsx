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
    <div style={{padding: 8}}>
      <h2 style={{ margin: 0, color: "#2C5530" }}>{course?.code}</h2>

      <div style={{ ...row, overflow: "hidden", height: 360 }}>
        <div style={{ ...col, padding: "0px 8px 0px 0px" }}>
          <h3 style={{ margin: "4px 0px 12px 0px", color: "#739E82" }}>
            {course?.title}
          </h3>
          <div
            style={{
              overflowY: "auto",
              margin: "0px 0px 12px 0px",
              textAlign: "left",
              textIndent: 50,
            }}
          >
            {course?.description}
          </div>
        </div>
        <div style={{borderLeft: "thin solid gray", margin:"0px 4px"}}/>
        <div style={{ ...col, padding: "0px 8px" }}>
          <h3 style={{ marginTop: 0 }}>Personalized Predictions:</h3>
          {predictions !== null ? (
            <>
              <div>
                {/* <hr /> */}
              </div>
              <div style={{ ...row, justifyContent: "space-evenly", padding: 8 }}>
                <div style={row}>
                  Interest:&#160; <b>{predictions?.interest}</b>/5
                </div>
                <div style={row}>
                  Difficulty:&#160; <b>{predictions?.difficulty}</b>/5
                </div>
              </div>
              <div>
                {/* <hr /> */}
              </div>
             <div style={{padding: "8px 0px"}}>
             <WorkloadChart
                height={250}
                // width={200}
                data={predictions?.workload}
                editEnabled={false}
              />
             </div>
              <div>
                {/* <hr /> */}
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
