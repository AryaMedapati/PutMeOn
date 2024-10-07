import React from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState } from "react";
import '@blueprintjs/core/lib/css/blueprint.css';
import { Icon } from "@blueprintjs/core";

const EditProfile = () => {
    const [editBio, setEditBio] = useState(false);


    return (
        <div>
            <h1>Edit Profile</h1>

            <div
                style={{
                    backgroundColor: '#c7c7c7',
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    paddingRight: '30px',
                }}
            >
                <Icon style={{padding: 30}} iconSize={80} icon="user"/>
                
                Username

                <Button
                    intent='primary'
                    style={{ 
                        marginLeft: '40px',
                        width: '180px',
                        height: '40px',
                        borderRadius: 10
                    }}
                    // onClick={() => setEditBio(!editBio)}
                    text="Change Photo" />
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
        </div>
    );
};

export default EditProfile;
