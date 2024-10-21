import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { getAuth } from "firebase/auth";

const ProfilePrivacy = () => {
  const auth = getAuth();
  const [isPrivate, setIsPrivate] = useState(false); 
  const [privacySettings, setPrivacySettings] = useState({
    topTracks: false,
    topAlbums: false,
    topGenres: false,
    playlists: false,
    listeningActivity: false,
  });
  const [twoStepAuth, setTwoStepAuth] = useState(false);
  const [authMethod, setAuthMethod] = useState('email');
  const [phoneNumber, setPhoneNumber] = useState('');

  const db = getFirestore();
  const { username } = useContext(UserContext);

  useEffect(() => {
    const fetchPrivacySettings = async () => {
      const user = auth.currentUser;
      if (user) {
        const username = user.username;
        const userDoc = await getDoc(doc(db, "UserData", username));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPrivacySettings(data.privacySettings || privacySettings);
          setIsPrivate(data.isPrivate || false);
          setTwoStepAuth(data.twoStepAuth || false);
          setAuthMethod(data.authMethod || 'email');
          setPhoneNumber(data.phoneNumber || '');
        } else {
          console.error("No such document!");
        }
      } else {
        console.error("User is not authenticated.");
      }
    };
    fetchPrivacySettings();
  }, [username]);

  // useEffect(() => {
  //   const fetchPrivacySettings = async () => {
  //     if (username) {
  //       const userDoc = await getDoc(doc(db, "UserData", username));
  //       if (userDoc.exists()) {
  //         const data = userDoc.data();
  //         setPrivacySettings(data.privacySettings || privacySettings);
  //         setIsPrivate(data.isPrivate || false);
  //         setTwoStepAuth(data.twoStepAuth || false);
  //         setAuthMethod(data.authMethod || 'email');
  //         setPhoneNumber(data.phoneNumber || '');
  //       }
  //     }
  //   };
  //   fetchPrivacySettings();
  // }, [username]);

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

  const handleAuthMethodChange = (event) => {
    setAuthMethod(event.target.value);
  };

  const handleSaveSettings = async () => {
    if (username) {
      try {
        await setDoc(doc(db, "UserData", username), {
          privacySettings: privacySettings,
          isPrivate: isPrivate,
          twoStepAuth: twoStepAuth,
          authMethod: authMethod,
          phoneNumber: phoneNumber,
        }, { merge: true });
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
    <div className="privacy-settings">
      <h3>Privacy Settings</h3>
      
      <div className="privacy-checkbox">
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handleProfilePrivacyChange}
          />
          <span className="custom-checkbox"></span>
          Make my profile private
        </label>
      </div>

      <div className="privacy-checkbox">
        <label>
          <input
            type="checkbox"
            checked={twoStepAuth}
            onChange={handleTwoStepAuthChange}
          />
          <span className="custom-checkbox"></span>
          Enable Two-Step Authorization
        </label>
      </div>

      {twoStepAuth && (
        <div className="auth-method-container">
          <label className="auth-method-label">
            Choose Authentication Method:
            <select value={authMethod} onChange={handleAuthMethodChange} className="auth-select">
              <option value="email">Email</option>
              <option value="text">Text Message</option>
            </select>
          </label>

          {authMethod === 'text' && (
            <div className="phone-number-container">
              <label className="phone-number-label">
                Phone Number:
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="phone-number-input"
                />
              </label>
            </div>
          )}
        </div>
      )}

      {Object.keys(privacySettings).map((setting) => (
        <div className="privacy-checkbox" key={setting}>
          <label>
            <input
              type="checkbox"
              name={setting}
              checked={privacySettings[setting]}
              onChange={handleCheckboxChange}
            />
            <span className="custom-checkbox"></span>
            {`Make my "${setting.replace(/([A-Z])/g, ' $1')}" public`}
          </label>
        </div>
      ))}
      
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default ProfilePrivacy;