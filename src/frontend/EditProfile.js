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
        "song1",
        "song2",
        "so3",
        "songsong",
        "testsong",
        "songtest",
        "song123",
    ];

    const [pfp, setPfp] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [docId, setDocId] = useState("")

    const db = getFirestore();
    const { username } = useContext(UserContext);

    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

// Begin Multiselect items
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const handleSongSelect = (item) => {
        if (!selectedSongs.some((selectedItem) => selectedItem === item)) {
            setSelectedSongs([...selectedSongs, item]);
        }
    };
    const handleSongTagRemove = (tag, index) => {
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

    const handleGenreSelect = (item) => {
        if (!selectedGenres.some((selectedItem) => selectedItem === item)) {
            setSelectedGenres([...selectedGenres, item]);
        }
    };
    const handleGenreTagRemove = (tag, index) => {
        setSelectedGenres(selectedGenres.filter((_, i) => i !== index));
    };
    const renderGenres = (item, { handleClick, modifiers }) => {
        return (
            <MenuItem
                key={item}
                text={item}
                onClick={handleClick}
                active={modifiers.active}
                selected={selectedGenres.includes(item)}
            />
        );
    };
 
    const handleArtistSelect = (item) => {
        if (!selectedArtists.some((selectedItem) => selectedItem === item)) {
            setSelectedArtists([...selectedArtists, item]);
        }
    };
    const handleArtistTagRemove = (tag, index) => {
        setSelectedArtists(selectedArtists.filter((_, i) => i !== index));
    };
    const renderArtists = (item, { handleClick, modifiers }) => {
        return (
            <MenuItem
                key={item}
                text={item}
                onClick={handleClick}
                active={modifiers.active}
                selected={selectedArtists.includes(item)}
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
// end multiselect items
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
                bio: bio, 
                topSongs: selectedSongs,
                topGenres: selectedGenres,
                topArtists: selectedArtists
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
                    setSelectedGenres(data.topGenres);
                    setSelectedSongs(data.topSongs);
                    setSelectedArtists(data.topArtists);
                    setDocId(userDoc.id);
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
                Top Songs
            </div>
            <div
                className="multiselect-wrapper"
            >
                <MultiSelect
                    items={items}
                    itemPredicate={itemPredicate}
                    itemRenderer={renderSongs}
                    onItemSelect={handleSongSelect}
                    tagRenderer={(item) => item}
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
                    fontWeight: 'bold',
                    fontSize: 24,
                    padding: 10
                }}
            >
                Top Genres
            </div>
            <div
                className="multiselect-wrapper"
            >
                <MultiSelect
                    items={items}
                    itemPredicate={itemPredicate}
                    itemRenderer={renderGenres}
                    onItemSelect={handleGenreSelect}
                    tagRenderer={(item) => item}
                    selectedItems={selectedGenres}
                    tagInputProps={{
                        onRemove: handleGenreTagRemove,
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
                    fontWeight: 'bold',
                    fontSize: 24,
                    padding: 10
                }}
            >
                Top Artists
            </div>
            <div
                className="multiselect-wrapper"
            >
                <MultiSelect
                    items={items}
                    itemPredicate={itemPredicate}
                    itemRenderer={renderArtists}
                    onItemSelect={handleArtistSelect}
                    tagRenderer={(item) => item}
                    selectedItems={selectedArtists}
                    tagInputProps={{
                        onRemove: handleArtistTagRemove,
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
