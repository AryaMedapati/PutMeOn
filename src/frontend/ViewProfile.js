import React, { useRef } from "react";
import {
  MenuItem,
  Tag,
  Button,
  TextArea,
  Card,
  Elevation,
  EditableText,
  Popover,
  Position,
} from "@blueprintjs/core";
import { useState, useEffect, useContext } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Icon } from "@blueprintjs/core";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import localstorage from "localstorage-slim";
import SpotifyTrackerButton from "./ProfileTracking";

const ViewProfile = () => {
  const [pfp, setPfp] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalReactions, setTotalReactions] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [currentLikes, setCurrentLikes] = useState(0);
  const [currentReactions, setCurrentReactions] = useState(0);
  const [currentComments, setCurrentComments] = useState(0);
  const [songs, setSongs] = useState([]);

  // const { username, setUsername } = useContext(UserContext);
  const username = localstorage.get("user");

  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  const nav = useNavigate();

  const db = getFirestore();
  // const { username } = useContext(UserContext);

  const linkSpotifyAccount = async () => {
    const user = localstorage.get("user");
    const spotifyAuthUrl = `http://localhost:3001/spotify-login?user=${user}`;

    // const accessTokenFromUrl = params.get('access_token');
    // const refreshTokenFromUrl = params.get('refresh_token');
    // console.log(accessTokenFromUrl);
    window.open(spotifyAuthUrl, "_blank", "noopener,noreferrer");
    // await fetch(`http://localhost:3001/saveToken?user=${username}`);
  };
  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(function () {
        console.log("Signed Out");
        // setIsLoggedIn(false);
        localstorage.set("user", "");
        localstorage.set("pass", "");
        localstorage.set("docId", "");
        nav("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  async function getSaved() {
    const user = localstorage.get("user");
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/getRecentlyPlayed?user=${user}`);
    const data = await response.json();
    const totalLikesTemp = data.totalLikes || 0;
    setTotalLikes(totalLikesTemp);
    const totalReactionsTemp = data.totalReactions || 0;
    setTotalReactions(totalReactionsTemp);
    const totalCommentsTemp = data.totalComments || 0;
    setTotalComments(totalCommentsTemp);
    const currentCommentsTemp = data.comments ? data.comments.length : 0;
    setCurrentComments(currentCommentsTemp);
    const currentReactionsTemp = data.fire + data.currentLaughingLikes || 0;
    setCurrentReactions(currentReactionsTemp);
    const currentLikesTemp = data.currentLikes || 0;
    setCurrentLikes(currentLikesTemp);
  }

  const displayImage = (base64String) => {
    const img = document.createElement("img");
    img.src = base64String;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";

    const container = imageContainerRef.current;
    container.innerHTML = "";
    container.appendChild(img);
  };

  const renderSongDetails = (index) => {
    if (songs.length > index) {
      const trackName = selectedSongs[index].split(" -- by ")[0];

      const song = songs.find((s) => s["Track Name"] === trackName);
      return (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={song["Album Image URL"]}
              alt={`${song["Album Name"]} Cover`}
              style={{
                maxWidth: "120px",
                height: "auto",
                borderRadius: "8px",
              }}
            />
            <div style={{ marginTop: "10px" }}>
              <a
                href={song["Track Preview URL"]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007BFF",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Preview
              </a>
            </div>
          </div>
          <div style={{ lineHeight: "1.6", fontSize: "14px" }}>
            <div>
              <strong>Track Name:</strong> {song["Track Name"]}
            </div>
            <div>
              <strong>Album Name:</strong> {song["Album Name"]}
            </div>
            <div>
              <strong>Album Artist Name(s):</strong>{" "}
              {song["Album Artist Name(s)"]}
            </div>
            <div>
              <strong>Artist Name(s):</strong> {song["Artist Name(s)"]}
            </div>
            <div>
              <strong>Album Release Date:</strong> {song["Album Release Date"]}
            </div>
            <div>
              <strong>Track Duration:</strong>{" "}
              {`${(song["Track Duration (ms)"] / 1000).toFixed(2)} seconds`}
            </div>
            <div>
              <strong>Danceability:</strong> {song["Danceability"]}
            </div>
            <div>
              <strong>Energy:</strong> {song["Energy"]}
            </div>
            <div>
              <strong>Acousticness:</strong> {song["Acousticness"]}
            </div>
            <div>
              <strong>Instrumentalness:</strong> {song["Instrumentalness"]}
            </div>
            <div>
              <strong>Speechiness:</strong> {song["Speechiness"]}
            </div>
            <div>
              <strong>Liveness:</strong> {song["Liveness"]}
            </div>
            <div>
              <strong>Loudness:</strong> {song["Loudness"]}
            </div>
            <div>
              <strong>Tempo:</strong> {song["Tempo"]}
            </div>
            <div>
              <strong>Time Signature:</strong> {song["Time Signature"]}
            </div>
            <div>
              <strong>Popularity:</strong> {song["Popularity"]}
            </div>
            <div>
              <strong>Explicit:</strong>{" "}
              {song["Explicit"] === "true" ? "Yes" : "No"}
            </div>
            <div>
              <strong>Label:</strong> {song["Label"]}
            </div>
            <div>
              <strong>Copyrights:</strong> {song["Copyrights"]}
            </div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    displayImage(pfp);
  }, [pfp]);
  useEffect(() => {
    getSaved();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        const response = await fetch(
          "http://localhost:3001/fetchUserByUsername",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              username: username,
            },
          }
        );
        const data = await response.json();
        setPfp(data.pfp);
        setBio(data.bio);
        setEmail(data.username);
        setSelectedGenres(data.topGenres);
        setSelectedSongs(data.topSongs);
        setSelectedArtists(data.topArtists);
      }
    };
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await fetch("http://localhost:3001/fetchTopSongs");
      const songs = await response.json();
      setSongs(songs);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/currentlyPlaying"
        );
        setCurrentlyPlaying(response.data);
      } catch (error) {
        console.error("Error fetching currently playing song:", error);
      }
    };

    fetchCurrentlyPlaying();
  }, []);

  return (
    <div>
      <h1>Profile View</h1>

      <div
        style={{
          width: "800px",
          borderRadius: "20px",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          paddingRight: "30px",
        }}
      >
        <div
          ref={imageContainerRef}
          style={{ padding: "30px", border: "30px" }}
        />

        <div style={{ paddingLeft: "20px", fontSize: "16px" }}>
          {email || "Loading email..."}
        </div>
      </div>
      <div style={{ paddingLeft: "20px", fontSize: "16px" }}>
        {bio || "Loading bio..."}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: 24,
          padding: 10,
        }}
      >
        Favorites:
      </div>
      <div>
        {selectedSongs.map((song, index) => (
          <Popover
            key={index}
            position={Position.BOTTOM}
            content={
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  maxWidth: "600px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    paddingBottom: "15px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  Song Details
                </h3>
                {renderSongDetails(index)}
                <Button text="Close" minimal={true} />
              </div>
            }
          >
            <Card
              key={index}
              interactive={true}
              elevation={Elevation.TWO}
              style={{
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "2px solid #1E90FF",
              }}
            >
              <span>{song}</span>
            </Card>
          </Popover>
        ))}
      </div>
      <div>
        {selectedGenres.map((genre, index) => (
          <Card
            key={index}
            interactive={true}
            elevation={Elevation.TWO}
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px 20px",
              display: "inline-block",
              alignItems: "center",
              justifyContent: "space-between",
              whiteSpace: "nowrap",
              border: "2px solid #9370DB",
            }}
          >
            <span>{genre}</span>
          </Card>
        ))}
      </div>
      <div>
        {selectedArtists.map((artist, index) => (
          <Card
            key={index}
            interactive={true}
            elevation={Elevation.TWO}
            style={{
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "10px 20px",
              display: "inline-block",
              alignItems: "center",
              justifyContent: "space-between",
              whiteSpace: "nowrap",
              border: "2px solid #32CD32",
            }}
          >
            <span>{artist}</span>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <Button
          text="Link Account with Spotify"
          intent="primary"
          icon="music"
          onClick={linkSpotifyAccount}
        />
      </div>
      <div>
        {currentlyPlaying ? (
          <div>
            <h3>Currently Listening To:</h3>
            <p>
              <strong>Track:</strong> {currentlyPlaying.name}
            </p>
            <p>
              <strong>Artist:</strong> {currentlyPlaying.artist}
            </p>
            <p>
              <strong>Album:</strong> {currentlyPlaying.album}
            </p>
            {/* <p><strong>Progress:</strong> {Math.floor(currentlyPlaying.progress_ms / 60000)}:{Math.floor((currentlyPlaying.progress_ms % 60000) / 1000).toString().padStart(2, '0')} / {Math.floor(currentlyPlaying.duration_ms / 60000)}:{Math.floor((currentlyPlaying.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</p> */}
          </div>
        ) : (
          <p>No song is currently playing, or your account is unlinked.</p>
        )}
      </div>
      <SpotifyTrackerButton />
      <div style={{ marginTop: "20px" }}>
        <Button text="Log Out" intent="primary" onClick={handleLogOut} />
      </div>
      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Current Likes:</strong> {currentLikes}
        </p>
        <p>
          <strong>Current Reactions:</strong> {currentReactions}
        </p>
        <p>
          <strong>Current Comments:</strong> {currentComments}
        </p>

        <p style={{ marginTop: "20px" }}>
          <strong>Total Likes:</strong> {totalLikes}
        </p>
        <p>
          <strong>Total Reactions:</strong> {totalReactions}
        </p>
        <p>
          <strong>Total Comments:</strong> {totalComments}
        </p>
      </div>
    </div>
  );
};

export default ViewProfile;
