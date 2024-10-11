import React from "react";
import { Button, TextArea } from "@blueprintjs/core";
import { useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Icon } from "@blueprintjs/core";

const ViewProfile = () => {
  const [editBio, setEditBio] = useState(false);

  const linkSpotifyAccount = () => {
    const spotifyAuthUrl = `http://localhost:3001/spotify-login`; // This is the backend route
    window.open(spotifyAuthUrl, '_blank', 'noopener,noreferrer');
};


  return (
    <div>
      <h1>Your Profile</h1>

      <Icon style={{ padding: 20 }} iconSize={80} icon="user" />

      <div>
        <TextArea
          intent="none"
          style={{
            resize: "none",
            width: "800px",
            height: "100px",
            borderRadius: 10,
          }}
          growVertically={true}
          small
          readOnly
          placeholder="Put your bio here"
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button
          text="Link Account with Spotify"
          intent="primary"
          icon="music"
          onClick={linkSpotifyAccount}
        />
      </div>
    </div>
  );
};

export default ViewProfile;
