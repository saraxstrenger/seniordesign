import React, { useEffect, useState } from "react";
import "./css/Buttons.css";

const row = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "row",
};

export default function ProfileInterestsForm(props) {
  const { interests } = props;
  const [interestsSet, setInterestsSet] = useState(new Set(interests ?? []));
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setInterestsSet(new Set(interests ?? []));
  }, [interests]);

  const removeInterest = (removedInterest) => {
    const newInterests = new Set(interestsSet);
    newInterests.delete(removedInterest);

    fetch("/updateInterests", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        interests: Array.from(newInterests),
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorMsg("Error updating interests");
          return null;
        } else {
          return res.json();
        }
      })
      .then((resJson) => {
        if (resJson === null || resJson.success === false) {
          setErrorMsg(resJson?.errorMsg ?? "Unable to removee interest.");
        } else {
          setErrorMsg("");
          setInterestsSet(newInterests);
        }
      });
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

    fetch("/updateInterests", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        interests: Array.from(newInterests),
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorMsg("Error updating interests");
          return null;
        } else {
          return res.json();
        }
      })
      .then((resJson) => {
        if (resJson === null || resJson.success === false) {
          setErrorMsg(resJson?.errorMsg ?? "Unable to add interest.");
        } else {
          setErrorMsg("");
          setInterestsSet(newInterests);
          e.target.newInterest.value = "";
        }
      });
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
        {interestsSet.size > 0 ? (
          Array.from(interestsSet).map((interest, index) => {
            return (
              <div key={index}>
                <InterestBubble
                  interest={interest}
                  removeInterest={() => {
                    removeInterest(interest);
                  }}
                />
              </div>
            );
          })
        ) : (
          // <div style={{ padding: 12 }}>
            <h4 style={{margin:8}}>No interests added yet!</h4>
          // {/* // </div> */}
        )}
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
