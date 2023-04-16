import React, { useContext, useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import { useNavigate } from "react-router-dom";
import LoadingDots from "./LoadingDots";
import CourseSlider from "./CourseSlider";
import { AuthAPI, RecommendationsContext } from "../context";
import Modal from "./Modal";
import CourseInfoPage from "./CourseInfoPage";
import CoursePreviewCard from "./CoursePreviewCard";
import "./css/Forms.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};

function Home(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [searchResult, setSearchResult] = useState([]);
  const [interests, setInterests] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [inFlight, setInFlight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusedCourse, setFocusedCourse] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const formRef = useRef(null);
  const handleClearForm = () => {
    formRef.current.reset();
  };
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
          setInterests(resJson.interests ?? {});
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
        const normalizedResults = resJson.data.map((str) => {
          return (str = str.replace(/\u00A0/g, " "));
        });
        setSearchResult(normalizedResults);
        setSearchMode(true);
      });
  };

  return (
    <>
      <NavBar />
      <div
        className={styles.page}
        style={{ alignItems: "center", overflow: "visible", padding: 24 }}
      >
        <RecommendationsContext.Provider
          value={{ focusedCourse, setFocusedCourse }}
        >
          <form
            id="searchBar"
            style={{ ...row, width: "70%", alignItems: "center" }}
            onSubmit={trySearch}
            ref={formRef}
          >
            <input
              type="text"
              placeholder="Search for courses..."
              name="searchTerm"
              style={{ minWidth: "160px" }}
              className="form-input"
            />
            <button className={`btn btn-secondary`}
              type="submit"
              value="Search"
            >
              Search
            </button>
          </form>

          {searchMode ? (
            <SearchResults
              inFlight={inFlight}
              searchResult={searchResult}
              clearSearch={() => {
                handleClearForm();
                setSearchMode(false);
              }}
            />
          ) : (
            <Recommendations
              loading={loading}
              interests={interests}
              errorMsg={errorMsg}
            />
          )}
          <Modal isOpen={focusedCourse} modalStyle={{ width: "70%" }}>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "1.5rem",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setFocusedCourse(null);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {focusedCourse !== null ? (
              <CourseInfoPage course={focusedCourse} />
            ) : (
              <LoadingDots />
            )}
          </Modal>
        </RecommendationsContext.Provider>
      </div>
    </>
  );
}

function SearchResults(props) {
  const { searchResult, inFlight, clearSearch } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Search Results</h2>
        <button className="btn btn-secondary btn-small" onClick={clearSearch}>
          Back to Recommendations
        </button>
      </div>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {inFlight ? (
          <LoadingDots />
        ) : searchResult.length === 0 ? (
          <center>
            <h3>No results</h3>
          </center>
        ) : (
          searchResult.map((course, index) => {
            return (
              <div key={index}>
                <CoursePreviewCard courseId={course} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
function Recommendations(props) {
  const { loading, interests, errorMsg } = props;
  const navigate = useNavigate();

  const interestsWithRecs = Object.keys(interests).reduce((acc, interest) => {
    if (interests[interest].length > 0) {
      acc[interest] = interests[interest];
    }
    return acc;
  }, {});

  console.log(interestsWithRecs);

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
      ) : Object.keys(interestsWithRecs).length > 0 ? (
        <div style={{ width: "100%" }}>
          {Object.keys(interestsWithRecs).map((interest) => {
            return (
              <div
                style={{ overflowX: "visible", padding: "12px 0px" }}
                key={interest}
              >
                <h2 style={{ margin: 0 }}>{interest}</h2>
                <CourseSlider courses={interestsWithRecs[interest]} />
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
          <center>
            <h3>
              {Object.keys(interests).length > 0 ? (
                "We are hard at work on your recommendations... check back later!"
              ) : errorMsg ? (
                errorMsg
              ) : (
                <>
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
                </>
              )}
            </h3>
          </center>
        </div>
      )}
    </>
  );
}

export default Home;
