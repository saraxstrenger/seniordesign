import React, { useState } from "react";
import "./css/Buttons.css";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};

export default function ProfileInterestsForm(props) {
  const { interests } = props;
  const [interestsSet, setInterestsSet] = useState(new Set(interests));
  const [errorMsg, setErrorMsg] = useState("");

  const removeInterest = (interest) => {
    const newInterests = new Set(interestsSet);
    newInterests.delete(interest);
    setInterestsSet(newInterests);
  };

  const addInterest = (e) => {
    e.preventDefault();
    const newInterest = e.target.newInterest.value;
    if (interestsSet.has(newInterest)) {
      setErrorMsg("Interest already exists!");
      return;
    }
    setErrorMsg("");
    const newInterests = new Set(interestsSet);
    newInterests.add(newInterest);
    setInterestsSet(newInterests);
    //TODO
  };

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
        {Array.from(interestsSet).map((interest, index) => {
          return (
            <div key={index}>
              <InterestBubble
                interest={interest}
                removeInterest={removeInterest}
              />
            </div>
          );
        })}
      </div>
      <div style={{ dropShadow: "1px 1px 2px rgba(0, 0, 0, 0.25)" }}>
        <AddInterestForm addInterest={addInterest} />

        {errorMsg && <div>{errorMsg}</div>}
      </div>
    </>
  );
}

function InterestBubble(props) {
  const { interest, removeInterest } = props;
  return (
    <div className="bubble">
      {interest}
      <button
        style={{
          background: "inherit",
          border: "none",
          color: "inherit",
          padding: "0px 0px 0px 16px",
        }}
        onClick={() => {
          alert("Are you sure you want to remove this interest?");
          removeInterest(interest);
        }}
      >
        X
      </button>
    </div>
  );
}

function AddInterestForm(props) {
  const { addInterest } = props;
  return (
    <form onSubmit={addInterest}>
      <input type="text" name="newInterest" id="newInterest" />
      <input type="submit" id="submit" className={"btn"} value="add" />
    </form>
  );
}
