import React from 'react';
import { useState } from "react";


const Playlists = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);
  };
  const handleFileSave = () => {
    if (selectedFile) {

    }
  }
  return (
    <div>
      <h1>Your Playlists</h1>
      <p>This is the Playlists page.</p>
      <div>
        <h2>Upload Extensive Listening History</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileSave}>Save File</button>
    </div>
    </div>
  );
};

export default Playlists;
