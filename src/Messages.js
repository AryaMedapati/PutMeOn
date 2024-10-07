import React from 'react';

import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, ButtonGroup, Card } from "@blueprintjs/core";
import { useState, useEffect } from "react";

import "./Profile.css"
import ProfileSidebar from './ProfileSidebar';
import ProfileContent from './ProfileContent';

const Messages = () => {
  const [activeContent, setActiveContent] = useState('');

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
};

export default Messages;
