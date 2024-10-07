import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    isPublic: true,
    linkedAccounts: {
      google: false,
      facebook: false,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUserDetails({
        ...userDetails,
        [name]: checked,
      });
    } else {
      setUserDetails({
        ...userDetails,
        [name]: value,
      });
    }
  };

  const handleLinkedAccountChange = (e) => {
    const { name, checked } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      linkedAccounts: {
        ...prevDetails.linkedAccounts,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit user details to the server
    console.log(userDetails);
    // You can send the user details to your backend here
  };

  return (
    <Router>
      <div className="settings-container">
        <Sidebar />
        <div className="settings-content">
          <Switch>
            <Route path="/settings/user-details">
              <UserDetails 
                userDetails={userDetails}
                handleInputChange={handleInputChange}
              />
            </Route>
            <Route path="/settings/privacy">
              <Privacy 
                isPublic={userDetails.isPublic}
                handleInputChange={handleInputChange}
              />
            </Route>
            <Route path="/settings/linked-accounts">
              <LinkedAccounts 
                linkedAccounts={userDetails.linkedAccounts}
                handleLinkedAccountChange={handleLinkedAccountChange}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Settings</h2>
      <ul>
        <li><Link to="/settings/user-details">User Details</Link></li>
        <li><Link to="/settings/privacy">Privacy</Link></li>
        <li><Link to="/settings/linked-accounts">Linked Accounts</Link></li>
      </ul>
    </div>
  );
};

// Components for individual settings sections
const UserDetails = ({ userDetails, handleInputChange }) => (
  <div className="settings-section">
    <h3>User Details</h3>
    <form>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={userDetails.username}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
        />
      </label>
    </form>
  </div>
);

const Privacy = ({ isPublic, handleInputChange }) => (
  <div className="settings-section">
    <h3>Privacy</h3>
    <label>
      <input
        type="checkbox"
        name="isPublic"
        checked={isPublic}
        onChange={handleInputChange}
      />
      Make profile public
    </label>
  </div>
);

const LinkedAccounts = ({ linkedAccounts, handleLinkedAccountChange }) => (
  <div className="settings-section">
    <h3>Linked Accounts</h3>
    <label>
      <input
        type="checkbox"
        name="google"
        checked={linkedAccounts.google}
        onChange={handleLinkedAccountChange}
      />
      Link Google Account
    </label>
    <label>
      <input
        type="checkbox"
        name="facebook"
        checked={linkedAccounts.facebook}
        onChange={handleLinkedAccountChange}
      />
      Link Facebook Account
    </label>
  </div>
);

export default Settings;