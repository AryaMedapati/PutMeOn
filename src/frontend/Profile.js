import React, { useState, useEffect } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, ButtonGroup, Card, InputGroup } from "@blueprintjs/core";

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

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchUsers");
      const data = await res.json();
      console.log(data);
      setUsers(data);
      const extractedUsernames = [...new Set(data.map((user) => user.username).filter((username) => username))];
      setUsernames(extractedUsernames);
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
      <InputGroup
        leftIcon="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
        value={searchTerm}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {/* Display filtered users */}
      <div style={{ marginBottom: "20px" }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((username, index) => (
            <Card
              key={index}
              style={{ margin: "10px", padding: "10px", width: "250px" }}
            >
              {username}
            </Card>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
