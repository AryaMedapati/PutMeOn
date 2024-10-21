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

function Profile() {
  const [activeContent, setActiveContent] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    profilePic: "https://via.placeholder.com/150",
    bio: "",
    friends: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const { username } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchUsers");
      const data = await res.json();
      console.log(data);
      setUsers(data);
      const extractedUsernames = [
        ...new Set(
          data.map((user) => user.username).filter((username) => username)
        ),
      ];
      setUsernames(extractedUsernames);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotifs = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchNotifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await res.json();
      console.log(data);
      setNotifications(data.notifications);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchFriendRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await res.json();
      console.log(data);
      setFriendRequests(data.friendRequests);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchFriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await res.json();
      console.log(data);
      setFriends(data.friends);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = usernames.filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    fetchUsers();
    fetchNotifs();
    fetchFriendRequests();
    fetchFriends();
  }, []);

  const sendFriendRequest = async (recipientUsername) => {
    try {
      const response = await fetch("http://localhost:3001/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: recipientUsername, sender: username }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const acceptFriendRequest = async (senderUsername) => {
    try {
      const response = await fetch(
        "http://localhost:3001/acceptFriendRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientUsername: username,
            senderUsername: senderUsername,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchNotifs();
        fetchFriendRequests();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

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
      <div style={{ marginBottom: "20px" }}>
        <InputGroup
          leftIcon="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          value={searchTerm}
          style={{ marginBottom: "20px", width: "300px" }}
        />
        {filteredUsers.length > 0 ? (
          filteredUsers.map((username, index) => (
            <Card
              key={index}
              style={{ margin: "10px", padding: "10px", width: "250px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {username}
                <Button
                  small
                  intent="primary"
                  onClick={() => sendFriendRequest(username)}
                >
                  Add Friend
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <Popover
          isOpen={showFriends}
          onInteraction={(nextOpenState) => setShowFriends(nextOpenState)}
          content={
            <Menu>
              {friends.length > 0 ? (
                friends.map((user, index) => (
                  <MenuItem key={index} text={`${user}`}></MenuItem>
                ))
              ) : (
                <MenuItem text="No friends" />
              )}
            </Menu>
          }
        >
          <div className="icon-container">
            <FaUserFriends className="icon" />
          </div>
        </Popover>
        <Popover
          isOpen={showFriendRequests}
          onInteraction={(nextOpenState) =>
            setShowFriendRequests(nextOpenState)
          }
          content={
            <Menu>
              {friendRequests.length > 0 ? (
                friendRequests.map((sender, index) => (
                  <MenuItem key={index} text={`Friend request from ${sender}`}>
                    <Button
                      small
                      intent="success"
                      onClick={() => acceptFriendRequest(sender)}
                    >
                      Accept
                    </Button>
                  </MenuItem>
                ))
              ) : (
                <MenuItem text="No friend requests" />
              )}
            </Menu>
          }
        >
          <div className="icon-container">
            <MdPersonAddAlt1 className="icon" />
          </div>
        </Popover>
        <Popover
          isOpen={showNotifications}
          onInteraction={(nextOpenState) => {
            setShowNotifications(nextOpenState);
          }}
          content={
            <Menu>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index} text={notification.message} />
                ))
              ) : (
                <MenuItem text="No notifications" />
              )}
            </Menu>
          }
        >
          <div className="icon-container">
            <IoMdNotifications className="icon" />
          </div>
        </Popover>
      </div>

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default Profile;
