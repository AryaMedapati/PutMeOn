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
  MenuItem,
  Tag,
  Button,
  TextArea,
  Card,
  Elevation,
  EditableText,
  Popover,
  Position,
} from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/NewPlaylist.css";

const NewPlaylist = () => {
  const [items, setItems] = useState([]);
  const [songs, setSongs] = useState([]);
  const { username } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { playlists, playlistIndex } = location.state || {};

  const [playlistName, setPlaylistName] = useState("Untitled");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const handleSongSelect = (item) => {
    if (!selectedSongs.some((selectedItem) => selectedItem === item)) {
      setSelectedSongs([...selectedSongs, item]);
    }
  };
  const handleSongTagRemove = (index) => {
    setSelectedSongs(selectedSongs.filter((_, i) => i !== index));
  };
  const renderSongs = (item, { handleClick, modifiers }) => {
    return (
      <MenuItem
        key={item}
        text={item}
        onClick={handleClick}
        active={modifiers.active}
        selected={selectedSongs.includes(item)}
      />
    );
  };

  const createNewItemFromQuery = (query) => query;
  const createNewItemRenderer = (query, active, handleClick) => {
    if (!query) return null;
    return (
      <MenuItem
        key={`create-new-${query}`}
        text={`Create "${query}"`}
        active={active}
        onClick={handleClick}
        icon="add"
      />
    );
  };

  const itemPredicate = (query, item) => {
    const normalizedItem = item.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return normalizedItem.includes(normalizedQuery);
  };

  const updatePlaylists = () => {
    if (playlistIndex != -1) {
      return playlists.map((playlist, idx) =>
        idx === playlistIndex
          ? { name: playlistName, songs: selectedSongs }
          : playlist
      );
    } else {
      return [...playlists, { name: playlistName, songs: selectedSongs }];
    }
  };

  const handleSaveChanges = async () => {
    if (username) {
      try {
        const resp = await fetch("http://localhost:3001/updateUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            DocumentId: username,
          },
          body: JSON.stringify({
            playlists: updatePlaylists(),
          }),
        });
        alert("Changes saved");
        navigate("/playlists");
      } catch (error) {
        console.error(error);
        alert(error);
      }
    } else {
      alert("No user logged in.");
    }
  };

  const editPlaylistName = (value) => {
    setPlaylistName(value);
  };

  const renderSongDetails = (index) => {
    if (songs.length > index) {
      const trackName = selectedSongs[index].split(" -- by ")[0]; 
 
      const song = songs.find((s) => s["Track Name"] === trackName);
      return (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={song["Album Image URL"]}
              alt={`${song["Album Name"]} Cover`}
              style={{
                maxWidth: "120px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
            <div style={{ marginTop: "10px" }}>
              <a
                href={song["Track Preview URL"]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007BFF",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Preview
              </a>
            </div>
          </div>
          <div style={{ lineHeight: "1.6", fontSize: "14px" }}>
            <div>
              <strong>Track Name:</strong> {song["Track Name"]}
            </div>
            <div>
              <strong>Album Name:</strong> {song["Album Name"]}
            </div>
            <div>
              <strong>Album Artist Name(s):</strong>{" "}
              {song["Album Artist Name(s)"]}
            </div>
            <div>
              <strong>Artist Name(s):</strong> {song["Artist Name(s)"]}
            </div>
            <div>
              <strong>Album Release Date:</strong> {song["Album Release Date"]}
            </div>
            <div>
              <strong>Track Duration:</strong>{" "}
              {`${(song["Track Duration (ms)"] / 1000).toFixed(2)} seconds`}
            </div>
            <div>
              <strong>Danceability:</strong> {song["Danceability"]}
            </div>
            <div>
              <strong>Energy:</strong> {song["Energy"]}
            </div>
            <div>
              <strong>Acousticness:</strong> {song["Acousticness"]}
            </div>
            <div>
              <strong>Instrumentalness:</strong> {song["Instrumentalness"]}
            </div>
            <div>
              <strong>Speechiness:</strong> {song["Speechiness"]}
            </div>
            <div>
              <strong>Liveness:</strong> {song["Liveness"]}
            </div>
            <div>
              <strong>Loudness:</strong> {song["Loudness"]}
            </div>
            <div>
              <strong>Tempo:</strong> {song["Tempo"]}
            </div>
            <div>
              <strong>Time Signature:</strong> {song["Time Signature"]}
            </div>
            <div>
              <strong>Popularity:</strong> {song["Popularity"]}
            </div>
            <div>
              <strong>Explicit:</strong>{" "}
              {song["Explicit"] === "true" ? "Yes" : "No"}
            </div>
            <div>
              <strong>Label:</strong> {song["Label"]}
            </div>
            <div>
              <strong>Copyrights:</strong> {song["Copyrights"]}
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch("http://localhost:3001/fetchTopSongs");
      const songs = await response.json();
      setSongs(songs);
      setItems(
        songs.map(
          (song) => `${song["Track Name"]} -- by ${song["Artist Name(s)"]}`
        )
      );
    };
    fetchSongs();
  }, [items]);

  useEffect(() => {
    if (playlistIndex != -1) {
      setPlaylistName(playlists[playlistIndex].name);
      setSelectedSongs(playlists[playlistIndex].songs);
    }
  });

  return (
    <div className="edit-playlist-body">
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 className="playlist-title">
          <EditableText
            value={playlistName}
            onChange={editPlaylistName}
            selectAllOnFocus
          />
        </h1>
        <Button
          className="submit-button"
          intent="primary"
          style={{
            width: "160px",
            height: "35px",
            borderRadius: 20,
            marginLeft: "16px",
          }}
          onClick={handleSaveChanges}
          text="Save Changes"
        />
        <Button
          className="cancel-button"
          intent="danger"
          style={{
            width: "160px",
            height: "35px",
            borderRadius: 20,
            marginLeft: "16px",
          }}
          onClick={() => navigate("/playlists")}
          text="Cancel Changes"
        />
      </div>

      <div className="multiselect-wrapper">
        <MultiSelect
          className="top-multiselect"
          items={items}
          itemPredicate={itemPredicate}
          itemRenderer={renderSongs}
          onItemSelect={handleSongSelect}
          tagRenderer={() => null}
          selectedItems={selectedSongs}
          tagInputProps={{
            onRemove: handleSongTagRemove,
            large: true,
            placeholder: "Type to add a song...",
          }}
          // createNewItemFromQuery={createNewItemFromQuery}
          // createNewItemRenderer={createNewItemRenderer}
          openOnKeyDown
          resetOnSelect
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "800px",
          margin: "auto",
        }}
      >
        {selectedSongs.map((song, index) => (
          <Popover
            key={index}
            position={Position.BOTTOM}
            content={
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  maxWidth: "600px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    paddingBottom: "15px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  Song Details
                </h3>
                {renderSongDetails(index)}
                <Button text="Close" minimal={true} />
              </div>
            }
          >
            <Card
              key={index}
              interactive={true}
              elevation={Elevation.TWO}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              // onClick={}
            >
              <span>{song}</span>
              <Button
                className="delete-card-button"
                icon="cross"
                minimal={true}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSongTagRemove(index);
                }}
                style={{ width: "30px" }}
              />
            </Card>
          </Popover>
        ))}
      </div>
    </div>
  );
};

export default NewPlaylist;
