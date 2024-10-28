import React, { useRef } from "react";
import { Button, TextArea } from "@blueprintjs/core";
import { useState, useEffect, useContext } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Icon } from "@blueprintjs/core";
import { getAuth,signOut  } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import localstorage from 'localstorage-slim';


const ViewProfile = () => {
    const [pfp, setPfp] = useState("");
    const [bio, setBio] = useState("");
    const [email, setEmail] = useState("");
    const [selectedSongs, setSelectedSongs] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const { username, setUsername } = useContext(UserContext);


  const fileInputRef = useRef(null);
  const imageContainerRef = useRef(null);
  const nav = useNavigate();

  const db = getFirestore();
  // const { username } = useContext(UserContext);

  const linkSpotifyAccount = async () => {
    const user = localstorage.get('user');
    const spotifyAuthUrl = `http://localhost:3001/spotify-login?user=${user}`;
    
    // const accessTokenFromUrl = params.get('access_token');
    // const refreshTokenFromUrl = params.get('refresh_token');
    // console.log(accessTokenFromUrl);
    window.open(spotifyAuthUrl, "_blank", "noopener,noreferrer");
    // await fetch(`http://localhost:3001/saveToken?user=${username}`);
  };
  const handleLogOut = () => {
    const auth = getAuth();
    signOut(auth).then(function() {
      console.log('Signed Out');
      // setIsLoggedIn(false);
      localstorage.set('user', "");
      localstorage.set('pass', "")
      nav("/login");
    }).catch((error) => {
      console.log(error);
    })

  };

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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (username) {
        const userDoc = await getDoc(doc(db, "UserData", username));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPfp(data.pfp);
          setBio(data.bio);
          setEmail(data.username);
        }
      }
    };
    fetchProfileData();
  }, [username]);

  useEffect(() => {
    displayImage(pfp);
  }, [pfp]);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (username) {
                const userDoc = await getDoc(doc(db, "UserData", username));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setPfp(data.pfp);
                    setBio(data.bio)
                    setEmail(data.username);
                    setSelectedGenres(data.topGenres);
                    setSelectedSongs(data.topSongs);
                    setSelectedArtists(data.topArtists);
                }
            }
        };
        fetchProfileData();
    }, [username]);
  
  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      try {
        const response = await axios.get("http://localhost:3001/currentlyPlaying");
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
                    borderRadius: '20px',
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    paddingRight: '30px',
                }}
            >
                <div ref={imageContainerRef}
                    style={{ padding: '30px', border: '30px' }}
                />

                <div style={{ paddingLeft: '20px', fontSize: '16px' }}>
                    {email || 'Loading email...'}
                </div>
            </div>
            <div style={{ paddingLeft: '20px', fontSize: '16px' }}>
                {bio || 'Loading bio...'}
            </div>
            <div
                style={{
                    fontWeight: 'bold',
                    fontSize: 24,
                    padding: 10
                }}
            >
                Favorites:
            </div>
            {selectedSongs.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                ))}
            {selectedGenres.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                ))}
            {selectedArtists.map((item, index) => (
                    <div key={index}>
                        {item}
                    </div>
                ))}

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
          <p><strong>Track:</strong> {currentlyPlaying.name}</p>
          <p><strong>Artist:</strong> {currentlyPlaying.artist}</p>
          <p><strong>Album:</strong> {currentlyPlaying.album}</p>
          {/* <p><strong>Progress:</strong> {Math.floor(currentlyPlaying.progress_ms / 60000)}:{Math.floor((currentlyPlaying.progress_ms % 60000) / 1000).toString().padStart(2, '0')} / {Math.floor(currentlyPlaying.duration_ms / 60000)}:{Math.floor((currentlyPlaying.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</p> */}
        </div>
      ) : (
        <p>No song is currently playing, or your account is unlinked.</p>
      )}
    </div>
    <div style={{ marginTop: "20px" }}>
        <Button
          text="Log Out"
          intent="primary"
          onClick={handleLogOut}
        />
      </div>
    </div>

  );
};

export default ViewProfile;
