import React from "react";
import styles from "./css/utils.module.css";
import { useState } from "react";

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

// export default class SignupForm extends React.Component {
export default function SignupForm(props) {
  const { setLoggedIn } = props;
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [entranceYear, setEntranceYear] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const FormElement = function(props) {
    return (
      <div style={{ padding: 8 }}>
        <label style={{ paddingRight: 8 }} hidden={props.labelHidden === true}>
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
          <input {...props} />
        )}
      </div>
    );
  };

  const trySignup = async function() {
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
        return;
      setErrorMsg("");
      setLoggedIn(true);
    } else {
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
              width: "110%",
              justifyContent: "space-between",
            }}
          >
            <div>
              {FormElement({
                label: "first:",
                type: "text",
                name: "first",
                placeholder: "first name",
                required: true,
                onChange: (e) => setFirst(e.target.value),
                value: first,
              })}
            </div>

            <div>
              {FormElement({
                label: "last:",
                type: "text",
                name: "last",
                required: true,
                placeholder: "last name",
                onChange: (e) => setLast(e.target.value),
                value: last,
              })}
            </div>
          </div>

          {FormElement({
            label: "email:",
            type: "text",
            name: "email",
            required: true,
            placeholder: "email",
            onChange: (e) => setEmail(e.target.value),
            value: email,
          })}

          {FormElement({
            label: "username:",
            type: "text",
            name: "username",
            required:true,
            placeholder: "username",
            onChange: (e) => setUsername(e.target.value),
            value: username,
          })}

          {FormElement({
            label: "password:",
            type: "password",
            name: "password",
            required:true,
            placeholder: "password",
            onChange: (e) => setPassword(e.target.value),
            value: password,
          })}

          {FormElement({
            label: "major:",
            type: "text",
            name: "major",
            required:true,
            placeholder: "major",
            onChange: (e) => setMajor(e.target.value),
            value: major,
          })}

          {FormElement({
            label: "entrance year:",
            name: "entranceYear",
            id: "entranceYear",
            required:true,
            type: "select",
            options: range(25, currentYear - 25),
            onChange: (e) => setEntranceYear(e.target.value),
            value: entranceYear,
          })}

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
            labelHidden: true,
            type: "submit",
            value: "Sign up!",
            // onSubmit: { trySignup },
          })}
        </div>
      </form>
    </div>
  );
}
