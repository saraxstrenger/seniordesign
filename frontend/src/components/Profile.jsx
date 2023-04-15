import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ProfileInterestsForm from "./ProfileInterestsForm";
import "./css/Card.css";
import "./css/Buttons.css";

const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
export default function Profile(props) {
  const { setLoggedIn } = props;
  const [profileData, setProfileData] = useState([]);
  const [interests, setInterests] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        // alert("res: " + res")
        // setLoggedIn(res.status() !== 401);
        return res.json();
      })
      .then((resJson) => {
        if (resJson.success) {
          setProfileData(resJson.user);
          setInterests(Object.keys(resJson.user.interests));
        } else {
          setErrorMsg("Unable to load user profile at this time.");
        }
      });
  }, [setLoggedIn]);

  return (
    <div>
      <NavBar />
      <div
        className={styles.page}
        style={{ alignItems: "center" }}
      >
        <div
          style={{
            ...col,
            // background: "green",
            margin: "0px 20px",
            width: "75%",
          }}
        >
          {/* <h1>Profile</h1> */}

          {errorMsg ? (
            errorMsg
          ) : (
            <div style={col}>
              <h2>Your Interests:</h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ProfileInterestsForm interests={interests} />
              </div>
             
              <ProfileUpdateForm
                profileData={profileData}
                setProfileData={setProfileData}
              />
              

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
