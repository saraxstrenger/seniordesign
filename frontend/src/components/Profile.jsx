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
      <div className={styles.page} style={{ alignItems: "center" }}>
        <div
          style={{
            ...col,
            // background: "green",
            margin: "0px 20px",
            width: "75%",
            minWidth: "400",
          }}
        >
          <h2>Profile:</h2>

          {errorMsg ? (
            errorMsg
          ) : (
            <div style={col}>
              <ProfileInterestsForm interests={interests} />

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
