import React, { useState, useEffect, useContext } from 'react';
import { Card, TextArea, Button, InputGroup } from "@blueprintjs/core";
import { UserContext } from './UserContext';
import "./styles/Messages.css";

const Messages = () => {
  const { username, email } = useContext(UserContext);
  const [dms, setDms] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverID, setReceiverID] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatID, setChatID] = useState("");

  useEffect(() => {
    const fetchInitialDMs = async () => {
      const response = await fetch(`http://localhost:3001/fetchDMs?userID=${username}`);
      const data = await response.json();
      setDms(data);
    };
    fetchInitialDMs();
  }, [username]);

  const handleCreateDM = async () => {
    if (receiverID) {
      const response = await fetch("http://localhost:3001/createDM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ senderID: username, receiverID }),
      });

      if (response.ok) {
        const { chatID } = await response.json();
        setChatID(chatID);
        setReceiverID("");
      } else {
        console.error("Error creating DM");
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatID) {
      const response = await fetch("http://localhost:3001/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderID: username,
          receiverID,
          chatID,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setDms((prev) => [
          ...prev,
          { senderID: username, content: newMessage, chatID },
        ]);
        setNewMessage("");
      } else {
        console.error("Error sending message");
      }
    }
  };

  const handleUserSearch = async (query) => {
    const response = await fetch("http://localhost:3001/fetchUsers");
    const users = await response.json();
    const filtered = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    setReceiverID(e.target.value);
    handleUserSearch(e.target.value);
  };

  return (
    <div className="messages-container">
      <div className="user-search">
        <InputGroup
          placeholder="Type a username..."
          value={receiverID}
          onChange={handleInputChange}
        />
        <Button onClick={handleCreateDM}>Create DM</Button>
        <div className="user-list">
          {filteredUsers.map(user => (
            <div key={user.docId} onClick={() => setReceiverID(user.username)}>
              {user.username}
            </div>
          ))}
        </div>
      </div>
      <div className="dm-list">
        {dms.map(dm => (
          <Card key={dm.chatID} className="dm-card">
            {dm.senderID}: {dm.content}
          </Card>
        ))}
      </div>
      <div className="message-input">
        <TextArea
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default Messages;