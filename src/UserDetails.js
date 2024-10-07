import React, { useState } from 'react';

const UserDetails = () => {
  const [username, setUsername] = useState('JohnDoe');
  const [email, setEmail] = useState('johndoe@example.com');

  const handleSave = () => {
    // handle saving user details (e.g., API call to Node.js backend)
    alert('User details saved!');
  };

  return (
    <div className="user-details">
      <h3>User Details</h3>
      <label>
        Username:
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </label>
      <label>
        Email:
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default UserDetails;