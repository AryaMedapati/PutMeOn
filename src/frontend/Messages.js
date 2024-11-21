import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Card, TextArea, Button, InputGroup } from "@blueprintjs/core";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "./UserContext";
import "./styles/Messages.css";
import { Dropdown } from "semantic-ui-react";
import "semantic-ui-css/components/dropdown.min.css";
import "semantic-ui-css/components/icon.min.css";
import "semantic-ui-css/components/input.min.css";
import "semantic-ui-css/components/transition.min.css";
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
  const [chatTheme, setChatTheme] = useState("default");
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  const { username, email } = useContext(UserContext);

  const handleToggleThemeOptions = () => {
    setShowThemeOptions((prev) => !prev);
  };

  const fetchChats = async () => {
    try {
      const res = await fetch("http://localhost:3001/fetchChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email }),
      });
      const data = await res.json();
      setChats(data.chats || []);
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
        body: JSON.stringify({ chatID: chatID, sender: email }),
      });
      const data = await res.json();
      setParticipants(data.participants || []);
      setRecipient(data.recipients || []);
    } catch (error) {
      console.error(error);
    }
  };

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

        const response = await fetch("http://localhost:3001/fetchChatNames", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatIDs: chats, currentUser: email }),
        });

        if (!response.ok) {
          throw new Error(
            "Failed to fetch chat names. Please try again later."
          );
        }

        const data = await response.json();

        if (!Array.isArray(data.chatNames)) {
          throw new Error("Unexpected response format for chat names.");
        }

        setChatNames(data.chatNames);
      } catch (error) {
        console.error("Error fetching chat names:", error);
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
      console.log("at index" + index + "chat names is " + chatNames[index]);
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
          body: JSON.stringify({
            username: email,
          }),
        });
        const data = await res.json();
        // const usernames = data.friends.map((friend) => friend.username);
        setFriends(data.friends);
      } catch (error) {
        console.error(error);
      }
    };

    if (email) {
      fetchFriendsList();
    }
  }, [email]);

  const fetchMessages = async () => {
    if (!selectedChat || !selectedChat.id) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/fetchChatHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatID: selectedChat.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages. Please try again later.");
      }

      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setChatHistory(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    setShowThemeOptions(false);
    getChatTheme(selectedChat.id);
  }, [selectedChat]);

  const getChatTheme = async (chatID) => {
    try {
      const res = await fetch("http://localhost:3001/getChatTheme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatID }),
      });
      const data = await res.json();
      if (data.theme) {
        setChatTheme(data.theme);
      } else {
        setChatTheme("default");
      }
    } catch (error) {
      console.error("Error fetching chat theme:", error);
    }
  };

  const handleNewChat = async (recipient) => {
    if (!recipient) {
      console.error("Recipient is not valid.");
      return;
    }

    const newChatID = uuidv4();
    console.log("recipient is " + recipient);
    const participantArray = [recipient, email].sort();
    console.log("participant array is " + participantArray);

    if (
      Array.isArray(recipient)
        ? setSelectedChat({ id: newChatID, name: recipient.sort() })
        : setSelectedChat({ id: newChatID, name: [recipient] })
    );
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
          participants: participantArray,
          newChatID: newChatID,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update chats. Please try again later.");
      }

      const themeRes = await fetch("http://localhost:3001/setChatTheme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID: newChatID,
          theme: "white", // Default theme
          participants: participantArray,
          newChatID: newChatID,
        }),
      });

      fetchChats();
    } catch (error) {
      console.error("Error updating chats:", error);
    }
  };

  const handleChangeTheme = async (newTheme) => {
    try {
      const res = await fetch("http://localhost:3001/setChatTheme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID: selectedChat.id,
          theme: newTheme,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to change chat theme.");
      }
      setSelectedChat((prev) => ({ ...prev, theme: newTheme }));
    } catch (error) {
      console.error("Error changing theme:", error);
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
  }, [clickedChat]);

  const handleSearchUser = (searchValue) => {
    const trimmedSearchValue = searchValue.trim();
    setNewChatUsername(trimmedSearchValue);

    const regex = new RegExp(trimmedSearchValue, "i");
    const filtered = friends.filter((friend) => regex.test(friend.username));
    setFilteredUsers(
      filtered.map((friend) => ({
        key: friend.username,
        text: friend.username,
        value: friend.username,
        image: { avatar: true, src: friend.pfp },
      }))
    );
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) {
      console.warn("Cannot send an empty message.");
      return;
    }
    if (!selectedChat) {
      console.error("No chat selected to send the message.");
      return;
    }

    const timestamp = new Date().toISOString();
    try {
      const res = await fetch("http://localhost:3001/insertChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newMessage,
          sender: email,
          recipient: recipient,
          participants: participants,
          chatID: selectedChat,
          createdAt: timestamp,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message. Please try again later.");
      }

      setNewMessage("");
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          text: newMessage,
          sender: email,
          recipient: recipient,
          participants: participants,
          chatID: selectedChat,
          createdAt: timestamp,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleNewGroup = async () => {
    if (groupParticipants.length < 2) {
      console.error("Need to pick at least 2 members for a group chat.");
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
          participants: participantArray,
          newChatID: newChatID,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update group chat. Please try again later.");
      }

      fetchChats();
    } catch (error) {
      console.error("Error updating group chat:", error);
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
            <Dropdown
              placeholder="Search users..."
              fluid
              search
              selection
              multiple // Enable multi-selection
              options={filteredUsers}
              onSearchChange={(e, { searchQuery }) =>
                handleSearchUser(searchQuery)
              }
              onChange={(e, { value }) => {
                setGroupParticipants(value); // Update group participants
                const selectedUsers = new Set(value);
                setFilteredUsers((prev) =>
                  prev.filter((user) => !selectedUsers.has(user.value))
                ); // Remove selected users from suggestions
              }}
              value={groupParticipants} // Maintain selected users in dropdown
              style={{ marginBottom: "20px", width: "300px" }}
            />
            <Button onClick={handleNewGroup}>Create Group Chat</Button>
          </div>
        )}

        {isCreatingChat && (
          <div className="new-chat-input">
            <Dropdown
              placeholder="Search users..."
              fluid
              search
              selection
              options={filteredUsers}
              onSearchChange={(e, { searchQuery }) =>
                handleSearchUser(searchQuery)
              }
              onChange={(e, { value }) => handleNewChat(value)}
              style={{ marginBottom: "20px", width: "300px" }}
            />
          </div>
        )}

        {Object.entries(chatDict).length > 0 ? (
          Object.entries(chatDict).map(([chatID, chatName]) => (
            <Card
              key={chatID}
              className={`chat-card ${
                selectedChat && selectedChat.id === chatID ? "active-chat" : ""
              }`}
              onClick={() => {
                setSelectedChat({ id: chatID, name: chatName });
                setClickedChat(true);
              }}
            >
              {Array.isArray(chatName) ? chatName.join(", ") : chatName}
            </Card>
          ))
        ) : (
          <div className="no-chats">No chats available</div>
        )}
      </div>

      <div
        className="chat-content"
        style={{
          background: chatTheme === "default" ? "#f0f0f0" : chatTheme,
        }}
      >
        {selectedChat ? (
          <>
            <div className="theme-selector">
              <Button onClick={handleToggleThemeOptions}>
                Change Chat Theme
              </Button>
              {showThemeOptions && (
                <div className="theme-options">
                  <Button onClick={() => handleChangeTheme("white")}>
                    White
                  </Button>
                  <Button onClick={() => handleChangeTheme("blue")}>
                    Blue
                  </Button>
                  <Button onClick={() => handleChangeTheme("green")}>
                    Green
                  </Button>
                  <Button onClick={() => handleChangeTheme("yellow")}>
                    Yellow
                  </Button>
                  <Button onClick={() => handleChangeTheme("red")}>Red</Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="loading-chat">
                <p>Loading chat...</p>
              </div>
            ) : (
              <div className="message-list">
                {chatHistory.length > 0 ? (
                  chatHistory.map((message) => (
                    <Card key={message.id} className="message-card">
                      <div className="message-content">
                        <img
                          src={message.pfp || "/path/to/default-avatar.png"}
                          className="message-pfp"
                        />
                        <div className="message-text">
                          <strong>{message.sender}:</strong> {message.text}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="no-messages">No messages in this chat</div>
                )}
              </div>
            )}

            <form className="message-input" onSubmit={handleSendMessage}>
              <TextArea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button type="submit" icon="send-message">
                Send
              </Button>
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
