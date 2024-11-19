import {React, useEffect, useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";
import "./styles/Leaderboard.css";
import localstorage from 'localstorage-slim';
import { GiConsoleController } from 'react-icons/gi';

const Leaderboard = () => {
  const username = localstorage.get("user");
  const [sortConfig, setSortConfig] = useState({ key: "score", order: "desc" });
  const [leaderboard, setLeaderboard] = useState([]);
  const[friends, setFriends] = useState([]);



  // Minutes listened total
  // 
  useEffect(() => {
    const fetchAndSetData = async () => {
      const friendsList = await fetchFriendsList();
      setFriends(friendsList);
  };
    fetchAndSetData();
    fetchTopArtists();
  }) 
  const fetchFriendsList = async () => {
    // console.log(username);
    try {
      const res = await fetch("http://localhost:3001/fetchFriends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });
      const data = await res.json();
      // console.log(data);
      // setFriends(data.friends);
      // console.log(friends);
      return data.friends
    } catch (error) {
      console.error(error);
    }
  };
  const fetchTopArtists = async () => {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/topArtists?timeline=short_term`
    );
    const data = await response.json();
    // console.log(data);
    let totalPop = 0;
    let entries = 0;
    data.data.forEach(entry => {
      entries+=1
      totalPop+=entry.popularity
    });
    const averagePop = totalPop/entries;
    savePopularityScore(averagePop);
    // console.log(averagePop);
  };
  useEffect(() => {
    if (friends.length > 0) { // Ensure friends is populated
      async function fetchLeaderboard() {
        const leaderboardData = await Promise.all(
          friends.map(async (user) => {
            const score = await getScore(user);
            return { name: user, score }; // Construct leaderboard entry
          }));
          const currentUserScore = await getScore(username);
          const currentUser = { name: username, score: currentUserScore };
          setLeaderboard([currentUser, ...leaderboardData]);
      }
  
      fetchLeaderboard();
    }
  }, [friends]); // Re-run when friends changes
  
  async function savePopularityScore (popScore) {
    try {
      const res = await fetch(`http://localhost:3001/savePopScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: username, popScore:popScore}),
      });
    } catch (error) {
      console.error(error);
    }
  };

  async function getScore(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/getPopScore?user=${user}`
    );
    const data = await response.json();
    // console.log(data);
    return data.popScore;
  };
  // const friends = [
  //   { name: "a", score: 45 },
  //   { name: "b", score: 70 },
  //   { name: "c", score: 60 },
  // ];
  const currentUser = { name: username, score: 85 };
  // const leaderboard = [currentUser, ...friends];

  const sortedLeaderboard = [...leaderboard].sort(
    (a, b) =>
      sortConfig.key === "score"
        ? (sortConfig.order === "desc" ? b.score - a.score : a.score - b.score)
        : (sortConfig.order === "desc"
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name))
  );
  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    setSortConfig({ key, order });
  };
  return (
    <div className="leaderboard-container">
      <select className="sort-dropdown" onChange={handleSortChange}>
        <option value="score-desc">Popularity Score (Descending)</option>
        <option value="score-asc">Popularity Score (Ascending)</option>
      </select>
      {leaderboard.length === 0 ? (
        <p className="loading-message">Loading leaderboard...</p>
      ) : (
        sortedLeaderboard.map((entry, index) => (
          <div
            key={index}
            className={`leaderboard-item ${
              entry.name === username ? "current-user" : ""
            }`}
          >
            <p className="rank">{index + 1}</p>
            <p className="name">{entry.name}</p>
            <p className="score">{entry.score.toFixed(1)}</p>
          </div>
        ))
      )}
    </div>
  );
  
}
export default Leaderboard;