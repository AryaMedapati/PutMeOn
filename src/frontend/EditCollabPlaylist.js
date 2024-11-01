import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
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
    Elevation,
    EditableText
} from '@blueprintjs/core';
import { MultiSelect } from "@blueprintjs/select";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/NewPlaylist.css";

const EditCollabPlaylist = () => {

    const items = [
        "test123",
        "te1234",
        "temp1234",
        "testtest",
        "testesttest",
        "nottest",
        "Test",
        "song1",
        "song2",
        "so3",
        "songsong",
        "testsong",
        "songtest",
        "song123",
    ];

    const { username } = useContext(UserContext);
    const [currentUser, setCurrentUser] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { playlists, playlistIndex } = location.state || {};
    const [collabPlaylist, setCollabPlaylist] = useState([])

    const [friendsList, setFriendsList] = useState([])
    const [collaborators, setCollaborators] = useState([]);
    const [playListID, setPlayListID] = useState("")

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
        const normalizedFruit = item.toLowerCase();
        const normalizedQuery = query.toLowerCase();
        return normalizedFruit.includes(normalizedQuery);
    };

    const updatePlaylists = (collabPlaylists, currentPlayListID) => {
        const playlistExists = collabPlaylists.some(
            (playlist) => playlist.id === currentPlayListID
        );

        if (!playlistExists) {
            return [...collabPlaylists, { name: playlistName, id: currentPlayListID }];
        }
        return collabPlaylists;
    };

    const handleSaveChanges = async () => {
        let currentPlayListID = "";
        if (playlistIndex == -1) {
            try {
                const resp = await fetch('http://localhost:3001/insertCollabPlaylist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: playlistName,
                        collaborators: collaborators,
                        songs: selectedSongs,
                    }),
                });
                const data = await resp.json();
                currentPlayListID = data.documentId
                setPlayListID(data.documentId)
            } catch (error) {
                console.error(error);
                alert(error);
            }
        } else {
            const resp = await fetch('http://localhost:3001/updateCollabPlaylist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'DocumentId': playListID,
                },
                body: JSON.stringify({
                    name: playlistName,
                    collaborators: collaborators,
                    songs: selectedSongs,
                }),
            });
            currentPlayListID = playListID
        }

        try {
            await Promise.all(
                collaborators.map(async (collaborator) => {
                    const response1 = await fetch("http://localhost:3001/fetchUserByUsername", {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'username': collaborator,
                        },
                    });
                    const data = await response1.json();
                    setCollabPlaylist(data.collabPlaylists)

                    const response2 = await fetch('http://localhost:3001/updateUserbyUsername', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'username': collaborator,
                        },
                        body: JSON.stringify({
                            collabPlaylists: updatePlaylists(data.collabPlaylists, currentPlayListID),
                        }),
                    });
                })
            );
        } catch (error) {
            console.error("Error processing array:", error);
        }
        alert("playlist saved");
        navigate("/playlists");
    };

    const editPlaylistName = (value) => {
        setPlaylistName(value);
    };

    const handleAddCollaborators = async (friend) => {
        setCollaborators([...collaborators, friend])
    };

    const removeCollaborator = (collaborator) => {
        setCollaborators(collaborators.filter((c) => c !== collaborator));
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            if (username) {
                const response = await fetch("http://localhost:3001/fetchCurrentUser", {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'DocumentId': username,
                    },
                });
                const data = await response.json();
                setFriendsList(data.friends_list)
                setCurrentUser(data.username)
            }
        };
        fetchProfileData();
    }, [username]);

    useEffect(() => {
        if (playlistIndex != -1) {
            setPlayListID(playlists[playlistIndex].id)
            const fetchPlaylistData = async () => {
                if (username) {
                    const response = await fetch("http://localhost:3001/fetchCollabPlaylist", {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'DocumentId': playlists[playlistIndex].id,
                        },
                    });
                    const data = await response.json();
                    setSelectedSongs(data.songs)
                    setCollaborators(data.collaborators)
                    setPlaylistName(data.name)
                }
            };
            fetchPlaylistData();
        }
        if (!collaborators.includes(currentUser) && currentUser != "") {
            setCollaborators([...collaborators, currentUser]);
        }
    }, [playlists, currentUser]);

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
                <Popover
                    interactionKind={PopoverInteractionKind.CLICK}
                    content={
                        <Menu>
                            {friendsList.map((friend, index) => (
                                <MenuItem
                                    text={friend}
                                    onClick={() => handleAddCollaborators(friend)}
                                />
                            ))}
                        </Menu>
                    }
                    position={Position.BOTTOM_LEFT}
                >
                    <Button
                        className="add-button"
                        intent="primary"
                        style={{
                            width: '160px',
                            height: '35px',
                            borderRadius: 20,
                            marginLeft: '16px'
                        }}
                        icon="share"
                        text="Add Collaborators"
                    />
                </Popover>
                <Popover
                    interactionKind={PopoverInteractionKind.CLICK}
                    content={
                        <Menu>
                            {collaborators.map((collaborator, index) => (
                                <MenuItem
                                    key={index}
                                    text={collaborator}
                                    labelElement={
                                        <Button
                                            minimal
                                            icon="cross"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeCollaborator(collaborator);
                                            }}
                                        />
                                    }
                                />
                            ))}
                        </Menu>
                    }
                    position={Position.BOTTOM_LEFT}
                >
                    <Button
                        className="view-button"
                        intent="primary"
                        style={{
                            width: '160px',
                            height: '35px',
                            borderRadius: 20,
                            marginLeft: '16px'
                        }}
                        text="View Collaborators"
                    />
                </Popover>
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

export default EditCollabPlaylist;