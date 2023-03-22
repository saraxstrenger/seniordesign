import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";
import ProfileUpdateForm from "./ProfileUpdateForm";
import ProfileUpdatePasswordForm from "./ProfileUpdatePasswordForm";

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
        setLoggedIn(res !== 401);
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
      <div className={styles.page}>
        <h1>Profile page</h1>

        {errorMsg ? (
          errorMsg
        ) : (
          <>
            <ProfileUpdateForm
              profileData={profileData}
              setProfileData={setProfileData}
            />
            <ProfileUpdatePasswordForm />
          </>
        )}
      </div>
    </div>
  );
}
