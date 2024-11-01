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
    Position
} from '@blueprintjs/core';
import { useNavigate } from "react-router-dom";

const CollabPlaylist = () => {
    const navigate = useNavigate();
    const { username } = useContext(UserContext);

    const [friendPlaylists, setFriendPlaylists] = useState([])
    const [collabPlaylists, setCollabPlaylists] = useState([]);
    const [friendsList, setFriendsList] = useState([])

    const handleCreatePlaylist = (index) => {
        const additionalInfo = { playlists: collabPlaylists, playlistIndex: index };
        navigate("edit-collab-playlist", { state: additionalInfo });
    };

    const handleSharePlaylist = async (friend, playlist) => {
        const response = await fetch("http://localhost:3001/fetchUserByUsername", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'username': friend,
            },
        });
        const data = await response.json();
        setFriendPlaylists(data.sharedPlaylists)

        const resp = await fetch('http://localhost:3001/updateUserbyUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': friend,
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
                        'Content-Type': 'application/json',
                        'DocumentId': username,
                    },
                });
                const data = await response.json()
                setCollabPlaylists(data.collabPlaylists)
                setFriendsList(data.friends_list)
            }
        };
        fetchProfileData();
    }, [username]);

    return (
        <div>
            <div>
                <Button
                    className='create-playlist-button'
                    intent='primary'
                    style={{
                        width: '160px',
                        height: '35px',
                        borderRadius: 20
                    }}
                    onClick={() => handleCreatePlaylist(-1)}
                    text="New Playlist" />
            </div>
            <Section title="Collab Playlists">
                <SectionCard padded={false}>
                    <CardList bordered={false}>
                        {collabPlaylists.map((playlist, index) => (
                            <Card
                                key={index}
                            >
                                <span>{playlist.name}</span>

                                <Popover
                                    interactionKind={PopoverInteractionKind.CLICK}
                                    content={
                                        <Menu>
                                            {friendsList.map((friend, index) => (
                                                <MenuItem 
                                                    text={friend} 
                                                    onClick={() => handleSharePlaylist(friend, playlist)}
                                                />
                                            ))}
                                        </Menu>
                                    }
                                    position={Position.BOTTOM_LEFT}
                                >

                                    <Button
                                        icon={<Icon icon="share" />}
                                        minimal
                                    />
                                </Popover>

                                <Button
                                    icon={<Icon icon="edit" />}
                                    minimal
                                    onClick={() => handleCreatePlaylist(index)}
                                />

                            </Card>
                        ))}
                    </CardList>
                </SectionCard>
            </Section>
        </div>
    );
};

export default CollabPlaylist;