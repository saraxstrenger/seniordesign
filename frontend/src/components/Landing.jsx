import "../App.css";
import React, { useState } from "react";
import LandingLoginForm from "./LandingLoginForm.react";
import styles from "./css/utils.module.css";
import SignupForm from "./SignupForm";
import classnames from "classnames";

const col = { display: "flex", justifyContent: "center", flexDirection: "column" };
const row = { display: "flex", justifyContent: "center", flexDirection: "row" };

function Landing(props) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className={styles.page}>
      <center><h1> Compass </h1></center>
      <div className={styles.pageBody} style={col} >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
         
          }}
        >
          <div className={styles.padded}> Log In</div>
          <div className={styles.padded}>
            <label className={styles.switch}>
              <input
                type="checkbox"
                value={isLogin}
                onChange={() => setIsLogin(!isLogin)}
              />
              <span className={classnames(styles.slider, styles.round)}></span>
            </label>
          </div>
          <div className={styles.padded}> Sign Up</div>
        </div>
        <div style={{ width:"50%"}}>
          {isLogin ? (
            <LandingLoginForm {...props} />
          ) : (
            <SignupForm {...props} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
