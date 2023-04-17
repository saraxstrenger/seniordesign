import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../context";
import "./css/Card.css";
import "./css/Buttons.css";
import LandingSignupForm from "./LandingSignupForm";

const inputStyle = {
  borderRadius: "6px",
  padding: "10px",
  backgroundColor: "#f6f6f6",
  fontSize: "16px",
};

export default function LandingLoginForm() {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const tryLogin = async function (e, setLoggedIn) {
    e.preventDefault();
    // todo: some inflight display/loading
    let res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password, // TODO: encrypt password
      }),
    });

    let resJson = await res.json();
    if (resJson.success === true) {
      setLoggedIn(true);
      let path = `/home/`;
      navigate(path);
    } else {
      setShowError(true);
      setErrorMsg(
        resJson?.errorMsg ?? "Unable to complete login at this time."
      );
    }
  };

  return (
    <div>
      <center>
        <h2>Sign in</h2>
      </center>
      <form
        onSubmit={(e) => tryLogin(e, setLoggedIn)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              name="username"
              placeholder="unsername"
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
                border: "1px solid gray",
                flex: 1,
                fontSize: "1rem",
                width: "30%",
              }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <input
              type="password"
              name="password"
              placeholder="Password"
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
                border: "1px solid gray",
                flex: 1,
                fontSize: "1rem",
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div
          style={{ color: "red", fontSize: "small", marginBottom: "0.5rem" }}
        >
          {showError ? errorMsg : null}
        </div>
        <button
          className={`btn btn-primary`}
          style={{
            color: "white",
            padding: "0.5rem",
            margin: "0.5rem",
            borderRadius: "5px",
            border: "none",
            width: "30%",
            fontSize: "1rem",
          }}
        >
          Log In
        </button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1rem",
        }}
      ></div>
    </div>
  );
}
