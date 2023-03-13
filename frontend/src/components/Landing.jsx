import "../App.css";
import React, { useState } from "react";
import LandingLoginForm from "./LandingLoginForm.react";
import styles from "./css/utils.module.css";
import SignupForm from "./SignupForm";
import classnames from "classnames";

function Landing(props) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className={styles.page}>
      <h1> Compass </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <div className={styles.padded}> Log In</div>
        <div  className={styles.padded}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              value={isLogin}
              onChange={() => setIsLogin(!isLogin)}
            />
            <span className={classnames(styles.slider, styles.round)}></span>
          </label>
        </div>
        <div  className={styles.padded}> Sign Up</div>
      </div>
      {isLogin ? <LandingLoginForm {...props} /> : <SignupForm {...props}/>}
    </div>
  );
}

export default Landing;
