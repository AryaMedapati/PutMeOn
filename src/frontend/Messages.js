import React, { useState, useEffect } from 'react';
import { Card, TextArea } from "@blueprintjs/core";
import "./styles/Messages.css";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Mock useEffect to load existing chats and messages
  useEffect(() => {
    const initialChats = [
      { id: 1, name: "Alice", messages: [{ text: "Hey Alice!" }, { text: "What's up?" }] },
      { id: 2, name: "Bob", messages: [{ text: "Hello Bob!" }, { text: "Long time no see." }] },
    ];
    setChats(initialChats);
  }, []);

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

  return (
    <div className="messages-container">
      <div className="chats-list">
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
                onKeyPress={handleKeyPress} // Add key press handler
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