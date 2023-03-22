import React, { useState } from "react";
import Logout from "./Logout";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";


import LoadingDots from "./LoadingDots";
import CourseSlider from "./CourseSlider";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};
const sliderTitleStyle = {
  margin: "20px, 0px",
  fontWeight: "bold",
  fontSize: "1.5rem",
  marginBottom: "1rem",
};

function Home(props) {
  const [searchResult, setSearchResult] = useState({});
  const [inFlight, setInFlight] = useState(false);
  React.useEffect(() => {
    fetch("/auth", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      props.setLoggedIn(res.status === 200);
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
        style={{  height: 500, overflow: "visible" }}
      >
        <div style={{ ...row, alignItems: "center" }}>
          <h1 className="font-weight-light">Home page</h1>
          <Logout {...props} />
        </div>
        <form style={row} onSubmit={trySearch}>
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

        <div style={{ overflow: "visible" }}>
          <div style={sliderTitleStyle}>Recommended for you</div>
          <CourseSlider courses={courses} />
        </div>
        <div style={{ overflow: "visible" }}>
          <div style={sliderTitleStyle}>Fun Electives</div>
          <CourseSlider courses={courses} />
        </div>
      </div>
    </>
  );
}

export default Home;
