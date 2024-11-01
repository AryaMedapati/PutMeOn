import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { MenuItem, Tag, Button, TextArea, Card, CardList, Section, SectionCard } from '@blueprintjs/core';
import { useNavigate } from "react-router-dom";

const PlaylistList = () => {
    const navigate = useNavigate();
    const { username } = useContext(UserContext);

    const [playlists, setPlaylists] = useState([]);

    const handleCreatePlaylist = (index) => {
        const additionalInfo = { playlists: playlists, playlistIndex: index };
        navigate("new-playlist", { state: additionalInfo });
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
                setPlaylists(data.playlists);
            }
        };
        fetchProfileData();
    }, [username]);

    return (
        <div>
            <h1>My Playlists</h1>
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
            <Section title="My Playlists">
                <SectionCard padded={false}>
                    <CardList bordered={false}>
                        {playlists.map((playlist, index) => (
                            <Card
                                key={index}
                                onClick={() => handleCreatePlaylist(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                {playlist.name}
                            </Card>
                        ))}
                    </CardList>
                </SectionCard>
            </Section>
        </div>
    );
};

export default PlaylistList;