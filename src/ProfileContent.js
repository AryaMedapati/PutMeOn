import React from 'react';
import ProfileUsername from './ProfileUsername';
import ViewProfile from './ViewProfile';
import EditProfile from './EditProfile';

const ProfileContent = ({ activeContent }) => {
  switch (activeContent) {
    case 'view':
      return <div><ViewProfile/></div>;
    case 'edit':
        return <div><EditProfile/></div>;
    case 'username':
      return <div><ProfileUsername/></div>;
    case 'privacy':
      return <div>Here are your Privacy settings.</div>;
    default:
        return <div><ViewProfile/></div>;
    }
};

export default ProfileContent;
