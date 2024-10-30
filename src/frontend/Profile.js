import React, { useState, useEffect, useContext } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import {
  Button,
  ButtonGroup,
  Card,
  InputGroup,
  Popover,
  Menu,
  MenuItem,
  Icon,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "./UserContext";
import "react-toastify/dist/ReactToastify.css";
import { FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";

import "./styles/Profile.css";
import ProfileSidebar from "./ProfileSidebar";
import ProfileContent from "./ProfileContent";
import FriendsAndNotifications from "./ProfileFriend";

function Profile() {
  const [activeContent, setActiveContent] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    profilePic: "https://via.placeholder.com/150",
    bio: "",
    friends: [],
  });
  const { username } = useContext(UserContext);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch("http://localhost:3000/profile");
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="sidebar-container" style={{ display: "flex" }}>
      <ProfileSidebar onChangeContent={setActiveContent} />
      <div
        className="main-content"
        style={{
          marginLeft: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ProfileContent activeContent={activeContent} />
      </div>
      <FriendsAndNotifications />
    </div>
  );
}

export default Profile;
