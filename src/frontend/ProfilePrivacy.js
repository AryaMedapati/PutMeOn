import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
import { UserContext } from "./UserContext";

const ProfilePrivacy = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    topTracks: false,
    topAlbums: false,
    topGenres: false,
    playlists: false,
    listeningActivity: false,
  });
  const [twoStepAuth, setTwoStepAuth] = useState(false);

  const db = getFirestore();
  const { username, email } = useContext(UserContext);

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        if (email) return;

        const response = await fetch('http://localhost:3001/fetchPrivacySettings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: email }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch privacy settings. Please try again later.');
        }

        const data = await response.json();
        setPrivacySettings(data.privacySettings); // Ensure chatNames is set from response
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      }

    };
    fetchPrivacySettings();
  }, [username]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleProfilePrivacyChange = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);

    if (isPrivate) {
      setPrivacySettings({
        topTracks: false,
        topAlbums: false,
        topGenres: false,
        playlists: false,
        listeningActivity: false,
      });
    }
  };
  const handleTwoStepAuthChange = () => {
    setTwoStepAuth((prevTwoStepAuth) => !prevTwoStepAuth);
  };

  const handleSaveSettings = async () => {
    if (!username) {
      alert("user not logged in");
      return;
    }
    if (!email) {
      alert("user not logged in");
      return;
    }

    try {
      const resp = await fetch('http://localhost:3001/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DocumentId': username,
        },
        body: JSON.stringify({
          username: email,
          isPrivate:isPrivate,
          privacySettings:privacySettings,
          twoStepAuth:twoStepAuth,
        }),
      });

      alert("Changes saved");
    } catch (error) {
      console.error(error);
      alert(error);
    }

  };

  return (
    <div>
      <h1>Privacy and Security Settings</h1>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handleProfilePrivacyChange}
          />
          Make my profile private
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={twoStepAuth}
            onChange={handleTwoStepAuthChange}
          />
          Enable Two-Step Authorization
        </label>
      </div>
      {isPrivate && (
        <>
          <div>
            <label>
              <input
                type="checkbox"
                name="topTracks"
                checked={privacySettings.topTracks}
                onChange={handleCheckboxChange}
              />
              Make my "Top Tracks" public
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="topAlbums"
                checked={privacySettings.topAlbums}
                onChange={handleCheckboxChange}
              />
              Make my "Top Albums" public
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="topGenres"
                checked={privacySettings.topGenres}
                onChange={handleCheckboxChange}
              />
              Make my "Top Genres" public
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="playlists"
                checked={privacySettings.playlists}
                onChange={handleCheckboxChange}
              />
              Make my playlists public
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="listeningActivity"
                checked={privacySettings.listeningActivity}
                onChange={handleCheckboxChange}
              />
              Make my listening activity public
            </label>
          </div>
        </>
      )}
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default ProfilePrivacy;