// Sidebar.js
import React from 'react';
import { Button, ButtonGroup } from "@blueprintjs/core";
import { useState, useEffect } from "react";

const ProfileSidebar = ({ onChangeContent }) => {
    const [hoverProfile, setHoverProfile] = useState(false);
    const [hoverUsername, setHoverUsername] = useState(false);
    const [hoverPrivacy, setHoverPrivacy] = useState(false);

    return (
        <div className="sidebar">
            <ButtonGroup
                vertical
                style={{
                    width: '100%',
                    height: "100%",
                    padding: 0,
                    margin: 0,
                    backgroundColor: '#313131',
                }}
            >
                <Button
                    style={{...buttonStyle,
                        backgroundColor: hoverProfile ? colors.spGreen : colors.spDarkGray,
                        color: hoverProfile ? colors.spDarkGray : colors.spGreen,
                    }}
                    onMouseEnter={() => setHoverProfile(true)}
                    onMouseLeave={() => setHoverProfile(false)}
                    onClick={() => onChangeContent('profile')}
                    text="Your Profile" />
                
                <Button
                    style={{...buttonStyle,
                        backgroundColor: hoverUsername ? colors.spGreen : colors.spDarkGray,
                        color: hoverUsername ? colors.spDarkGray : colors.spGreen,
                    }}
                    onMouseEnter={() => setHoverUsername(true)}
                    onMouseLeave={() => setHoverUsername(false)}
                    onClick={() => onChangeContent('username')}
                    text="Username and Password" />
                
                <Button
                    style={{...buttonStyle,
                        backgroundColor: hoverPrivacy ? colors.spGreen : colors.spDarkGray,
                        color: hoverPrivacy ? colors.spDarkGray : colors.spGreen,
                    }}
                    onMouseEnter={() => setHoverPrivacy(true)}
                    onMouseLeave={() => setHoverPrivacy(false)}
                    onClick={() => onChangeContent('privacy')}
                    text="Privacy and Security" />

            </ButtonGroup>
        </div>
    );
};

const colors = {
    spGreen: '#10c674',
    spDarkGray: '#313131'
}
const buttonStyle = {
    width: '100%',
    height: "8%",
    padding: 0,
    margin: 0,
    fontSize: "16px",
    outline: 'none'
    // textAlign: "left"
};

export default ProfileSidebar;
