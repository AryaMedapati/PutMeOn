import React, { useState, useEffect } from "react";
import { FaSquareXTwitter } from "react-icons/fa6";
import {
  FaFacebook,
  FaLinkedin,
  FaReddit,
  FaInstagram,
  FaSnapchatGhost,
} from "react-icons/fa";

const ShareStats = () => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [topGenres, setTopGenres] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  const fetchTopTracks = async (timeline) => {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/topTracks?timeline=${timeline}`);
    const data = await response.json();
    console.log(data);
    setTopTracks(data.data.slice(0, 3).map((track) => track.name));
  };

  const fetchTopArtists = async (timeline) => {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/topArtists?timeline=${timeline}`);
    const data = await response.json();
    console.log(data);
    setTopArtists(data.data.slice(0, 3).map((artist) => artist.name));
    const genreCounts = getGenreCounts(data.data);
    const rankedGenres = rankGenres(genreCounts);
    setTopGenres(rankedGenres.slice(0, 3).map((genre) => genre.genre));
  };

  const getGenreCounts = (data) => {
    let genreCounts = {};
    data.forEach((entry) => {
      entry.genres.forEach((genre) => {
        if (genreCounts[genre]) {
          genreCounts[genre]++;
        } else {
          genreCounts[genre] = 1;
        }
      });
    });
    return genreCounts;
  };

  const rankGenres = (genreCounts) => {
    let genreArray = Object.entries(genreCounts);
    genreArray.sort((a, b) => b[1] - a[1]);
    let rankedGenres = [];
    let rank = 1;

    genreArray.forEach((item, index) => {
      if (index === 0) {
        rankedGenres.push({ genre: item[0], count: item[1], rank });
      } else {
        if (item[1] === genreArray[index - 1][1]) {
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        } else {
          rank = index + 1;
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        }
      }
    });

    return rankedGenres;
  };

  useEffect(() => {
    const timeline = "long_term";
    fetchTopTracks(timeline);
    fetchTopArtists(timeline);
  }, []);

  const shareableContent = `🎵 My Top Tracks: ${topTracks.join(
    ", "
  )}\n🎤 My Top Artists: ${topArtists.join(
    ", "
  )}\n🎧 My Top Genres: ${topGenres.join(", ")}. #MusicStats`;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Share Your Music Stats</h1>
      <p>Let your friends know about your top tracks, artists, and genres!</p>

      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#1DB954",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showShareOptions ? "Hide Share Options" : "Share Stats"}
      </button>

      {showShareOptions && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                shareableContent
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <FaSquareXTwitter
                style={{ fontSize: "2.5rem", color: "black" }}
              />
            </a>
            <a
              href={`https://www.reddit.com/submit?title=${encodeURIComponent(
                shareableContent
              )}&url=${encodeURIComponent("https://placeholder.com")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaReddit style={{ fontSize: "2.5rem", color: "#FF5700" }} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                "https://placeholder.com"
              )}&title=${encodeURIComponent(
                "Check out my music stats!"
              )}&summary=${encodeURIComponent(shareableContent)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin style={{ fontSize: "2.5rem", color: "#0a66c2" }} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(
                shareableContent
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <FaFacebook style={{ fontSize: "2.5rem", color: "#1877F2" }} />
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "2.5rem",
                height: "2.5rem",
                background:
                  "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                borderRadius: "10px",
                clipPath: "none",
              }}
            >
              <FaInstagram
                style={{
                  fontSize: "2.3rem",
                  color: "white",
                }}
              />
            </a>
            <a
              href={`https://www.snapchat.com/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "#FFFC00",
                borderRadius: "10px",
                border: "2px solid black",
                padding: "5px",
              }}
            >
              <FaSnapchatGhost style={{ fontSize: "2.3rem", color: "white" }} />
            </a>
          </div>
          <p style={{ marginTop: "10px" }}>
            Note: For platforms like LinkedIn, Facebook, Instagram, and Snapchat
            it is not possible to be redirected to a post with the message so
            please copy the message below for sharing!
          </p>
          <p style={{ marginTop: "10px" }}>{shareableContent}</p>
        </div>
      )}
    </div>
  );
};

export default ShareStats;
