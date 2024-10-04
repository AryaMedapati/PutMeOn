import React from 'react';
import ProfileUsername from './ProfileUsername';
import ProfileMain from './ProfileMain';

const ProfileContent = ({ activeContent }) => {
  switch (activeContent) {
    case 'profile':
      return <div><ProfileMain/></div>;
    case 'username':
      return <div><ProfileUsername/></div>;
    case 'privacy':
      return <div>Here are your Privacy settings.</div>;
    default:
      return <div>Select an option from the sidebar.</div>;
  }
};

export default ProfileContent;
