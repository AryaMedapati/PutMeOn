import React, { useRef } from "react";
import { Button, TextArea } from "@blueprintjs/core";
import { useState, useEffect, useContext } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Icon } from "@blueprintjs/core";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";
import axios from "axios";

const ViewProfile = () => {
  const [pfp, setPfp] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);

  const db = getFirestore();
  const { username } = useContext(UserContext);

  const linkSpotifyAccount = () => {
    const spotifyAuthUrl = `http://localhost:3001/spotify-login`;
    window.open(spotifyAuthUrl, "_blank", "noopener,noreferrer");
  };

  const displayImage = (base64String) => {
    const img = document.createElement("img");
    img.src = base64String;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";

    const container = imageContainerRef.current;
    container.innerHTML = "";
    container.appendChild(img);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        const userDoc = await getDoc(doc(db, "UserData", username));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPfp(data.pfp);
          setBio(data.bio);
          setEmail(data.username);
        }
      }
    };
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    displayImage(pfp);
  }, [pfp]);

  const fetchCurrentlyPlaying = async () => {
    try {
      const response = await axios.get("http://localhost:3001/currentlyPlaying");
      setCurrentlyPlaying(response.data);
    } catch (error) {
      console.error("Error fetching currently playing song:", error);
    }
  };

  useEffect(() => {
    fetchCurrentlyPlaying();
    const intervalId = setInterval(fetchCurrentlyPlaying, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <div
        style={{
          width: "800px",
          borderRadius: "20px",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          paddingRight: "30px",
        }}
      >
        <div ref={imageContainerRef} style={{ padding: "30px", border: "30px" }} />
        <div style={{ paddingLeft: "20px", fontSize: "16px" }}>
          {email || "Loading email..."}
        </div>
      </div>
      <div style={{ paddingLeft: "20px", fontSize: "16px" }}>
        {bio || "Loading bio..."}
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button
          text="Link Account with Spotify"
          intent="primary"
          icon="music"
          onClick={linkSpotifyAccount}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        {currentlyPlaying && currentlyPlaying.albumArt ? (
          <img
            src={currentlyPlaying.albumArt}
            alt="Album Art"
            style={{ width: "100px", height: "100px", borderRadius: "10px", marginRight: "20px" }}
          />
        ) : null}
        <div>
          {currentlyPlaying ? (
            <div>
              <h3>Currently Listening To:</h3>
              <p><strong>{currentlyPlaying.name}</strong> by <strong>{currentlyPlaying.artist}</strong></p>
              <p><strong>Album:</strong> {currentlyPlaying.album}</p>
              <p>
                <strong>Progress:</strong> 
                {formatTime(currentlyPlaying.progress_ms)} / 
                {formatTime(currentlyPlaying.duration_ms)}
              </p>
            </div>
          ) : (
            <p>No song is currently playing, or your account is unlinked.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
