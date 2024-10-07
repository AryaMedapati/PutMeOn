import React from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState } from "react";

const EditProfile = () => {
    const [editBio, setEditBio] = useState(false);


    return (
        <div>
            <h1>Edit Profile</h1>

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
            <p>Change the username and password here</p>
        </div>
    );
};

export default EditProfile;
