import React, { useState } from "react";

export type LoginProps = {};

export class Login extends React.Component<LoginProps> {
  render() {
    let loggedIn = false;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Hello! Welcome to compass.</h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 200,
            justifyContent: "center",
          }}
        >
          <form action="/home">
            <input type="text" id="fname" name="fname" placeholder="username" />
            <input type="text" id="lname" name="lname" placeholder="password" />
            <br />
            <input
              type="submit"
              value={!loggedIn ? "Create Account" : "Create account clicked"}
            />
          </form>
        </div>
      </div>
    );
  }
}
