import React from 'react';
import { TextArea } from '@blueprintjs/core';

const ProfileMain = () => {
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
            <p>Change the username and password here</p>
        </div>
    );
};

export default ProfileMain;
