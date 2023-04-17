import React, { useEffect } from "react";
import styles from "./css/utils.module.css";
import { useState, useContext } from "react";
import { AuthAPI } from "../context";
import "./css/Landing.css";
import { useNavigate } from "react-router-dom";
function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export default function LandingSignupForm(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const loggedIn = useContext(AuthAPI).auth;
  const [errorMsg, setErrorMsg] = useState("aa");
  const navigate = useNavigate();
  const trySignup = async function (e) {
    e.preventDefault();
    const first = e.target?.first?.value;
    const last = e.target?.last?.value;
    const email = e.target?.email?.value;
    const username = e.target?.username?.value;
    const password = e.target?.password?.value;
    const confirmPassword = e.target?.confirmPassword?.value;
    const major = e.target?.major?.value;
    const entranceYear = parseInt(e.target?.entranceYear?.value ?? 0);
   
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    let res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first,
        last,
        email,
        username,
        password, // TODO: encrypt password
        major,
        entranceYear,
      }),
    });

    let resJson = await res.json();
    if (resJson.success === true) {
      setErrorMsg("");
      setLoggedIn(true);
      let path = `/home/`;
      navigate(path);
    } else {
      // todo: display meaningful error message (probably from backend)
      setErrorMsg(
        resJson?.errorMsg ?? "Unable to complete login at this time."
      );
    }
  };
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <form onSubmit={trySignup}>
        <div className={styles.column}>
          <div className="input-row">
            <FormElement
              label="First Name:"
              type="text"
              name="first"
              placeholder="First Name"
              required={true}
              width="33%"
            />
            <FormElement
              label="Last Name:"
              type="text"
              name="last"
              required={true}
              placeholder="Last Name"
              width="33%"
            />
          </div>

          <div className="input-row">
            <FormElement
              label="Email:"
              type="text"
              name="email"
              required={true}
              placeholder="Email"
              width="33%"
            />

            <FormElement
              type="text"
              name="major"
              label="Major:"
              required={true}
              placeholder="Major"
              width="33%"
            />

            <FormElement
              label="Entrance Year:"
              name="entranceYear"
              required={true}
              type="select"
              options={range(25, currentYear - 25).reverse()}
              width="20%"
            />
          </div>

          <div className="input-row">
            <FormElement
              label="Username:"
              type="text"
              name="username"
              required={true}
              placeholder="username"
              width="33%"
            />

            <div style={{ width: "66%" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <FormElement
                  width="50%"
                  label="Password:"
                  type="password"
                  name="password"
                  required={true}
                  style={{ width: "inherit" }}
                  placeholder="password"
                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  title="Please ensure that your password meets the requirements listed below."
                />
                <FormElement
                  width="50%"
                  label="Confirm Password:"
                  type="password"
                  name="confirmPassword"
                  required={true}
                  style={{ width: "inherit" }}
                  placeholder="password"
                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  title="Please ensure that your password meets the requirements listed below."
                />
              </div>
              <div style={{ fontSize: "x-small" }}>
                Password must be at least 8 characters, contain at least one
                number, one uppercase letter, and one lowercase letter.
              </div>
            </div>
          </div>
          <div className="input-row">
            {errorMsg ? (
              <div
                style={{
                  padding: "0px 0px 0px 8px",
                  color: "red",
                  fontSize: "small",
                }}
              >
                {errorMsg}
              </div>
            ) : null}
          </div>

          <FormElement
            label="submit"
            labelHidden={true}
            type="submit"
            value="Sign up!"
            className="btn btn-secondary"
          />
        </div>
      </form>
    </div>
  );
}

function FormElement({
  label,
  name,
  type,
  value,
  required,
  options,
  className,
  width,
  labelHidden,
}) {
  return (
    <div
      style={{
        width: width ?? "auto",
        margin: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <label
        htmlFor={name}
        style={{ marginBottom: 4, fontSize: 14 }}
        hidden={labelHidden === true}
      >
        {label}
      </label>
      {type === "select" ? (
        <select name={name} required={required}>
          {options.map((element) => {
            return (
              <option value={element} key={element}>
                {element}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          className={className ?? ""}
          name={name}
          id={name}
          style={{
            fontSize: 14,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
            marginTop: 0,
            width: "fit-content",
          }}
        />
      )}
    </div>
  );
}
