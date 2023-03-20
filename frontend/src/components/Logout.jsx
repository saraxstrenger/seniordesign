import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ setLoggedIn }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("logging out");
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
