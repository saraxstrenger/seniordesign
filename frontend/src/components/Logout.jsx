import React , {useContext} from "react";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../AuthAPI";
export default function Logout() {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const navigate = useNavigate();
  const handleLogout = () => {
    // alert("logging out");
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        // console.log(setLoggedIn)
        setLoggedIn(false);
        navigate("/");
      } else {
        return;
        //TODO: error
      }
    });
  };
  return <div style={{padding:12}}><button onClick={handleLogout}>Logout</button></div>;
}
