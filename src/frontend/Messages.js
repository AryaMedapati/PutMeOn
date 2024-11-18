import React, { useState, useEffect, useContext } from 'react';
import { collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { Card, TextArea, Button, InputGroup } from "@blueprintjs/core";
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from "./UserContext";
import "./styles/Messages.css";
import localstorage from "localstorage-slim";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [chatNames, setChatNames] = useState([]);
  const [chatDict, setChatDict] = useState({});
  const [chatHistory, setChatHistory] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedChat, setSelectedChat] = useState({ id: "", name: [] });
  const [clickedChat, setClickedChat] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newChatUsername, setNewChatUsername] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const { username, email } = useContext(UserContext);

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email || localstorage.get("user")}),
      });
      const data = await res.json();
      setChats(data.chats || []); // Ensure chats is always an array
    } catch (error) {
      console.error(error);
    }
  };

  const getChatInfo = async (chatID) => {
    console.log("getting chat info");
    try {
      const res = await fetch("http://localhost:3001/fetchChatInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatID:chatID , sender: email || localstorage.get("user") }),
      });
      const data = await res.json();
      setParticipants(data.participants || []);      
      setRecipient(data.recipients || [])
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (email) {
      setUsername(email);
    } else {
      const storedUsername = localstorage.get("user");
      console.log(storedUsername);
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchChats();
    }
  }, [email]);

  useEffect(() => {
    const fetchChatNames = async () => {
      try {
        if (!chats || chats.length === 0 || !email) return;
        // console.log("(fetch chat names) chats are = " + chats);

        const response = await fetch('http://localhost:3001/fetchChatNames', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatIDs: chats, currentUser: email }), // Ensure chats is passed correctly
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chat names. Please try again later.');
        }

        const data = await response.json();

        if (!Array.isArray(data.chatNames)) {
          throw new Error('Unexpected response format for chat names.');
        }

        setChatNames(data.chatNames); // Ensure chatNames is set from response
      } catch (error) {
        console.error('Error fetching chat names:', error);
      }
    };

    fetchChatNames();
  }, [chats, email]);

  useEffect(() => {
    if (!chats || chats.length == 0 || !chatNames || chatNames.length == 0) {
      setChatDict({});
      // console.log("chats = " + chats);
      // console.log("chat names = " + chatNames);
      // console.log("chat dict early return case = " + chatDict);
      return;
    }

    console.log("chats is " + chats);
    console.log("chat names is " + chatNames);

    const dict = chats.reduce((acc, id, index) => {
      console.log ("at index" + index + "chat names is " + chatNames[index]);
      acc[id] = chatNames[index];
      return acc;
    }, {});

    setChatDict(dict);
    Object.entries(dict).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }, [chats, chatNames]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const res = await fetch("http://localhost:3001/fetchFriends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: email || localstorage.get("user")}),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch friends list. Please try again later.');
        }

        const data = await res.json();
        if (!Array.isArray(data.friends)) {
          throw new Error('Unexpected response format for friends list.');
        }
        setFriends(data.friends);
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    if (email) {
      fetchFriendsList();
    }
  }, [email]);

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat.id) return;

    try {
      const response = await fetch('http://localhost:3001/fetchChatHistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatID: selectedChat.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages. Please try again later.');
      }

      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setChatHistory(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const handleNewChat = async (recipient) => {
    if (!recipient) {
      console.error('Recipient is not valid.');
      return;
    }

    const newChatID = uuidv4();
    console.log("recipient is " + recipient);
    const participantArray = [recipient, email].sort();
    console.log("participant array is " + participantArray);

    if (Array.isArray(recipient) ? setSelectedChat({ id: newChatID, name: recipient.sort() }) : setSelectedChat({ id: newChatID, name: [recipient] }));
    // setSelectedChat({ id: newChatID, name: [recipient].sort() });
    setIsCreatingChat(false);
    setRecipient(recipient);
    setParticipants(participantArray);
    setNewChatUsername("");

    try {
      const res = await fetch("http://localhost:3001/updateUserChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: participantArray, // Use email to identify the user
          newChatID: newChatID, // The new chat ID to append
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update chats. Please try again later.');
      }

      fetchChats();

    } catch (error) {
      console.error('Error updating chats:', error);
    }
  };

  useEffect(() => {
    if (selectedChat && clickedChat) {
      // console.log("Selected chat updated:", selectedChat);

      // Call functions to get participants and recipients for the selected chat
      // console.log("selected chat id = = = = " + selectedChat.id);
      getChatInfo(selectedChat.id);
      // getRecipientsForChat(selectedChat.id);

      setClickedChat(false);
    }
  }, [clickedChat]); // Dependency array with selectedChat


  const handleSearchUser = (e) => {
    const searchValue = e.target.value.trim();
    setNewChatUsername(searchValue);
    const regex = new RegExp(searchValue, 'i');
    setFilteredUsers(friends.filter(friend => regex.test(friend)));
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) {
      console.warn('Cannot send an empty message.');
      return;
    }
    if (!selectedChat) {
      console.error('No chat selected to send the message.');
      return;
    }

    const timestamp = new Date().toISOString()
    try {
      const res = await fetch("http://localhost:3001/insertChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage,
          sender: email || localstorage.get("user"),
          recipient: recipient,
          participants: participants,
          chatID: selectedChat,
          createdAt: timestamp,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message. Please try again later.');
      }

      setNewMessage("");
      setChatHistory((prevHistory) => [...prevHistory, 
        {text: newMessage,
        sender: email || localstorage.get("user"),
        recipient: recipient,
        participants: participants,
        chatID: selectedChat,
        createdAt: timestamp,
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleNewGroup = async () => {
    if (groupParticipants.length < 2) {
      console.error('Need to pick at least 2 members for a group chat.');
      return;
    }

    const newChatID = uuidv4();
    const participantArray = [...groupParticipants, email].sort();

    console.log("participant array = " + participantArray);
    console.log("group participants = " + groupParticipants);

    setSelectedChat({ id: newChatID, name: groupParticipants.sort() });
    console.log("selected chat post update = " + selectedChat.name);
    setIsCreatingGroup(false);
    setRecipient(groupParticipants);
    setParticipants(participantArray);

    try {
      const res = await fetch("http://localhost:3001/updateUserChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: participantArray, // Use email to identify the user
          newChatID: newChatID, // The new chat ID to append
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update group chat. Please try again later.');
      }

      fetchChats();

    } catch (error) {
      console.error('Error updating group chat:', error);
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

        <Button
          icon="group"
          onClick={() => setIsCreatingGroup(!isCreatingGroup)}
          className="new-group-chat-button"
        >
          New Group Chat
        </Button>

        {isCreatingGroup && (
          <div className="new-group-chat-input">
            <InputGroup
              placeholder="Type a username..."
              value={newChatUsername}
              onChange={handleSearchUser}
            />
            <div className="user-suggestions">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <Card
                    key={user}
                    className="user-suggestion"
                    onClick={() => {
                      setGroupParticipants(prev => [...prev, user]);
                      setFilteredUsers(prev => prev.filter(u => u !== user)); // Remove selected user from suggestions
                    }}
                  >
                    {user}
                  </Card>
                ))
              ) : (
                <div className="no-suggestions">No users found</div>
              )}
            </div>
            <Button onClick={handleNewGroup}>Create Group Chat</Button>
          </div>
        )}

        {isCreatingChat && (
          <div className="new-chat-input">
            <InputGroup
              placeholder="Type a username..."
              value={newChatUsername}
              onChange={handleSearchUser}
            />
            <div className="user-suggestions">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <Card
                    key={user}
                    className="user-suggestion"
                    onClick={() => handleNewChat(user)}
                  >
                    {user}
                  </Card>
                ))
              ) : (
                <div className="no-suggestions">No users found</div>
              )}
            </div>
          </div>
        )}

        {Object.entries(chatDict).length > 0 ? (
          Object.entries(chatDict).map(([chatID, chatName]) => (
            <Card
              key={chatID}
              className={`chat-card ${selectedChat && selectedChat.id === chatID ? 'active-chat' : ''}`}
              onClick={() => {
                setSelectedChat({ id: chatID, name: chatName });
                setClickedChat(true);
              }}
            >
              {Array.isArray(chatName) ? chatName.join(', ') : chatName}
            </Card>
          ))
        ) : (
          <div className="no-chats">No chats available</div>
        )}
      </div>

      <div className="chat-content">
        {selectedChat ? (
          <>
            <div className="message-list">
              {chatHistory.length > 0 ? (
                chatHistory.map((message) => (
                  <Card key={message.id} className="message-card">
                    {`${message.sender}: ${message.text}`}
                  </Card>
                ))
              ) : (
                <div className="no-messages">No messages in this chat</div>
              )}
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <TextArea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="submit" icon="send-message">Send</Button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
};

export default Messages;