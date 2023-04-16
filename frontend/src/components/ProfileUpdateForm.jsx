import { useState } from "react";
import LoadingDots from "./LoadingDots";
import { useNavigate } from "react-router-dom";
import "./css/Buttons.css";
import "./css/Profile.css";
import "./css/Forms.css";
import ProfileUpdatePasswordForm from "./ProfileUpdatePasswordForm";

const col = {
  display: "flex",
  justifyContent: "center",
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
          setErrorMsg("");
        }
        setProfileUpdateInProgress(false);
      });
  };

  return (
    <div style={{ ...col, padding: "0px 24px" }} className={"card-no-hover"}>
      <form onSubmit={tryUpdateProfile}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Account Settings:</h2>
        </div>

        <div className="row">
          <div className="halfCol leftCol">
            <ProfileFormElement
              label={"Username:"}
              value={profileData?.username}
              isEdit={false}
            />
          </div>
          <div className="halfCol rightCol">
            <ProfileFormElement
              label={
                <span style={{ whiteSpace: "nowrap" }}>Password : *******</span>
              }
              value={null}
              isEdit={false}
            />
          </div>
          {!editProfileMode ? null : (
            <div className="halfCol rightCol">
              <ProfileUpdatePasswordForm />
            </div>
          )}
        </div>
        <hr />
        <div className="row">
          <div className="halfCol leftCol">
            <ProfileFormElement
              label={"First Name:"}
              id={"first"}
              value={profileData?.first ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />
          </div>
          <div className="halfCol rightCol">
            <ProfileFormElement
              label={"Last Name:"}
              id={"last"}
              value={profileData?.last ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="halfCol leftCol">
            <ProfileFormElement
              label={"Major:"}
              id={"major"}
              value={profileData?.major ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />
          </div>
          <div className="halfCol rightCol">
            <ProfileFormElement
              label={"Enterance year:"}
              id={"entranceYear"}
              value={profileData?.entranceYear}
              type={"number"}
              isEdit={editProfileMode}
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="halfCol leftCol">
            <ProfileFormElement
              label={"Email:"}
              id={"email"}
              value={profileData?.email ?? ""}
              type={"text"}
              isEdit={editProfileMode}
            />
          </div>
        </div>

        <div className="row" style={{ justifyContent: "flex-end" }}>
  {!editProfileMode ? (
    <button className={`btn`} onClick={() => setEditProfileMode(true)}>
      Update Profile
    </button>
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <label htmlFor="submitProfileUpdate">
        <button
          className="btn btn-primary"
          label={"submit"}
          id={"submitProfileUpdate"}
          type={"submit"}
        >
          submit
        </button>
      </label>
      <button
        type="button"
        className={`btn btn-tertiary`}
        onClick={() => setEditProfileMode(false)}
      >
        Cancel
      </button>
    </div>
  )}
</div>


        {errorMsg && (
          <div
            style={{
              color: "red",
              textAlign: "center",
              fontSize: "small",
            }}
          >
            {errorMsg}
          </div>
        )}
      </form>

      {profileUpdateInProgress ? <LoadingDots /> : null}
    </div>
  );
}

function ProfileFormElement({ label, id, value, isEdit, ...formProps }) {
  return (
    <div
      style={{
        padding: "16px 0",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {isEdit ? (
        <>
          <label
            style={{
              padding: "0px 8px",
              // width: "120px",
              textAlign: "left",
              fontSize: "18px",
            }}
            htmlFor={id}
          >
            <b>{label}</b>
          </label>
          <div>
            <input
              id={id}
              type="text"
              defaultValue={value}
              className="form-input"
              style={{ boxSizing: "border-box" }}
              {...formProps}
            />
          </div>
        </>
      ) : (
        <>
          <label
            style={{
              padding: "0px 8px",
              // width: "120px",
              textAlign: "left",
              fontSize: "18px",
            }}
          >
            <b>{label}</b>
          </label>
          <span>{value}</span>
        </>
      )}
    </div>
  );
}
