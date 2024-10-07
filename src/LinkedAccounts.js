import React, { useState } from 'react';

const LinkedAccounts = () => {
  const [linkedAccounts, setLinkedAccounts] = useState({
    google: true,
    facebook: false,
  });

  const handleSave = () => {
    // handle saving linked accounts settings (e.g., API call to Node.js backend)
    alert('Linked accounts settings saved!');
  };

  return (
    <div className="linked-accounts">
      <h3>Linked Accounts</h3>
      <label>
        Google:
        <input 
          type="checkbox" 
          checked={linkedAccounts.google} 
          onChange={(e) => setLinkedAccounts({ ...linkedAccounts, google: e.target.checked })} 
        />
      </label>
      <label>
        Facebook:
        <input 
          type="checkbox" 
          checked={linkedAccounts.facebook} 
          onChange={(e) => setLinkedAccounts({ ...linkedAccounts, facebook: e.target.checked })} 
        />
      </label>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default LinkedAccounts;