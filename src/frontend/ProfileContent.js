import React from "react";
import ProfileUsername from "./ProfileUsername";
import ViewProfile from "./ViewProfile";
import EditProfile from "./EditProfile";
import ProfilePrivacy from "./ProfilePrivacy";
import FriendsAndNotifications from "./ProfileFriend";

const ProfileContent = ({ activeContent }) => {
  switch (activeContent) {
    case "view":
      return (
        <div>
          <ViewProfile />
        </div>
      );
    case "edit":
      return (
        <div>
          <EditProfile />
        </div>
      );
    case "username":
      return (
        <div>
          <ProfileUsername />
        </div>
      );
    case "privacy":
      return (
        <div>
          <ProfilePrivacy />
        </div>
      );
    case "friends":
      return (
        <div>
          <FriendsAndNotifications />
        </div>
      );
    default:
      return (
        <div>
          <ViewProfile />
        </div>
      );
  }
};

export default ProfileContent;
