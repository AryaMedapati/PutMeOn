import {React, useEffect, useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";
import "./styles/Leaderboard.css";
import localstorage from 'localstorage-slim';
import { GiConsoleController } from 'react-icons/gi';

const Leaderboard = () => {
  const username = localstorage.get("user");
  const [sortConfig, setSortConfig] = useState({ key: "score", order: "desc" });
  // const friends = ["a","b","c"];
  const friends = [
    { name: "a", score: 45 },
    { name: "b", score: 70 },
    { name: "c", score: 60 },
  ];
  const currentUser = { name: username, score: 85 };
  const leaderboard = [currentUser, ...friends];

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortConfig.key === "score") {
      return sortConfig.order === "desc" ? b.score - a.score : a.score - b.score;
    } else if (sortConfig.key === "name") {
      return sortConfig.order === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
    return 0;
  });
  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    setSortConfig({ key, order });
  };
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <select onChange={handleSortChange} className="sort-dropdown">
        <option value="score-desc">Sort by Score (Descending)</option>
        <option value="score-asc">Sort by Score (Ascending)</option>
        <option value="name-asc">Sort by Name (A-Z)</option>
        <option value="name-desc">Sort by Name (Z-A)</option>
      </select>
      <ol>
        {sortedLeaderboard.map((friend, index) => (
          <li key={index}>
            <span className="rank">{index + 1}.</span>
            <span className="name">{friend.name}</span>
            <span className="score">{friend.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
export default Leaderboard;