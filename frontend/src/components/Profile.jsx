import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};

const col = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

export default function Profile(props) {
  const { setLoggedIn } = props;
  const [errorMsg, setErrorMsg] = useState("");
  const [userData, setUserData] = useState({});
  const [editProfileMode, setEditProfileMode] = useState(false);
  function range(size, startAt = 0) {
    return [...Array(size).keys()].map((i) => i + startAt);
  }

  useEffect(() => {
    fetch("/profile", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        setLoggedIn(res !== 401);
        return res.json();
      })
      .then((resJson) => {
        console.log(resJson);
        if (resJson.success) {
          setUserData(resJson.user);
        } else {
          setErrorMsg(resJson.errorMsg);
        }
      });
  }, [props]);
  const tryUpdateProfile = async function (e) {
    e.preventDefault();
  };

  // useEffect(() => {
  //   fetch("/profile", {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((resJson) => {
  //       setUserData(resJson);
  //     });
  // }, [props]);

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <NavBar />
      <div className={styles.page}>
        <h1>Profile page</h1>
        <div style={row}>Username: {userData?.username ?? ""}</div>
        <form onSubmit={tryUpdateProfile} style={col}>
          <div style={row}>
            <FormElement
              label={"First Name"}
              id={"first"}
              value={userData?.first ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />

            <FormElement
              label={"Last Name"}
              id={"last"}
              value={userData?.last ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />
          </div>
          <FormElement
            label={"Email"}
            id={"email"}
            value={userData?.email ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
          <FormElement
            label={"Major"}
            id={"major"}
            value={userData?.major ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
          <FormElement
            label={"Entrance Year"}
            id={"entranceYear"}
            value={userData?.entranceYear ?? ""}
            type={"number"}
            options={range(25, currentYear - 25)}
            isEdit={editProfileMode}
          />
          <button
            style={{ margin: 8 }}
            onClick={() => setEditProfileMode(!editProfileMode)}
          >
            {editProfileMode ? "Cancel" : "Update Profile"}
          </button>
          <label for="submit" hidden={!editProfileMode}>
            <input
              label={"submit"}
              id={"submit"}
              type={"submit"}
              isEdit={editProfileMode}
            />
          </label>
        </form>
      </div>
    </div>
  );
}

function FormElement({ label, id, value, isEdit, ...formProps }) {
  return (
    <div style={{ padding: 8 }}>
      {isEdit ? (
        <div>
          <label style={{ padding: "0px 4px" }} for={id}>
            <b>{label}: </b>
          </label>
          <input {...formProps} id={id} name={id} placeholder={label} />
        </div>
      ) : (
        <div >
          <b>{label}: </b>
          {value}
        </div>
      )}
    </div>
  );
}
