import React, { useState } from 'react';

const Privacy = () => {
  const [isProfilePublic, setIsProfilePublic] = useState(true);

  const handleSave = () => {
    // handle saving privacy settings (e.g., API call to Node.js backend)
    alert('Privacy settings saved!');
  };

  return (
    <div className="privacy">
      <h3>Privacy Settings</h3>
      <label>
        Profile Visibility:
        <select 
          value={isProfilePublic} 
          onChange={(e) => setIsProfilePublic(e.target.value === 'true')}
        >
          <option value="true">Public</option>
          <option value="false">Private</option>
        </select>
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Privacy;