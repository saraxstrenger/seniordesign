import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ProfileUpdatePasswordForm from "./ProfileUpdatePasswordForm";
import ProfileInterestsForm from "./ProfileInterestsForm";
const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};
export default function Profile(props) {
  const { setLoggedIn } = props;
  const [profileData, setProfileData] = useState({});
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
        console.log(resJson);
        if (resJson.success) {
          setProfileData(resJson.user);
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
                <ProfileInterestsForm interests={profileData?.interests ?? {}} />
              </div>
              <h2>Account Settings:</h2>
              <ProfileUpdateForm
                profileData={profileData}
                setProfileData={setProfileData}
              />
              <ProfileUpdatePasswordForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
