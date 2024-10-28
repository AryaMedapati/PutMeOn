import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  InputGroup,
  Popover,
  Menu,
  MenuItem,
  Icon,
  Dialog,
} from "@blueprintjs/core";
import { FaUserFriends } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
import { UserContext } from "./UserContext";
import { ToastContainer, toast } from "react-toastify";

function FriendsAndNotifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const { email } = useContext(UserContext);
  console.log(email);

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
        body: JSON.stringify({ username: email }),
      });
      const data = await res.json();
      console.log(data);
      setNotifications(data.notifications);
      console.log(notifications);
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
        body: JSON.stringify({ username: email }),
      });
      const data = await res.json();
      setFriendRequests(data.friendRequests);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFriendsList = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchFriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email }),
      });
      const data = await res.json();
      setFriends(data.friends);
    } catch (error) {
      console.error(error);
    }
  };

  const sendFriendRequest = async (recipientUsername) => {
    try {
      const response = await fetch("http://localhost:3001/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: recipientUsername, sender: email }),
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
            recipientUsername: email,
            senderUsername: senderUsername,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchNotifs();
        fetchFriendsList();
        fetchFriendRequests();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const removeFriend = async (senderUsername) => {
    try {
      const response = await fetch("http://localhost:3001/removeFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientUsername: email,
          senderUsername: senderUsername,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchFriendsList();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request.");
    }
  };

  const confirmRemoveFriend = (friendUsername) => {
    setFriendToRemove(friendUsername);
    setIsRemoveDialogOpen(true);
  };

  const closeRemoveDialog = () => {
    setFriendToRemove(null);
    setIsRemoveDialogOpen(false);
  };

  const filteredUsers = usernames.filter((username) =>
    username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
    fetchNotifs();
    fetchFriendRequests();
    fetchFriendsList();
  }, []);

  console.log(notifications);

  return (
    <div>
      <InputGroup
        leftIcon="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        value={searchTerm}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      {filteredUsers.length > 0 ? (
        filteredUsers.map((name, index) => (
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
              {name}
              <Button
                small
                intent="primary"
                onClick={() => sendFriendRequest(name)}
              >
                Add Friend
              </Button>
            </div>
          </Card>
        ))
      ) : (
        <p>No users found.</p>
      )}

      <Popover
        isOpen={showFriends}
        onInteraction={(nextOpenState) => setShowFriends(nextOpenState)}
        content={
          <Menu>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <MenuItem
                  key={index}
                  text={`${friend}`}
                  labelElement={
                    <Button
                      small
                      minimal
                      intent="danger"
                      onClick={() => confirmRemoveFriend(friend)}
                    >
                      Remove
                    </Button>
                  }
                />
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
        onInteraction={(nextOpenState) => setShowFriendRequests(nextOpenState)}
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
        onInteraction={(nextOpenState) => setShowNotifications(nextOpenState)}
        content={
          <Menu>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <MenuItem key={index} text={notif.message} />
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
      <Dialog
        isOpen={isRemoveDialogOpen}
        onClose={closeRemoveDialog}
        title="Remove Friend"
      >
        <div className="bp3-dialog-body">
          Are you sure you want to remove {friendToRemove} as a friend?
        </div>
        <div className="bp3-dialog-footer">
          <Button intent="none" onClick={closeRemoveDialog}>
            Cancel
          </Button>
          <Button
            intent="danger"
            onClick={() => {
              removeFriend(friendToRemove);
              closeRemoveDialog();
            }}
          >
            Remove
          </Button>
        </div>
      </Dialog>

      <ToastContainer autoClose={3000} position="top-right" />
    </div>
  );
}

export default FriendsAndNotifications;
