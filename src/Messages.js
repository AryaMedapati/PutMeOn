import React from 'react';

import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, Card } from "@blueprintjs/core";

import "./Profile.css"

const Messages = () => {
  return (
    <body>
      <div class="container">
          <div class="sidebar">
              <Button 
                style={{ width: '100%', padding: 0, margin: 0 }}
                text="Your Profile" />
              <ul>
                  <li><a href="#">Your Profile</a></li>
                  <li><a href="#">Privace and security</a></li>
                  <li><a href="#">Additional Settings</a></li>
                  <li><a href="#">TEMP</a></li>
                  <li><a href="#">TEMP</a></li>
              </ul>
          </div>
          <div class="main-content">
              <h1>Main Content Area</h1>
              <p>This is where your main content goes.</p>
          </div>
      </div>
  </body>
  );
};

export default Messages;
