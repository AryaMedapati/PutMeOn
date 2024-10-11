import React, { useRef } from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState, useEffect, useContext } from "react";
import '@blueprintjs/core/lib/css/blueprint.css';
import { Icon } from "@blueprintjs/core";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from './UserContext';

const ViewProfile = () => {
    const [pfp, setPfp] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");

    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    const db = getFirestore();
    const { username } = useContext(UserContext);

    const displayImage = (base64String) => {
        const img = document.createElement('img');
        img.src = base64String;
        img.style.width = '80px';
        img.style.height = '80px';
        img.style.borderRadius = '50%';
        img.style.objectFit = 'cover';

        const container = imageContainerRef.current;
        container.innerHTML = '';
        container.appendChild(img);
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            if (username) {
                const userDoc = await getDoc(doc(db, "UserData", username));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setPfp(data.pfp);
                    setBio(data.bio)
                    setEmail(data.username);
                }
            }
        };
        fetchProfileData();
    }, [username]);

    useEffect(() => {
        displayImage(pfp);
    }, [pfp]);

    return (
        <div>
            <h1>Edit Profile</h1>

            <div
                style={{
                    width: "800px",
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    paddingRight: '30px',
                }}
            >
                <div ref={imageContainerRef} 
                    style={{ padding: '30px', border: '30px'}}
                />

                <div style={{ paddingLeft: '20px', fontSize: '16px' }}>
                    {email || 'Loading email...'}
                </div>
            </div>
            <div style={{ paddingLeft: '20px', fontSize: '16px' }}>
                    {bio || 'Loading bio...'}
                </div>
        </div>
    );
};

export default ViewProfile;
