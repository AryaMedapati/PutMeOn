import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { Card, TextArea, Button, InputGroup } from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "./UserContext";
import "./styles/Messages.css";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [chatNames, setChatNames] = useState([]);
  const [chatDict, setChatDict] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newChatUsername, setNewChatUsername] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const { username } = useContext(UserContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:3001/fetchChats?username=${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Chats');
        }
        const result = await response.json();
        setChats(result.Chats);
      } catch (error) {
        console.error('Error fetching Chats:', error);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const fetchChatNames = async (chatIDs, username) => {
      try {
        const response = await fetch('http://localhost:3001/fetchChatNames', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatIDs, username }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chat names');
        }

        const data = await response.json();
        console.log('Chat Names:', data.chatNames);
        setChatNames(data.chatNames);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchChatNames();
  }, [chats]);

  useEffect(() => {
    const dict = chats.reduce((acc, id, index) => {
      acc[id] = chatNames[index];
      return acc;
    }, {});
    setChatDict(dict);
  }, [chats, chatNames]);
  /*
  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("chatID", "==", chatID),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);
  */

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const res = await fetch("http://localhost:3001/fetchFriends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username }),
        });
        const data = await res.json();
        setFriends(data.friends);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendsList();
  }, []);

  const handleNewChat = (recipient) => {
    const newChatID = uuidv4();
    setSelectedChat(newChatID);
    setIsCreatingChat(false);
    setRecipient([recipient]);
    setParticipants([recipient, username]);
    setParticipants(participants.sort());
    setNewChatUsername("");
  };

  const handleSearchUser = (e) => {
    const searchValue = e.target.value;
    setNewChatUsername(searchValue);
    const regex = new RegExp(searchValue, 'i');
    setFilteredUsers(friends.filter(friend => regex.test(friend)));
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    if (!selectedChat) return;

    const res = await fetch("http://localhost:3001/insertChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newMessage,
        createdAt: serverTimestamp(),
        user: username,
        recipient: recipient,
        participants: participants,
        chatID: selectedChat,
      }),
    });

    setNewMessage("");
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
                  key={user}
                  className="user-suggestion"
                  onClick={() => handleNewChat(user)}
                >
                  {user}
                </Card>
              ))}
            </div>
          </div>
        )}

        {Object.entries(chatDict).map(([chatID, chatName]) => (
          <Card
            key={chatID}
            className={`chat-card ${selectedChat && selectedChat.id === chatID ? 'active-chat' : ''}`}
            onClick={() => setSelectedChat({ id: chatID, name: chatName })} // Set both id and name in selectedChat
          >
            {chatName} {/* Display the chat name */}
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