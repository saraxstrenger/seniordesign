import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingLoginForm({setLoggedIn}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
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
    <div style={{ display: "flex", flexDirection: "column" }}>
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
