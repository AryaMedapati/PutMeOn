import React, { useEffect, useState } from "react";
import localstorage from "localstorage-slim";
import { Button, Icon } from "@blueprintjs/core";
import axios from "axios";

const Poll = () => {
  const [userVote, setUserVote] = useState(null);
  const [voted, setVoted] = useState(false);
  const [twoArtists, setTwoArtists] = useState([]);
  const [currentPoll, setCurrentPoll] = useState([
    { name: "loading...", votes: 0 },
    { name: "loading...", votes: 0 },
  ]);

  const user = localstorage.get("user");
  const totalVotes = currentPoll.reduce((sum, artist) => sum + artist.votes, 0);

  const fetchArtists = async () => {
    const response = await fetch("http://localhost:3001/pickTwoArtists");
    const artists = await response.json();
    setTwoArtists(artists);

    const resp = await fetch("http://localhost:3001/updatePoll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artists: [
          { name: artists[0], votes: 0 },
          { name: artists[1], votes: 0 },
        ],
      }),
    });
  };

  const handleVote = async (index) => {
    const updatedPollData = currentPoll.map((artist, i) =>
      i === index ? { ...artist, votes: artist.votes + 1 } : artist
    );
    setCurrentPoll(updatedPollData);
    debugger;
    await fetch("http://localhost:3001/updatePoll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artists: updatedPollData,
      }),
    });
  };

  useEffect(() => {
    const fetchPoll = async () => {
      const response = await fetch("http://localhost:3001/fetchPoll");
      const artists = await response.json();
      setCurrentPoll(artists);
    };
    fetchPoll();
  });

  return (
    <div className="global-container">
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
        }}
      >
        <h1
          className="playlists-title"
          style={{
            margin: 0,
            textAlign: "center",
          }}
        >
          Pick Your Preferred Artist
        </h1>
        <Button
          className="create-playlist-button"
          intent="primary"
          style={{
            position: "absolute",
            right: 0,
            width: "130px",
            height: "35px",
            borderRadius: 20,
          }}
          //   disabled
          onClick={() => fetchArtists()}
          text="New Poll"
        />
      </div>

      <div style={{ width: "300px", margin: "0 auto" }}>
        {currentPoll.map((artist, index) => {
          const percentage =
            totalVotes === 0 ? 0 : (artist.votes / totalVotes) * 100;
          return (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{artist.name}</span>
                <span>{artist.votes} votes</span>
              </div>
              <div
                style={{
                  background: "#e0e0e0",
                  borderRadius: "4px",
                  overflow: "hidden",
                  height: "20px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    background: "#007bff",
                    height: "100%",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <button
                onClick={() => handleVote(index)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                // disabled={voted}
              >
                Vote
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Poll;
