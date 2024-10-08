import React, { useEffect, useState } from "react";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);

  const fetchTopTracks = async () => {
    const response = await fetch("http://localhost:3001/topTracks");
    const data = await response.json();
    setTracks(data.data);
    console.log(data);
  };

  useEffect(() => {
    fetchTopTracks();
  }, []);

  return (
    <div>
      <h1>Your Top Tracks</h1>
      {tracks.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tracks.map((track, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Album Cover/Track Picture */}
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                style={{ width: "64px", height: "64px", marginRight: "10px" }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{track.name}</h3>
                <p style={{ margin: 0 }}>
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
                {/* Spotify Link Below */}
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  Listen on Spotify
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No top tracks available.</p>
      )}
    </div>
  );
};

export default Tracks;
