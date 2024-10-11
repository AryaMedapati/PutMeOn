import React, { useRef } from 'react';
import { useState, useEffect, useContext } from "react";
import '@blueprintjs/core/lib/css/blueprint.css';
import { Icon } from "@blueprintjs/core";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from './UserContext';
import { MultiSelect } from "@blueprintjs/select";
import { MenuItem, Tag, Button, TextArea } from '@blueprintjs/core';

const EditProfile = () => {

    const items = [
        "test123",
        "te1234",
        "temp1234",
        "testtest",
        "testesttest",
        "nottest",
        "Test",
    ];

    const [pfp, setPfp] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [docId, setDocId] = useState("")

    const db = getFirestore();
    const { username } = useContext(UserContext);

    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    const [selectedItems, setSelectedItems] = useState([]);
    const [songQuery, setSongQuery] = useState("");
    const handleItemSelect = (item) => {
        if (!selectedItems.some((selectedItem) => selectedItem === item)) {
            setSelectedItems([...selectedItems, item]);
        }
    };
    const handleTagRemove = (tag, index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };
    const renderItem = (item, { handleClick, modifiers }) => {
        return (
            <MenuItem
                key={item}
                text={item}
                onClick={handleClick}
                active={modifiers.active}
                selected={selectedItems.includes(item)}
            />
        );
    };
    const itemPredicate = (songQuery, item) => {
        const normalizedFruit = item.toLowerCase();
        const normalizedQuery = songQuery.toLowerCase();
        return normalizedFruit.includes(normalizedQuery);
    };
    const createNewItemFromQuery = (songQuery) => songQuery;
    const createNewItemRenderer = (songQuery, active, handleClick) => {
        if (!songQuery) return null;
        return (
            <MenuItem
                key={`create-new-${songQuery}`}
                text={`Create "${songQuery}"`}
                active={active}
                onClick={handleClick}
                icon="add"
            />
        );
    };

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
                    width: "100%",
                    backgroundColor: '#c7c7c7',
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    paddingRight: '30px',
                }}
            >
                <div ref={imageContainerRef}
                    style={{ padding: '30px', border: '30px' }}
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
                        borderRadius: 10,
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

            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: 24,
                    padding: 10
                }}
            >
                Top 3 Songs
            </div>
            <div
                className="multiselect-wrapper"
            >
                <MultiSelect
                    items={items}
                    itemPredicate={itemPredicate}
                    itemRenderer={renderItem}
                    onItemSelect={handleItemSelect}
                    tagRenderer={(item) => item}
                    selectedItems={selectedItems}
                    tagInputProps={{
                        onRemove: handleTagRemove,
                        large: true,
                        placeholder: "Type to add a song...",
                    }}
                    createNewItemFromQuery={createNewItemFromQuery}
                    createNewItemRenderer={createNewItemRenderer}
                    openOnKeyDown
                    resetOnSelect
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
