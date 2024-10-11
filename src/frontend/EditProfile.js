import React, { useRef } from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState, useEffect, useContext } from "react";
import '@blueprintjs/core/lib/css/blueprint.css';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from './UserContext';

const EditProfile = () => {
    const [pfp, setPfp] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [docId, setDocId] = useState("")

    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    const db = getFirestore();
    const { username } = useContext(UserContext);

    const handleEditpfp = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            displayImage(base64String);
            setPfp(base64String)
            console.log('Base64 String:', base64String);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleSaveChanges = async () => {
        if (username) {
          try {
            // const res = await fetch("http://localhost:3001/updateUser", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify({
            //         username: email,
            //         pfp: pfp
            //     }),
            // });
            await setDoc(doc(db, "UserData", username), {
                pfp: pfp,
                bio: bio
            }, {merge: true});
            alert("Changes saved");
          } catch (error) {
            console.error(error);
            alert(error);
          }
        } else {
          alert("No user logged in.");
        }
      };

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
                    setDocId(userDoc.id)
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
                    backgroundColor: '#c7c7c7',
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
                    {email}
                </div>

                <Button
                    intent='primary'
                    style={{ 
                        position: 'absolute',
                        right: '30px',
                        width: '180px',
                        height: '40px',
                        borderRadius: 10
                    }}
                    onClick={handleEditpfp}
                    text="Change Photo"
                />
                <input
                    style={{ 
                        position: 'absolute',
                        right: '30px',
                        width: '180px',
                        height: '40px',
                        borderRadius: '10px',
                        display: 'none'
                    }}
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

            </div>


            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: 24,
                    padding: 10
                }}
            >
                Bio
            </div>
            <div>
                <TextArea
                    intent='none'
                    style={{ 
                        resize: 'none',
                        width: '800px',
                        height: '100px',
                        borderRadius: 10
                    }}
                    large
                    value={bio}
                    onChange={handleBioChange}
                    placeholder="Put your bio here"
                />
            </div>

            <div>
                <Button
                    intent='primary'
                    style={{ 
                        width: '160px',
                        height: '35px',
                        borderRadius: 20
                    }}
                    onClick={handleSaveChanges}
                    text="Save Changes" />
                    
            </div>
        </div>
    );
};

export default EditProfile;
