import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { MenuItem, Tag, Button, TextArea } from '@blueprintjs/core';
import { useNavigate } from "react-router-dom";

const PlaylistList = () => {
    const navigate = useNavigate();

    const handleCreatePlaylist = () => {
        navigate("new-playlist");
    };

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
                    onClick={handleCreatePlaylist}
                    text="New Playlist" />
            </div>
        </div>
    );
};

export default PlaylistList;