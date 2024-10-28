import React, { useState, useEffect, useContext } from "react";
import { getFirestore, doc, getDoc, setDoc, documentId } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { MenuItem, Tag, Button, TextArea } from '@blueprintjs/core';

const NewPlaylist = () => {

    return (
        <div>
            <h1>New Playlists</h1>
        </div>
    );
};

export default NewPlaylist;