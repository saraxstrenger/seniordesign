import React from "react";
import styles from "./css/utils.module.css";
import { useState, useContext } from "react";
import { AuthAPI } from "../context";

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export default function LandingSignupForm(props) {
  const setLoggedIn = useContext(AuthAPI).setAuth;
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [entranceYear, setEntranceYear] = useState(-1);
  const [errorMsg, setErrorMsg] = useState("");

  const FormElement = function (props) {
    return (
      <div
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label
          htmlFor={props.id}
          style={{ marginBottom: 4, fontSize: 14 }}
          hidden={props.labelHidden === true}
        >
          {props.label}
        </label>
        {props.type === "select" ? (
          <select {...props}>
            {props.options.reverse().map((element) => {
              return (
                <option value={element} key={element}>
                  {element}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            {...props}
            style={{
              fontSize: 14,
              padding: 8,
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        )}
      </div>
    );
  };

  const trySignup = async function (e) {
    e.preventDefault();

    // todo: some inflight display/loading
    // todo: FORM VALIDATION!!!
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
      alert("true");
      setErrorMsg("");
      setLoggedIn(true);
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div style={{ width: "40%" }}>
              {FormElement({
                label: "First Name:",
                type: "text",
                name: "first",
                id: "first",
                placeholder: "First Name",
                required: true,
                onChange: (e) => setFirst(e.target.value),
                value: first,
              })}
            </div>

            <div style={{ width: "70%" }}>
              <div>
                <label
                  htmlFor="last"
                  style={{
                    marginBottom: 4,
                    fontSize: 14,
                    height: 16,
                    alignItems: "flex-start",
                  }}
                >
                  Last Name:
                </label>
                {FormElement({
                  type: "text",
                  name: "last",
                  id: "last",
                  required: true,
                  placeholder: "Last Name",
                  onChange: (e) => setLast(e.target.value),
                  value: last,
                  style: { height: 32 },
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            {FormElement({
              label: "Email:",
              type: "text",
              name: "email",
              id: "email",
              required: true,
              placeholder: "Email",
              onChange: (e) => setEmail(e.target.value),
              value: email,
            })}

            <div style={{ width: "24%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: 52,
                  justifyContent: "space-between",
                }}
              >
                <label
                  htmlFor="major"
                  style={{
                    marginBottom: 4,
                    fontSize: 14,
                    height: 16,
                    alignItems: "flex-start",
                  }}
                >
                  Major:
                </label>
                {FormElement({
                  type: "text",
                  name: "major",
                  id: "major",
                  required: true,
                  placeholder: "Major",
                  onChange: (e) => setMajor(e.target.value),
                  value: major,
                  style: { height: 50 },
                })}
              </div>
            </div>

            <div style={{ width: "30%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: 52,
                  justifyContent: "space-between",
                }}
              >
                <label
                  htmlFor="Entrance-year"
                  style={{
                    marginBottom: 4,
                    fontSize: 14,
                    height: 16,
                    alignItems: "flex-start",
                  }}
                ></label>
                {FormElement({
                  label: "Entrance Year:",
                  name: "entranceYear",
                  id: "entranceYear",
                  required: true,
                  type: "select",
                  options: range(25, currentYear - 25),
                  onChange: (e) => setEntranceYear(e.target.value),
                  value: entranceYear,
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div style={{ width: "45%" }}>
              {FormElement({
                label: "username:",
                type: "text",
                name: "username",
                id: "username",
                required: true,
                placeholder: "username",
                onChange: (e) => setUsername(e.target.value),
                value: username,
              })}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "80%",
                alignItems: "flex-start",
                margin: "auto 0",
              }}
            >
              {FormElement({
                label: "password:",
                type: "password",
                name: "password",
                id: "password",
                required: true,
                placeholder: "password",
                onChange: (e) => setPassword(e.target.value),
                value: password,
              })}
            </div>
          </div>

          {errorMsg !== "" ? (
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
          {FormElement({
            label: "submit",
            id: "submit",
            labelHidden: true,
            type: "submit",
            value: "Sign up!",
            className: "btn btn-secondary",
          })}
        </div>
      </form>
    </div>
  );
}
