import React from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState } from "react";

const ProfileMain = () => {
    const [editBio, setEditBio] = useState(false);


    return (
        <div>
            <h1>Set Profile here</h1>

            <h2>Bio</h2>

            <div>
                <TextArea
                    fill={true}
                    growVertically={true}
                    large={true}
                    placeholder="Put your bio here"
                />
            </div>
            <div>
                <Button
                    onClick={() => setEditBio(!editBio)}
                    text="Your Profile" />
                    
            </div>
            <p>Change the username and password here</p>
        </div>
    );
};

export default ProfileMain;
