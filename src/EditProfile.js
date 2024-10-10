import React, { useRef } from 'react';
import { MultiSelect } from "@blueprintjs/select";
import { MenuItem, Tag, Button, TextArea } from '@blueprintjs/core';
import { useState } from "react";
import '@blueprintjs/core/lib/css/blueprint.css';
import { Icon } from "@blueprintjs/core";
import { getAuth } from "firebase/auth";
import { Minimize } from '@blueprintjs/icons';

const EditProfile = () => {
    const [editBio, setEditBio] = useState(false);


    const auth = getAuth();
    const user = auth.currentUser;

    const fileInputRef = useRef(null);
    const imageContainerRef = useRef(null);

    const handleEditpfp = () => {
        fileInputRef.current.click();
    };

    const items = [
        "test123",
        "te1234",
        "temp1234",
        "testtest",
        "testesttest",
        "nottest",
        "Test",
    ];

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
        debugger;
        console.log(user.uid)
        console.log(user.displayName)
        console.log(user.getIdTokenResult.name)
        debugger;
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

                {user.displayName}
                {user.email}

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
                    onClick={() => setEditBio(!editBio)}
                    text="Save Changes" />
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


        </div>
    );
};

export default EditProfile;
