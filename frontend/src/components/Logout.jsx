import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../context";
export default function Logout() {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        setLoggedIn(false);
        navigate("/");
      } else {
        return;
        //TODO: error
      }
    });
  };
  return <button onClick={handleLogout}>Logout</button>;
}
