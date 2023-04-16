import React, { useEffect, useState } from "react";
import "./css/Buttons.css";
import "./css/Forms.css";
import "./css/Card.css";
import LoadingDots from "./LoadingDots";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from "@fortawesome/free-solid-svg-icons";



export default function ProfileInterestsForm(props) {
  const { interests } = props;
  const [interestsSet, setInterestsSet] = useState(new Set(interests));
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setInterestsSet(new Set(interests ?? []));
  }, [interests]);

  const removeInterest = (removedInterest) => {
    if (!interestsSet.has(removedInterest)) {
      setErrorMsg("Interest not found.");
      return;
    }
    fetch("/removeInterest", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        interest: removedInterest,
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
          setErrorMsg(resJson?.errorMsg ?? "Unable to remove interest.");
        } else {
          setErrorMsg("");
          const updatedInterests = new Set(interestsSet);
          updatedInterests.delete(removedInterest);
          setInterestsSet(updatedInterests);
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
    fetch("/addInterest", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        interest: newInterest,
      }),
    })
      .then((res) => {
        if (res.status !== 200) {
          setErrorMsg("Unable to add interest at this time.");
          return null;
        } else {
          return res.json();
        }
      })
      .then((resJson) => {
        if (resJson.errorMsg) {
          setErrorMsg(
            resJson?.errorMsg ?? "Unable to add interest at this time."
          );
        } else if (resJson.success === true) {
          setErrorMsg("");
          const updatedInterests = new Set(interestsSet);
          updatedInterests.add(newInterest);
          setInterestsSet(updatedInterests);
          e.target.newInterest.value = "";
        }
      });
  };

  return (
    <div className="card-no-hover" style={{ padding: "0px 24px" }}>
      <h2>Your Interests:</h2>
      <div
        style={{
          paddingBottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            padding: 12,
          }}
        >
          {interests === null ? (
            <LoadingDots />
          ) : interestsSet.size > 0 ? (
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
            <>
              <h4 style={{ margin: 8 }}>No interests added yet!</h4>
            </>
          )}
        </div>
        <AddInterestForm addInterest={addInterest} />
        {errorMsg && (
          <div
            style={{
              color: "red",
              fontSize: "small",
              paddingTop: 8,
            }}
          >
            {errorMsg}
          </div>
        )}
      </div>
    </div>
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
    padding: "0px 0px 0px 8px",
    cursor: "pointer",
  }}
  onClick={() => {
    removeInterest(interest);
  }}
>
  <FontAwesomeIcon icon={faTimes} />
</button>

    </div>
  );
}

function AddInterestForm(props) {
  const { addInterest } = props;
  return (
    <form onSubmit={addInterest} style={{display: "flex", flexDirection:"row"}}>
      <input
        type="text"
        name="newInterest"
        id="newInterest"
        className="form-input"
        style={{ minWidth: "50%" }}
      />
      <button type="submit" id="submit" className={"btn"} value="add">
        add
      </button>
    </form>
  );
}
