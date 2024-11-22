// Sidebar.js
import React from 'react';
import { Button, ButtonGroup } from "@blueprintjs/core";
import { useState } from "react";

const ProfileSidebar = ({ onChangeContent }) => {
    const [hoverView, setHoverView] = useState(false);
    const [hoverEdit, setHoverEdit] = useState(false);
    const [hoverUsername, setHoverUsername] = useState(false);
    const [hoverPrivacy, setHoverPrivacy] = useState(false);
    const [hoverFriends, setHoverFriends] = useState(false);
    const [hoverUploadHistory, setHoverUploadHistory] = useState(false);
    const [hoverRecommendations, setHoverRecommendations] = useState(false);

    return (
        <div className="sidebar">
            <ButtonGroup
                id="sidebarButtonGroup"
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
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverView ? colors.text : colors.background,
                        color: hoverView ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverView(true)}
                    onMouseLeave={() => setHoverView(false)}
                    onClick={() => onChangeContent('view')}
                    text="Your Profile" />

                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverEdit ? colors.text : colors.background,
                        color: hoverEdit ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverEdit(true)}
                    onMouseLeave={() => setHoverEdit(false)}
                    onClick={() => onChangeContent('edit')}
                    text="Edit Profile" />
                
                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverUsername ? colors.text : colors.background,
                        color: hoverUsername ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverUsername(true)}
                    onMouseLeave={() => setHoverUsername(false)}
                    onClick={() => onChangeContent('username')}
                    text="Username and Password" />
                
                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverPrivacy ? colors.text : colors.background,
                        color: hoverPrivacy ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverPrivacy(true)}
                    onMouseLeave={() => setHoverPrivacy(false)}
                    onClick={() => onChangeContent('privacy')}
                    text="Privacy and Security" />
                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverFriends ? colors.text : colors.background,
                        color: hoverFriends ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverFriends(true)}
                    onMouseLeave={() => setHoverFriends(false)}
                    onClick={() => onChangeContent('friends')}
                    text="Friends" />
                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverUploadHistory ? colors.text : colors.background,
                        color: hoverUploadHistory ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverUploadHistory(true)}
                    onMouseLeave={() => setHoverUploadHistory(false)}
                    onClick={() => onChangeContent('uploadHistory')}
                    text="Upload Listening History" />
                <Button
                    className="sidebarButton"
                    style={{...buttonStyle,
                        backgroundColor: hoverRecommendations ? colors.text : colors.background,
                        color: hoverRecommendations ? colors.background : colors.text,
                    }}
                    onMouseEnter={() => setHoverRecommendations(true)}
                    onMouseLeave={() => setHoverRecommendations(false)}
                    onClick={() => onChangeContent('recommendations')}
                    text="View Recommendations" />

            </ButtonGroup>
        </div>
    );
};

const colors = {
    text: '#10c674',
    background: '#313131'
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
