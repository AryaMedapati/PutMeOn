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

  // Handler to add a new message to the selected chat
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

  // Handler for key press events in the TextArea
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check if Enter is pressed without Shift
      e.preventDefault(); // Prevent default behavior (e.g., adding a newline)
      handleSendMessage(); // Send the message
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