import { useState } from "react";
import Modal from "./Modal";

const row = { display: "flex", justifyContent: "center", flexDirection: "row" };
const col = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
};

export default function ProfileUpdatePasswordForm(props) {
  const [updateMode, setUpdateMode] = useState(false);

  return (
    <>
      <button onClick={() => setUpdateMode(true)}>Update Password</button>
      <Modal isOpen={updateMode} setIsOpen={setUpdateMode}>
        <h2>Update Password</h2>
        <form style={col}>
          <div style={row}>
            <div style={col}>
              <label for="oldPassword">Old Password:</label>
              <label for="newPassword">New Password:</label>
              <label for="confirmNewPassword">Confirm New Password:</label>
            </div>
            <div style={col}>
              <input type="password" name="oldPassword" />

              <input type="password" name="newPassword" />
              <input type="password" name="confirmNewPassword" />
            </div>
          </div>

          <input type="submit" value="Submit" />
        </form>
        <button onClick={() => setUpdateMode(false)}>Close Modal</button>
      </Modal>
    </>
  );
}

