import { useState } from "react";
import Modal from "./Modal";
import "./css/Modal.css";
import "./css/Buttons.css";

const row = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
};
const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};

const labelStyle = {
  width: "200px",
  marginRight: "10px",
  textAlign: "right",
};

const inputStyle = {
  border: "2px solid #999",
  borderRadius: "6px",
  padding: "10px",
  backgroundColor: "#f6f6f6",
  fontSize: "16px",
};
export default function ProfileUpdatePasswordForm(props) {
  const [updateMode, setUpdateMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const tryUpdatePassword = async (e) => {
    console.log(e);
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmNewPassword = e.target.confirmNewPassword.value;
    console.log(oldPassword, newPassword);
    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New passwords do not match");
      return;
    }
    fetch("/updatePassword", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          //unauthorized
          return { success: false, errorMsg: "Unauthorized" };
        } else if (res.status === 400) {
          return { success: false, errorMsg: "Bad Request" };
        }
        return res.json();
      })
      .then((resJson) => {
        alert(JSON.stringify(resJson));
        if (resJson.success) {
          setUpdateMode(false);
        } else {
          setErrorMsg(resJson.errorMsg);
        }
      });
  };

  return (
    <>
      <button className={`btn`} onClick={() => setUpdateMode(true)}>
        Update Password
      </button>
      <Modal isOpen={updateMode} modalStyle={{width: "70%", justifyContent:"center"}}>
        <h2>Update Password</h2>
        <form style={col} onSubmit={tryUpdatePassword} id="updatePassword">
          <div style={row}>
            <label htmlFor="oldPassword" style={labelStyle}>
              Old Password:
            </label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              style={inputStyle}
            />
          </div>
          <div style={row}>
            <label htmlFor="newPassword" style={labelStyle}>
              New Password:
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              style={inputStyle}
            />
          </div>
          <div style={row}>
            <label htmlFor="confirmNewPassword" style={labelStyle}>
              Confirm New Password:
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            form="updatePassword"
            className="btn"
            style={{ marginTop: "20px" }}
          >
            Submit
          </button>
          <center>
            {errorMsg && (
              <div style={{ color: "red", fontSize: "small", maxWidth:"inherit"}}>{errorMsg}</div>
            )}
          </center>
        </form>

        <button
          className="modal-close-btn"
          onClick={() => setUpdateMode(false)}
          aria-label="Close Modal"
        >
          &times;
        </button>
      </Modal>
    </>
  );
}
