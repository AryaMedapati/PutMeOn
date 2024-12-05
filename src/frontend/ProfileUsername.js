import React, { useRef } from "react";
import { Button, TextArea } from "@blueprintjs/core";
import { useState, useEffect, useContext } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";
import localstorage from "localstorage-slim";

const ProfileUsername = () => {
  const db = getFirestore();
  // const { username } = useContext(UserContext);
  const username = localstorage.get("docId");

  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSaveChanges = async () => {
    if (username) {
      try {
        const resp = await fetch('http://localhost:3001/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DocumentId': username,
            },
            body: JSON.stringify({
              password: newPassword,
            }),
        });

        alert("Changes saved");
      } catch (error) {
        console.error(error);
        alert(error);
      }
    } else {
      alert("No user logged in.");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        const response = await fetch("http://localhost:3001/fetchCurrentUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            DocumentId: username,
          },
        });
        const data = await response.json();
        setPassword(data.password)
      }
    };
    fetchProfileData();
  }, [username]);

  return (
    <div>
      <h1>Change Password</h1>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 24,
          padding: 10,
        }}
      >
        Old Password
      </div>
      <div>
        <TextArea
          intent="none"
          style={{
            resize: "none",
            width: "800px",
            height: "40px",
          }}
          large
          value={oldPassword}
          onChange={handleOldPasswordChange}
        />
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 24,
          padding: 10,
        }}
      >
        New Password
      </div>
      <div>
        <TextArea
          intent="none"
          style={{
            resize: "none",
            width: "800px",
            height: "40px",
          }}
          large
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
      </div>
      <div>
        <Button
          intent="primary"
          style={{
            width: "160px",
            height: "35px",
            borderRadius: 20,
          }}
          onClick={handleSaveChanges}
          text="Change Password"
        />
      </div>
    </div>
  );
};

export default ProfileUsername;
