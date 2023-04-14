import { useState } from "react";
import LoadingDots from "./LoadingDots";
import { useNavigate } from "react-router-dom";
import "./css/Buttons.css";
import "./css/Profile.css";
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
        }
        setProfileUpdateInProgress(false);
      });
  };
  const currentYear = new Date().getFullYear();

  return (
    <div style={col} className={ "card-no-hover"}>

      <form onSubmit={tryUpdateProfile} style={{ margin: "0px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
                <h2>Account Settings:</h2>
          {!editProfileMode ? (
            <button className={`btn`} onClick={() => setEditProfileMode(true)}>
              Update Profile
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <label htmlFor="submitProfileUpdate">
                <button
                  className="btn btn-primary"
                  label={"submit"}
                  id={"submitProfileUpdate"}
                  type={"submit"}
                  isEdit={editProfileMode}
                >submit</button>
              </label>
              <button
                className={`btn btn-tertiary`}
                onClick={() => setEditProfileMode(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
          <ProfileFormElement
            label={"Username :"}
            value={profileData?.username}
            isEdit={false}
          />
        </div>
        <hr />
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr" }}>
          <ProfileFormElement
            label={<span style={{ whiteSpace: "nowrap" }}>First Name :</span>}
            id={"first"}
            value={profileData?.first ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
          <ProfileFormElement
            label={"Last Name :"}
            id={"last"}
            value={profileData?.last ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
        </div>
        <hr />
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
          <ProfileFormElement
            label={<span style={{ whiteSpace: "nowrap" }}>Email :</span>}
            id={"email"}
            value={profileData?.email ?? ""}
            type={"text"}
            isEdit={editProfileMode}
          />
        </div>
        <hr />
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ProfileFormElement
              label={
                <span style={{ whiteSpace: "nowrap" }}>Password : *******</span>
              }
              value={null}
              isEdit={false}
            />
          </div>
          {!editProfileMode ? null : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "80px",
              }}
            >
              <ProfileUpdatePasswordForm />
            </div>
          )}
        </div>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}
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
        alignItems: "center",
      }}
    >
      {isEdit ? (
        <>
          <label
            style={{
              padding: "0px 8px",
              width: "120px",
              textAlign: "right",
              fontSize: "18px",
            }}
            htmlFor={id}
          >
            <b>{label}</b>
          </label>
          <input
            id={id}
            type="text"
            value={value}
            style={{
              border: "2px solid #999",
              borderRadius: "6px",
              padding: "10px",
              backgroundColor: "#f6f6f6",
              fontSize: "16px",
            }}
            {...formProps}
          />
        </>
      ) : (
        <>
          <label
            style={{
              padding: "0px 8px",
              width: "120px",
              textAlign: "right",
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
