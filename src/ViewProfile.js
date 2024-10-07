import React from 'react';
import { Button, TextArea } from '@blueprintjs/core';
import { useState } from "react";

const ViewProfile = () => {
    const [editBio, setEditBio] = useState(false);


    return (
        <div>
            <h1>Set Profile here</h1>

            <h2>Bio</h2>

            <div>
                <TextArea
                    intent='none'
                    style={{ 
                        resize: 'none',
                        width: '800px',
                        height: '100px',
                        borderRadius: 10
                    }}
                    growVertically={true}
                    small

                    placeholder="Put your bio here"
                />
            </div>

        </div>
    );
};

export default ViewProfile;
