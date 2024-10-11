import React, { useEffect, useState } from "react";
import { AiFillSpotify } from "react-icons/ai";

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [artistTimeline, setArtistTimeline] = useState("Last 4 Weeks");

  const fetchTopArtists = async (timeline) => {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/topArtists?timeline=${timeline}`
    );
    const data = await response.json();
    setArtists(data.data);
    console.log(data);
  };

  useEffect(() => {
    const timeline = "short_term";
    fetchTopArtists(timeline);
  }, []);

  const handleButtonClick = (action) => {
    const mapper = {
      short_term: "Last 4 Weeks",
      medium_term: "Last 6 Months",
      long_term: "Last 12 Months",
    };
    setArtistTimeline(mapper[action]);
    fetchTopArtists(action);
  };

  const buttonStyle = {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#1DB954",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#1aa34a",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h1 style={{ padding: "20px", textAlign: "center" }}>Your Top Artists from the {artistTimeline}</h1>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <button
          onClick={() => handleButtonClick("short_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 4 Weeks
        </button>
        <button
          onClick={() => handleButtonClick("medium_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 6 Months
        </button>
        <button
          onClick={() => handleButtonClick("long_term")}
          style={buttonStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonHoverStyle.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              buttonStyle.backgroundColor)
          }
        >
          Last 12 Months
        </button>
      </div>
      {artists.length > 0 ? (
        <ul
          style={{ listStyleType: "none", padding: 0, paddingBottom: "60px" }}
        >
          {artists.map((artist, index) => (
            <li
              key={index}
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: "50px",
                    marginRight: "10px",
                    fontWeight: "bold",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                  }}
                >
                  {index + 1}
                </span>
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  style={{
                    width: "64px",
                    height: "64px",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{artist.name}</h3>
                  {/* <p style={{ margin: 0 }}>
                    {artist.artists.map((artist) => artist.name).join(", ")}
                  </p> */}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingRight: "20px",
                }}
              >
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  <AiFillSpotify
                    style={{ fontSize: "1.5rem", color: "#1DB954" }}
                  />
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No top artists available.</p>
      )}
    </div>
  );
};

export default Artists;
