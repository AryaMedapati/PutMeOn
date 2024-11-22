import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Button } from "@blueprintjs/core";
import { FaUserFriends } from "react-icons/fa";
import localstorage from "localstorage-slim";
import { toast } from "react-toastify";
import "./styles/FriendProfileView.css";

function FriendProfileView() {
  const { email: loggedInUsername } = useContext(UserContext);
  const { username: routeUsername } = useParams();
  const [isFriends, setIsFriends] = useState(null);
  const [friends, setFriends] = useState([]);
  const [userData, setUserData] = useState({});
  const [activeContent, setActiveContent] = useState("overview");

  const navigate = useNavigate();

  // Fetch friends list
  useEffect(() => {
    if (routeUsername === loggedInUsername) {
      navigate("/profile");
    } else {
      const fetchFriendsList = async () => {
        try {
          const res = await fetch("http://localhost:3001/fetchFriends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: loggedInUsername || localstorage.get("user"),
            }),
          });
          const data = await res.json();
          const usernames = data.friends.map((friend) => friend.username);
          setFriends(usernames);
        } catch (error) {
          console.error(error);
        }
      };
      fetchFriendsList();
    }
  }, [loggedInUsername, routeUsername, navigate]);

  useEffect(() => {
    if (friends.length > 0) {
      setIsFriends(friends.includes(routeUsername));
    }
  }, [friends, routeUsername]);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(`http://localhost:3001/profile?username=${routeUsername}`);
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [loggedInUsername, routeUsername, navigate]);

  // Send friend request function
  const sendFriendRequest = async (recipientUsername) => {
    try {
      const response = await fetch("http://localhost:3001/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: recipientUsername,
          sender: loggedInUsername || localstorage.get("user"),
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
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  // Remove friend function
  const removeFriend = async (senderUsername) => {
    try {
      const response = await fetch("http://localhost:3001/removeFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientUsername: routeUsername,
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
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.");
    }
  };

  const fetchFriendsList = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchFriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loggedInUsername || localstorage.get("user"),
        }),
      });
      const data = await res.json();
      const usernames = data.friends.map((friend) => friend.username);
      setFriends(usernames);
    } catch (error) {
      console.error("Error fetching friends list:", error);
    }
  };

  if (isFriends === null) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  const renderProfileDetails = () => {
    return (
      <div className="profile-details">
        <div className="profile-header">
          <img src={userData.pfp} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <h2 className="profile-username">{userData.username}</h2>
            <p className="profile-bio">{userData.bio}</p>
          </div>
        </div>

        {userData.isPrivate ? (
          <div className="privacy-settings">
            {userData.privacySettings.topSongs && userData.topSongs && (
              <div className="top-songs">
                <h3>Top Songs</h3>
                <ul>
                  {userData.topSongs.map((song, index) => (
                    <li key={index}>{song}</li>
                  ))}
                </ul>
              </div>
            )}

            {userData.privacySettings.topGenres && userData.topGenres && (
              <div className="top-genres">
                <h3>Top Genres</h3>
                <ul>
                  {userData.topGenres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              </div>
            )}

            {userData.privacySettings.topArtists && userData.topArtists && (
              <div className="top-artists">
                <h3>Top Artists</h3>
                <ul>
                  {userData.topArtists.map((artist, index) => (
                    <li key={index}>{artist}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="privacy-settings">
            {userData.topSongs && (
              <div className="top-songs">
                <h3>Top Songs</h3>
                <ul>
                  {userData.topSongs.map((song, index) => (
                    <li key={index}>{song}</li>
                  ))}
                </ul>
              </div>
            )}

            {userData.topGenres && (
              <div className="top-genres">
                <h3>Top Genres</h3>
                <ul>
                  {userData.topGenres.map((genre, index) => (
                    <li key={index}>{genre}</li>
                  ))}
                </ul>
              </div>
            )}

            {userData.topArtists && (
              <div className="top-artists">
                <h3>Top Artists</h3>
                <ul>
                  {userData.topArtists.map((artist, index) => (
                    <li key={index}>{artist}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="friend-action">
          {isFriends ? (
            <Button
              icon={<FaUserFriends />}
              intent="danger"
              onClick={() => removeFriend(loggedInUsername || localstorage.get("user"))}
            >
              Unfriend
            </Button>
          ) : (
            <Button
              icon={<FaUserFriends />}
              intent="success"
              onClick={() => sendFriendRequest(routeUsername)}
            >
              Add Friend
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="friend-profile-view">
      {renderProfileDetails()}
    </div>
  );
}

export default FriendProfileView;
