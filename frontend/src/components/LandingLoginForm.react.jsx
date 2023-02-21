import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "./Navigation";

export default function LandingLoginForm({setLoggedIn}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tryLogin = async function ( setLoggedIn) {
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
      // let path = `/home/`;
      // navigate(path);
    } else {
      setShowError(true);
      setErrorMsg(
        resJson?.errorMsg ?? "Unable to complete login at this time."
      );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {window.location.pathname === "/" ? null : <NavBar />}
      <input
        type="text"
        name="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ color: "red", fontSize: "small" }}>
        {showError ? errorMsg : null}
      </div>
      <button value="Submit" onClick={()=>tryLogin(setLoggedIn)}>
        Submit
      </button>
    </div>
  );
}
