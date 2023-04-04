import { useState } from "react";
import LoadingDots from "./LoadingDots";
import { useNavigate } from "react-router-dom";
import "./css/Buttons.css"

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

export default function ProfileUpdateForm(props) {
  const { profileData, setProfileData } = props;
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileUpdateInProgress, setProfileUpdateInProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const tryUpdateProfile = async function (e) {
    e.preventDefault();
    setProfileUpdateInProgress(true);
    const updatedProfile = {
      first: e.target.first.value,
      last: e.target.last.value,
      email: e.target.email.value,
      major: e.target.major.value,
      entranceYear: e.target.entranceYear.value,
    };
    fetch("/updateProfile", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        }
        return res.json();
      })
      .then((resJson) => {
        if (!resJson.success) {
          setErrorMsg(resJson.errorMsg);
        } else {
          updatedProfile.username = profileData.username;
          setProfileData(updatedProfile);
          setEditProfileMode(false);
        }
        setProfileUpdateInProgress(false);
      });
  };
  const currentYear = new Date().getFullYear();

  return (
    <div style={col}>
      <div style={row}>
        <ProfileFormElement
          label={"Username"}
          value={profileData?.username}
          isEdit={false}
        />
      </div>
      <form onSubmit={tryUpdateProfile} style={col}>
        <div style={row}>
          <ProfileFormElement
            label={"First Name"}
            id={"first"}
            value={profileData?.first ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />

          <ProfileFormElement
            label={"Last Name"}
            id={"last"}
            value={profileData?.last ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
        </div>
        <ProfileFormElement
          label={"Email"}
          id={"email"}
          value={profileData?.email ?? ""}
          type={"text"}
          isEdit={editProfileMode}
        />
        <ProfileFormElement
          label={"Major"}
          id={"major"}
          value={profileData?.major ?? ""}
          type={"text"}
          isEdit={editProfileMode}
        />
        <ProfileFormElement
          label={"Entrance Year"}
          id={"entranceYear"}
          value={profileData?.entranceYear ?? ""}
          type={"number"}
          options={range(25, currentYear - 25)}
          isEdit={editProfileMode}
        />

        {editProfileMode ? (
          <label for="submitProfileUpdate">
            <input
              className={"btn"}
              label={"submit"}
              id={"submitProfileUpdate"}
              type={"submit"}
              isEdit={editProfileMode}
            />
          </label>
        ) : null}
        {errorMsg ? <div style={{ color: "red" }}>{errorMsg}</div> : null}
      </form>
      <button
        style={{ margin: 8 }}
        className={"btn"}
        onClick={() => setEditProfileMode(!editProfileMode)}
      >
        {editProfileMode ? "Cancel" : "Update Profile"}
      </button>
      {profileUpdateInProgress ? <LoadingDots /> : null}
    </div>
  );
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}

function ProfileFormElement({ label, id, value, isEdit, ...formProps }) {
  return (
    <div style={{ padding: 8, display:"flex", flexDirection:"row"}}>
      {isEdit ? (
        <>
          <label style={{ padding: "0px 4px" }} for={id}>
            <b>{label}: </b>
          </label>
          <input
            {...formProps}
            id={id}
            name={id}
            placeholder={label}
            defaultValue={value}
          
          />
        </>
      ) : (
        <>
          <b>{label}: </b>
          {value}
        </>
      )}
    </div>
  );
}
