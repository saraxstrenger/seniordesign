import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./css/NavBar.css";
import Logout from "./Logout";

export default function NavBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-topline">
          <NavLink className="navbar-brand" to="/">
            Compass
          </NavLink>
        </div>
        <div className="navbar-bottomline">
          <div id="navbar-bottomline-left">
            <ul className="navbar-links">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/evaluations">
                  My Evaluations
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
              </li>
            </ul>
          </div>
          <div id="navbar-bottomline-right">
            <Logout/>
          </div>
        </div>
      </div>

      {/* <div className="navigation h-100 fixed-left">
        <nav className="navbar bg-dark flex-column">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              Compass
            </NavLink>
            <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
            <div
              className={`collapse navbar-collapse ${
                isCollapsed ? "show" : ""
              }`}
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/home">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/evaluations">
                    My Evaluations
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div> */}
    </>
  );
}
