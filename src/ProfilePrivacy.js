import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPrivacySettings(data.privacySettings || privacySettings);
          setIsPrivate(data.isPrivate || false);
          setTwoStepAuth(data.twoStepAuth || false);
        }
      }
    };
    fetchPrivacySettings();
  }, [user]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPrivacySettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleProfilePrivacyChange = () => {
    setIsPrivate((prevIsPrivate) => !prevIsPrivate);
  };

  const handleTwoStepAuthChange = () => {
    setTwoStepAuth((prevTwoStepAuth) => !prevTwoStepAuth);
  };

  const handleSaveSettings = async () => {
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          privacySettings: privacySettings,
          isPrivate: isPrivate,
          twoStepAuth: twoStepAuth,
        });
        alert("Privacy settings saved successfully.");
      } catch (error) {
        console.error("Error saving settings:", error);
        alert("Error saving privacy settings. Please try again.");
      }
    } else {
      alert("No user logged in.");
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
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default ProfilePrivacy;