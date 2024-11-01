import React, { useState, useEffect, useContext } from "react";
import localstorage from "localstorage-slim";
import { UserContext } from "./UserContext";

const SpotifyTrackerButton = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [username, setUsername] = useState("");
  const { email } = useContext(UserContext);

  //   useEffect(() => {
  //     const hasStartedTracking = localstorage.get("hasStartedTracking");
  //     setIsButtonVisible(!hasStartedTracking);
  //   }, []);
  useEffect(() => {
    if (email) {
      setUsername(email);
    } else {
      const storedUsername = localstorage.get("user");
      console.log(storedUsername);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  const startTracking = async () => {
    try {
      console.log("before track response");
      const res = await fetch("http://localhost:3001/startTracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || localstorage.get("user"),
        }),
      });
      console.log(res);
      localstorage.set("hasStartedTracking", true);
      setIsButtonVisible(false);
    } catch (error) {
      console.error("Error starting Spotify tracking:", error);
    }
  };

  return (
    <div>
      {/* {isButtonVisible && (
        <button onClick={startTracking}>Start Tracking Spotify Data</button>
      )} */}
      <button onClick={startTracking}>Start Tracking Spotify Data</button>
    </div>
  );
};

export default SpotifyTrackerButton;
