import React from "react";
import { NavLink } from "react-router-dom";
import "./css/NavBar.css";

export default function NavBar() {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Compass
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Courses
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/courses">
                  My Courses
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}


