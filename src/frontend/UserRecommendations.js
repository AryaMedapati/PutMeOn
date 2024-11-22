import React, { useState, useContext, useEffect } from "react";
import { Spinner, Card, Elevation, Button } from '@blueprintjs/core';
import { UserContext } from "./UserContext";
import localstorage from "localstorage-slim";
import { Link } from 'react-router-dom';
import Select from 'react-select';  
import './styles/UserRecommendations.css';

const UserRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [userTaste, setUserTaste] = useState(null);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recommendedPlaylist, setRecommendedPlaylist] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);  
  const [playlistUrl, setPlaylistUrl] = useState(null); // To store the generated playlist URL
  const { email: username } = useContext(UserContext);

  const options = [
    { value: 'top_artists', label: 'Top Artists' },
    { value: 'top_songs', label: 'Top Songs' },
    { value: 'top_genres', label: 'Top Genres' },
    { value: 'acousticness', label: 'Acousticness' },
    { value: 'danceability', label: 'Danceability' },
    { value: 'energy', label: 'Energy' },
    { value: 'instrumentalness', label: 'Instrumentalness' },
    { value: 'speechiness', label: 'Speechiness' },
    { value: 'tempo', label: 'Tempo' },
    { value: 'popularity', label: 'Popularity' },
  ];

  useEffect(() => {
    fetchUserTasteProfile();
  }, [username]);

  const fetchUserTasteProfile = async () => {
    if (!username && !localstorage.get("user")) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/fetchTasteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username || localstorage.get("user") }),
      });

      const data = await res.json();

      if (res.ok) {
        setUserTaste({
          username: data.username,
          genreFrequency: data.genreFrequency,
          topArtists: data.topArtists,
          featureAverages: data.featureAverages,
          timestamp: data.timestamp,
          recommendedSongs: data.recommendedSongs || [],
        });

        findRecommendedProfiles(data.username);
        setRecommendedSongs(data.recommendedSongs || []);
      } else {
        console.error(data.message);
        setUserTaste(null);
      }
    } catch (error) {
      console.error("Error fetching user taste profile:", error);
      setUserTaste(null);
    } finally {
      setLoading(false);
    }
  };

  const findRecommendedProfiles = async (currentUsername) => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/findRecommendedProfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUsername || localstorage.get("user"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecommendedUsers(data.recommendedUsers);
      } else {
        console.error(data.message);
        setRecommendedUsers([]);
      }
    } catch (error) {
      console.error("Error finding recommendations:", error);
      setRecommendedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedSongs = async (currentUsername) => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/getRecommendedSongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUsername || localstorage.get("user"),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecommendedSongs(data.recommendedSongs);
      } else {
        console.error(data.message);
        setRecommendedSongs([]);
      }
    } catch (error) {
      console.error("Error fetching recommended songs:", error);
      setRecommendedSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateTasteProfile = () => {
    fetchUserTasteProfile();
  };

  const handleRegenerateRecommendedSongs = () => {
    fetchRecommendedSongs(username || localstorage.get("user"));
  };

  const handleGeneratePlaylist = async () => {
    if (!selectedOption) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/getRecommendedSongs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || localstorage.get("user"),
          selection: selectedOption.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRecommendedPlaylist(data.recommendedSongs);  // Store the tracks in the state
        generateSpotifyPlaylist(data.recommendedSongs);  // Generate the Spotify playlist link
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error generating playlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSpotifyPlaylist = async (recommendedTracks) => {
    try {
      const res = await fetch("http://localhost:3001/generatePlaylistSpotifyLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || localstorage.get("user"),
          recommendedPlaylist: recommendedTracks,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPlaylistUrl(data.playlistUrl);  // Set the playlist URL to display to the user
      } else {
        console.error(data.message);
        setPlaylistUrl(null);
      }
    } catch (error) {
      console.error("Error generating Spotify playlist link:", error);
      setPlaylistUrl(null);
    }
  };

  const formatFeatureValue = (value) => {
    return value ? value.toFixed(2) : "N/A";
  };

  return (
    <div className="user-recommendations-container">
      <div className="main-content">
        {loading ? (
          <div className="spinner-container">
            <Spinner />
          </div>
        ) : (
          <section className="profile-and-recommendations">
            <div className="left-column">
              <div className="user-taste-profile">
                {userTaste ? (
                  <Card interactive={true} elevation={Elevation.THREE} className="taste-profile-card">
                    <div className="profile-header">
                      <h2>Your Taste Profile</h2>
                      <Button
                        icon="refresh"
                        intent="primary"
                        onClick={handleRegenerateTasteProfile}
                      >
                        Regenerate Profile
                      </Button>
                    </div>
                    <div className="features">
                      {userTaste.featureAverages ? (
                        Object.entries(userTaste.featureAverages).map(([feature, value], index) => (
                          <div key={index} className="feature">
                            <strong>{feature}:</strong> {formatFeatureValue(value)}
                          </div>
                        ))
                      ) : (
                        <p>No features available.</p>
                      )}
                    </div>
                  </Card>
                ) : (
                  <p>No taste profile found for this user.</p>
                )}
              </div>

              <div className="recommended-users">
                {recommendedUsers.length > 0 && (
                  <div>
                    <h2>Recommended Users</h2>
                    {recommendedUsers.map((user, index) => (
                      <Link to={`/profile/${user.username}`} key={index} style={{ textDecoration: 'none' }}>
                        <Card interactive={true} elevation={Elevation.THREE} className="recommended-user-card">
                          <div className="recommended-user-info">
                            <img src={user.pfp} alt={`${user.username}'s profile`} className="profile-pic" />
                            <h3>{user.username}</h3>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="recommended-songs">
                <div className="song-header">
                  <h2>Recommended Songs</h2>
                  <Button
                    icon="refresh"
                    intent="primary"
                    onClick={handleRegenerateRecommendedSongs}
                  >
                    Regenerate Songs
                  </Button>
                </div>
                {recommendedSongs.length > 0 ? (
                  <div className="song-list">
                    {recommendedSongs.map((song, index) => (
                      <Card key={index} interactive={true} elevation={Elevation.TWO} className="song-card">
                        <div className="song-info">
                          <h4>{song.name}</h4>
                          <p>Artist(s): {song.artists.map((artist) => artist.name).join(', ')}</p>
                          <p>Album: {song.album.name}</p>
                        </div>
                        <img
                          src={song.album.images[0].url}
                          alt={`Album cover for ${song.album.name}`}
                          className="album-art"
                        />
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No recommended songs found.</p>
                )}
              </div>
            </div>

            <div className="right-column">
              <div className="playlist-dropdown">
                <h2>Generate Playlist</h2>
                <Select
                  options={options}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  placeholder="Select Playlist Center"
                />
                <Button
                  icon="refresh"
                  intent="primary"
                  onClick={handleGeneratePlaylist}
                  disabled={!selectedOption} 
                >
                  Generate Playlist
                </Button>
              </div>

              {/* Display the generated playlist */}
              <div className="recommended-playlist">
                <h2>Recommended Playlist</h2>
                {recommendedPlaylist.length > 0 ? (
                  <div className="playlist">
                    {recommendedPlaylist.map((track, index) => (
                      <div key={index} className="playlist-track">
                        <img src={track.album.images[0].url} alt={track.trackName} className="album-art" />
                        <div className="track-info">
                          <h4 className="track-name">{track.name}</h4>
                          <p className="artist-name">{track.artists.map((artist) => artist.name).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No tracks found for this playlist.</p>
                )}
                {/* Show the Spotify link if it was generated */}
                {playlistUrl && (
                  <div className="spotify-link">
                    <Button intent="success" icon="music" onClick={() => window.open(playlistUrl, "_blank")}>
                      Open Playlist in Spotify
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default UserRecommendations;
