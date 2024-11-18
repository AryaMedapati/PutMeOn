import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { MenuItem, Tag, Button, TextArea, Card, Elevation, EditableText } from '@blueprintjs/core';
import { MultiSelect } from "@blueprintjs/select";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/NewPlaylist.css";

const NewPlaylist = () => {

    // const items = [
    //     "test123",
    //     "te1234",
    //     "temp1234",
    //     "testtest",
    //     "testesttest",
    //     "nottest",
    //     "Test",
    //     "song1",
    //     "song2",
    //     "so3",
    //     "songsong",
    //     "testsong",
    //     "songtest",
    //     "song123",
    // ];

    const [items, setItems] = useState([]);

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
                const resp = await fetch('http://localhost:3001/updateUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'DocumentId': username,
                    },
                    body: JSON.stringify({
                        playlists: updatePlaylists()
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

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch("http://localhost:3001/fetchTopSongs");
            const songs = await response.json();
            const trackNames = Object.values(songs).map(song => song.trackName);
            setItems(trackNames)
            debugger
        };
        fetchSongs();
    }, [items]);

    useEffect(() => {
        if (playlistIndex != -1) {
            setPlaylistName(playlists[playlistIndex].name)
            setSelectedSongs(playlists[playlistIndex].songs)
        }
    }, [playlists, playlistIndex]);

    return (
        <div
            className="edit-playlist-body"
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <h1
                    className="playlist-title"
                >
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
                        width: '160px',
                        height: '35px',
                        borderRadius: 20,
                        marginLeft: '16px'
                    }}
                    onClick={handleSaveChanges}
                    text="Save Changes"
                />
                <Button
                    className="cancel-button"
                    intent="danger"
                    style={{
                        width: '160px',
                        height: '35px',
                        borderRadius: 20,
                        marginLeft: '16px'
                    }}
                    onClick={() => navigate("/playlists")}
                    text="Cancel Changes"
                />
            </div>

            <div
                className="multiselect-wrapper"
            >
                <MultiSelect
                    className='top-multiselect'
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
                    createNewItemFromQuery={createNewItemFromQuery}
                    createNewItemRenderer={createNewItemRenderer}
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
                    >
                        <span>{song}</span>
                        <Button
                            className="delete-card-button"
                            icon="cross"
                            minimal={true}
                            onClick={() => handleSongTagRemove(index)}
                            style={{ width: "30px" }}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default NewPlaylist;