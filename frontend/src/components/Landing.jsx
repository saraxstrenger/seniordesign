import '../App.css';
import React from "react";
import LandingLoginForm from './LandingLoginForm.react';

function Landing(props) {
  return (
    <div className="App">
      <header className="App-header">
        <LandingLoginForm {...props} />
      </header>
    </div>
  );
}


export default Landing;