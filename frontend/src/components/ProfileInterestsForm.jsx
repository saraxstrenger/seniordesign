import React, { useState } from "react";
import "./css/InterestForm.css";
export default function ProfileInterestsForm(props) {
  const { interests } = props;
  const [interestsState, setInterestsState] = useState(new Set(interests));
  const [errorMsg, setErrorMsg] = useState("");
  const [editMode, setEditMode] = useState(false);

  const removeInterest = (interest) => {
    const newInterests = new Set(interestsState);
    newInterests.delete(interest);
    setInterestsState(newInterests);
  };

//   const handleSave = () => {
//     //TODO
//   };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "75%",
          padding: 12,
        }}
      >
        {interests.map((interest, index) => {
          return (
            <div key={index}>
              <InterestBubble interest={interest} editMode={editMode} removeInterest={removeInterest} />
            </div>
          );
        })}
        {/* {JSON.stringify(interestsState)} */}
      </div>
      <div style={{ dropShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)" }}>
        <button
          className={"btn"}
          style={{
            borderRadius: 16,
            padding: "4px 12px",
            margin: 4,
            // background: "white",
            // borderWidth: 2,
            // border: "2px solid #55868C",
            // filter: "inner-shadow(1px 1px 2px rgba(0, 0, 0, 0.25))",
          }}
          onClick={() => setEditMode(!editMode)}
        >
          Edit
        </button>
        {errorMsg && <div>{errorMsg}</div>}
      </div>
    </>
  );
}

function InterestBubble(props) {
  const { interest, editMode, removeInterest } = props;
  return (
    <div className="bubble">
      interest
      {editMode && (
        <button
          style={{
            background: "yellow",
            border: "none",
            padding: "0px 100px 0px 0px",
          }}
          onClick={() => removeInterest(interest)}
        >
          x
        </button>
      )}
    </div>
  );
}
