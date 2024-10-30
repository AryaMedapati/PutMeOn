import React, { useState, useEffect } from 'react';
import { Card, TextArea, Button, InputGroup } from "@blueprintjs/core";
import "./styles/Messages.css";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Initial chat loading
  useEffect(() => {
    const initialChats = [
      { id: 1, name: "Alice", messages: [{ text: "Hey Alice!" }, { text: "What's up?" }] },
      { id: 2, name: "Bob", messages: [{ text: "Hello Bob!" }, { text: "Long time no see." }] },
    ];
    setChats(initialChats);
  }, []);

  // Fetching users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/fetchUsers");
      const data = await response.json();
      setUsersList(data); // Store all users
      console.log("a");
      console.log(usersList)
      console.log("b");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleNewChat = (username) => {
    const newChat = { id: chats.length + 1, name: username, messages: [] };
    setChats([...chats, newChat]);
    setSelectedChat(newChat);
    setIsCreatingChat(false);
    setNewChatUsername("");
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, { text: newMessage }],
          };
        }
        return chat;
      });
      setChats(updatedChats);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSearchUser = (e) => {
    const searchValue = e.target.value;
    setNewChatUsername(searchValue);
    const regex = new RegExp(searchValue, 'i');
    setFilteredUsers(usersList.filter(user => regex.test(user.username)));
  };

  return (
    <div className="messages-container">
      <div className="chats-list">
        <Button 
          icon="plus" 
          onClick={() => setIsCreatingChat(!isCreatingChat)}
          className="new-chat-button"
        >
          New Chat
        </Button>

        {isCreatingChat && (
          <div className="new-chat-input">
            <InputGroup
              placeholder="Type a username..."
              value={newChatUsername}
              onChange={handleSearchUser}
            />
            <div className="user-suggestions">
              {filteredUsers.map(user => (
                <Card 
                  key={user.docId} 
                  className="user-suggestion"
                  onClick={() => handleNewChat(user.username)}
                >
                  {user.username}
                </Card>
              ))}
            </div>
          </div>
        )}

        {chats.map(chat => (
          <Card 
            key={chat.id} 
            className={`chat-card ${selectedChat && selectedChat.id === chat.id ? 'active-chat' : ''}`}
            onClick={() => setSelectedChat(chat)}
          >
            {chat.name}
          </Card>
        ))}
      </div>
      
      <div className="chat-content">
        {selectedChat ? (
          <>
            <div className="message-list">
              {selectedChat.messages.map((message, index) => (
                <Card key={index} className="message-card">
                  {message.text}
                </Card>
              ))}
            </div>

            <div className="message-input">
              <TextArea
                className="message-textarea"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                growVertically={true} 
                fill={true}
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
};

export default Messages;