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

  return (
    <>
      <button className={`btn`} onClick={() => setUpdateMode(true)}>
        Update Password
      </button>
      <Modal isOpen={updateMode} setIsOpen={setUpdateMode}>
        <h2>Update Password</h2>
        <form style={col}>
          <div style={row}>
            <label htmlFor="oldPassword" style={labelStyle}>
              Old Password:
            </label>
            <input
              type="password"
              name="oldPassword"
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
              style={inputStyle}
            />
          </div>

          <input
            type="submit"
            value="Submit"
            className="btn"
            style={{ marginTop: "20px" }}
          />
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
