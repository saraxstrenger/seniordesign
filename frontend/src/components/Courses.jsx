import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function Courses() {
  return (
    
    <div className="home">
      <NavBar/>
      <div class="container">
        <h1 className="text-center mt-5">Courses</h1>
        <Outlet />
      </div>
    </div>
  );
}

export default Courses;
