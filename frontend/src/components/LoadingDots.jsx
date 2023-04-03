import React from "react";
import "./css/LoadingDots.css";

const innerStyle = {
  width: 16,
  height: 16,
  margin: "3px 6px",
  borderRadius: "50%",
  backgroundColor: "#a3a1a1",
  opacity: 1,
  animation: "bouncing-loader 0.6s infinite alternate",
};
export default function LoadingDots() {
  return (
    <>
      <div
        className="bouncingLoader"
      >
        {/* This is a dumpster fire but can't get css stylesheets to work :( */}
         <div style={{...innerStyle,animationDelay: "0.0s"}}></div>

         <div style={{...innerStyle, animationDelay: "0.2s"}}></div>

         <div style={{...innerStyle, animationDelay: "0.4s"}}></div>
     
      </div>
    </>
  );
}
