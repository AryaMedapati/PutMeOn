import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Profile.css';

function Profile() {
  const [userData, setUserData] = useState({
    username: '',
    profilePic: 'https://via.placeholder.com/150',
    bio: '',
    friends: []
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch('http://localhost:3000/profile');
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={userData.profilePic} alt="Profile" className="profile-pic" />
        <h2>{userData.username}</h2>
      </div>

      <div className="profile-bio">
        <h3>Bio</h3>
        <p>{userData.bio}</p>
      </div>

      <div className="profile-friends">
        <h3>Friends</h3>
        <ul>
          {userData.friends.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
      </div>

      {/* Add a link to the settings page */}
      <div className="profile-settings-link">
        <Link to="/settings">
          <button className="settings-button">Go to Settings</button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
