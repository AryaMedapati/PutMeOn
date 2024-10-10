import React, { useState, useEffect } from 'react';
import './Profile.css';
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

function Profile() {
  const [activeContent, setActiveContent] = useState('');
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
    <div className="sidebar-container" style={{ display: 'flex' }}>
      <ProfileSidebar onChangeContent={setActiveContent} />
      <div className="main-content" 
        style={{ 
          marginLeft: '20px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <ProfileContent activeContent={activeContent} />
      </div>
    </div>
  );
}

export default Profile;
