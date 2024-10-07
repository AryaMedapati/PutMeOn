import React from "react";

const Tracks = () => {

  const fetchTopTracks = async () => {
    const response = await fetch('http://localhost:5002/topTracks');
    console.log(response);
  }

  return (
    <div>
      <h1>Your Top Tracks</h1>
      <p>This is the top tracks page.</p>
      <p>{fetchTopTracks}</p>
    </div>
  );
};

export default Tracks;
