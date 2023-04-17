import { NavLink } from "react-router-dom";
import "./css/NavBar.css";
import Logout from "./Logout";
import { FaHome, FaUser, FaList } from 'react-icons/fa';

export default function NavBar() {
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
                  <FaHome /> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/evaluations">
                  <FaList /> My Evaluations
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  <FaUser /> Profile
                </NavLink>
              </li>
            </ul>
          </div>
          <Logout/>

        </div>
      </div>
    </>
  );
}
