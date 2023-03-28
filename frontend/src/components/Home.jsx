import React, { useState } from "react";
import Logout from "./Logout";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import { useNavigate } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import CourseSlider from "./CourseSlider";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};
const col = {
  display: "flex",
  justifyContent: "flex-start",
  flexDirection: "column",
  alignItems: "stretch",
};
const sliderTitleStyle = {
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginBottom: "1rem",
};

function Home(props) {
  const [searchResult, setSearchResult] = useState({});
  const [interests, setInterests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    fetch("/home", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        props.setLoggedIn(res.status !== 401);

        if (res.status !== 200) {
          return null;
        }
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        if (resJson === null || resJson.success === false) {
          setErrorMsg(
            resJson?.errorMsg ||
              "Unable to load course recommendations at this time."
          );
        } else {
          setInterests(resJson.interests);
        }
      });
  }, [props]);

  const trySearch = async function (e) {
    e.preventDefault();
    setInFlight(true);
    const searchTerm = e.target.searchTerm.value;
    fetch("/search", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        searchTerm,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          props.setLoggedIn(false);
        } else {
          return res.json();
        }
      })
      .then((resJson) => {
        setInFlight(false);
        setSearchResult(resJson);
        console.log("result: " + resJson);
      });
  };

  const courses = [
    { name: "Course 1", image: "/course1.jpg" },
    { name: "Course 2", image: "/course2.jpg" },
    { name: "Course 3", image: "/course3.jpg" },
    { name: "Course 4", image: "/course4.jpg" },
    { name: "Course 5", image: "/course5.jpg" },
  ];

  return (
    <>
      <NavBar />
      <div
        className={styles.page}
        style={{ alignItems: "center", overflow: "visible" }}
      >
        <div style={{ ...row, alignItems: "center" }}>
          <h1 className="font-weight-light">Home page</h1>
          <Logout {...props} />
        </div>
        <form style={{ ...row, width: "100%" }} onSubmit={trySearch}>
          <input
            type="text"
            placeholder="Search"
            name="searchTerm"
            style={{ minWidth: "50%" }}
          />
          <input type="submit" value="Search" />
        </form>
        {inFlight ? <LoadingDots /> : null}
        {JSON.stringify(searchResult)}

        {interests.length > 0 ? (
          <div style={{width: "100%"}}>
            {interests.map((interest) => {
              return (
                <div style={{ overflowX: "visible", padding: 24 }}>
                  <h2 style={{margin: 0}}>{interest}</h2>
                  <CourseSlider courses={courses} />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexGrow: 1,
              width: "70%",
            }}
          >
            {errorMsg ? (
              errorMsg
            ) : (
              <center>
                <h3>
                  No interests added! Visit the{" "}
                  <a
                    onClick={() => {
                      navigate("/profile");
                    }}
                    style={{
                      textDecoration: "underline",
                      color: "#55868C",
                      cursor: "pointer",
                    }}
                  >
                    profile page
                  </a>{" "}
                  to add interests and get personalized recommendations.
                </h3>
              </center>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
