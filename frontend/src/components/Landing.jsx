import "../App.css";
import React, { useState } from "react";
import LandingLoginForm from "./LandingLoginForm.react";
import styles from "./css/utils.module.css";
import LandingSignupForm from "./LandingSignupForm";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import "./css/Card.css";

const col = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const cardStyle = {
  width: "100%",
  maxWidth: "800px",
  marginBottom: "1rem",
  padding: "1rem",
  borderRadius: "10px",
  border: "1px solid gray",
  margin: "0 auto",
  maxHeight: "100vh",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

function Landing(props) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.page}>
      <div style={col}>
        <div className={true ? "card-no-hover" : "card"} style={cardStyle}>
          <center>
            <img
              src={process.env.PUBLIC_URL + "/compass-symbol.png"}
              alt="Compass Logo"
              style={{ width: "80px", height: "auto", marginRight: "0.5rem" }}
            />
            <h1 style={{ margin: 0, marginTop: "0.25rem" }}> Compass </h1>
          </center>

          <div style={{ width: "100%" }}>
            {isLogin ? <LandingLoginForm /> : <LandingSignupForm />}
          </div>

          <div className={styles.padded}>
            {isLogin ? (
              <span
                className={"clickable-text"}
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Create Account
              </span>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <h5 style={{ marginRight: "1rem" }}>
                  Already have an account?
                </h5>
                <span
                className={"clickable-text"}
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer",
                }}
              >
                Log In
              </span>
              </div>
            )}
          </div>

          {/* This code is for the switch for the login/signup page. I'm not sure how to get it to work with the new design. I'm also not sure if it's necessary to have the switch, since the login/signup page is already pretty clear. */}
          {/* <div className={styles.pageBody} style={col}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
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
                  <span
                    className={classnames(styles.slider, styles.round)}
                  ></span>
                </label>
              </div>
              <div className={styles.padded}> Sign Up</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Landing;
