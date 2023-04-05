import React, { useContext, useState, useEffect } from "react";
import Logout from "./Logout";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import { useNavigate } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import CourseSlider from "./CourseSlider";
import { AuthAPI, RecommendationsContext } from "../context";
import Modal from "./Modal";
import CourseInfoPage from "./CourseInfoPage";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};

function Home(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [searchResult, setSearchResult] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [interests, setInterests] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusedCourse, setFocusedCourse] = useState(null);

  useEffect(() => {
    fetch("/home", {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        setLoggedIn(res.status !== 401);

        if (res.status !== 200) {
          return null;
        }
        return res.json();
      })
      .then((resJson) => {
        if (resJson === null || resJson.success === false) {
          setErrorMsg(
            resJson?.errorMsg ||
              "Unable to load course recommendations at this time."
          );
        } else {
          setInterests(resJson.interests);
          setRecommendations(resJson.recs);
        }
        setLoading(false);
      });
  }, [setLoggedIn]);

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
          setLoggedIn(false);
        } else {
          return res.json();
        }
      })
      .then((resJson) => {
        setInFlight(false);
        setSearchResult(resJson);
      });
  };

  return (
    <>
      <NavBar />
      <div
        className={styles.page}
        style={{ alignItems: "center", overflow: "visible" }}
      >
        <RecommendationsContext.Provider
          value={{ focusedCourse, setFocusedCourse }}
        >
          <Logout {...props} />
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

          <Recommendations
            loading={loading}
            interests={interests}
            recommendations={recommendations}
            errorMsg={errorMsg}
          />
          <Modal isOpen={focusedCourse}>
            <div>
              <CourseInfoPage course={focusedCourse} />
              <button
                onClick={() => {
                  setFocusedCourse(null);
                }}
              >
                Close
              </button>
            </div>
          </Modal>
        </RecommendationsContext.Provider>
      </div>
    </>
  );
}

function Recommendations(props) {
  const { loading, interests, recommendations, errorMsg } = props;
  const navigate = useNavigate();
  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <LoadingDots />
        </div>
      ) : interests.length > 0 ? (
        <div style={{ width: "100%" }}>
          {interests.map((interest) => {
            if (!recommendations[interest]) {
              return null;
            } else {
              return (
                <div style={{ overflowX: "visible", padding: 12 }}>
                  <h2 style={{ margin: 0 }}>{interest}</h2>
                  <CourseSlider courses={recommendations[interest]} />
                </div>
              );
            }
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
                  href="/profile"
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
    </>
  );
}

export default Home;
