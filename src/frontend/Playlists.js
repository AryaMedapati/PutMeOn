import React from "react";
import { useState, useContext, useEffect } from "react";
import "./styles/Playlists.css";
import { UserContext } from "./UserContext";
import PlaylistList from "./PlaylistList";
import SharedPlaylists from "./SharedPlaylists";
import CollabPlaylist from "./CollabPlaylist";

const Playlists = (props) => {
  return (
    <div className="outer-container">
      <PlaylistList />
      <SharedPlaylists />
      <CollabPlaylist />
    </div>
  );
};

export default Playlists;
