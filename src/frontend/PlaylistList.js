import React, { useState, useEffect, useContext } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  documentId,
} from "firebase/firestore";
import { UserContext } from "./UserContext";
import {
  Button,
  Card,
  CardList,
  Section,
  SectionCard,
  Icon,
  Popover,
  PopoverInteractionKind,
  Menu,
  MenuItem,
  Position,
} from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import "./styles/Playlists.css";
import localstorage from "localstorage-slim";

const PlaylistList = () => {
  const navigate = useNavigate();
  // const { username } = useContext(UserContext);
  const username = localstorage.get("docId");

  const [playlists, setPlaylists] = useState([]);
  const [friendsList, setFriendsList] = useState([]);

  const handleCreatePlaylist = (index) => {
    const additionalInfo = { playlists: playlists, playlistIndex: index };
    navigate("new-playlist", { state: additionalInfo });
  };

  const handleDeletePlaylist = async (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (isConfirmed) {
      const updatedPlaylists = playlists.filter((_, i) => i !== index);

      setPlaylists(updatedPlaylists);
      try {
        const resp = await fetch("http://localhost:3001/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            DocumentId: username,
          },
          body: JSON.stringify({
            playlists: updatedPlaylists,
          }),
        });
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  };

  const handleSharePlaylist = async (friend, playlist) => {
    const response = await fetch("http://localhost:3001/fetchUserByUsername", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        username: friend,
      },
    });
    const data = await response.json();
    const friendPlaylists = data.sharedPlaylists
    const resp = await fetch("http://localhost:3001/updateUserbyUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: friend,
      },
      body: JSON.stringify({
        sharedPlaylists: [...friendPlaylists, playlist],
      }),
    });
    alert("Playlist shared");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        const response = await fetch("http://localhost:3001/fetchCurrentUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            DocumentId: username,
          },
        });
        const data = await response.json();
        setPlaylists(data.playlists);
        setFriendsList(data.friends_list);
      }
    };
    fetchProfileData();
  }, [username]);

  return (
    <div
      className="playlists-container"
      style={{
        border: "3px solid #03bd00",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#03bd00",
          width: "100%",
          padding: "0 10px",
          height: "50px",
        }}
      >
        <h2 className="playlists-title" style={{ color: "white" }}>
          My Playlists
        </h2>
        <Button
          className="create-playlist-button"
          intent="primary"
          icon={<Icon icon="add" />}
          style={{
            width: "130px",
            height: "35px",
            borderRadius: 20,
          }}
          onClick={() => handleCreatePlaylist(-1)}
          text="New Playlist"
        />
      </div>
      <div
        className="playlists-list"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "0 10px",
          paddingTop: "10px",
        }}
      >
        {playlists.map((playlist, index) => (
          <div
            className="playlist-item"
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span className="playlist-name">{playlist.name}</span>
            <div className="playlist-actions">
              <Popover
                interactionKind="click"
                content={
                  <Menu>
                    {friendsList.map((friend, index) => (
                      <MenuItem
                        key={index}
                        className="share-friend"
                        text={friend}
                        onClick={() => handleSharePlaylist(friend, playlist)}
                      />
                    ))}
                  </Menu>
                }
                position="bottom-left"
              >
                <Button
                  className="share-button"
                  icon={<Icon icon="share" />}
                  minimal
                />
              </Popover>
              <Button
                className="edit-button"
                icon={<Icon icon="edit" />}
                minimal
                onClick={() => handleCreatePlaylist(index)}
              />
              <Button
                className="delete-button"
                icon={<Icon icon="trash" />}
                minimal
                onClick={() => handleDeletePlaylist(index)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistList;
