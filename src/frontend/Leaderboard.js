import {React, useEffect, useState, useRef} from 'react';
import "./styles/Leaderboard.css";
import localstorage from 'localstorage-slim';

const Leaderboard = () => {
  const username = localstorage.get("user");
  const [sortConfig, setSortConfig] = useState({ key: "score", order: "desc" });
  const [leaderboard, setLeaderboard] = useState([]);
  const[friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      const friendsList = await fetchFriendsList();
      setFriends(friendsList);
      await fetchTopArtists();
      await fetchFollowers();
  };
    fetchAndSetData();
  }, []) 
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
    console.log(data);
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
  const fetchFollowers = async () => {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/getFollowers`
    );
    const data = await response.json();
    const followers = data.data;
    console.log("Followers" + followers);
    saveFollowers(followers);
  }
  useEffect(() => {
    if (friends.length > 0) { // Ensure friends is populated
      async function fetchLeaderboard() {
        const leaderboardData = await Promise.all(
          friends.map(async (user) => {
            const score = await getScore(user);
            const totalLikes = await getTotalLikes(user);
            const followers = await getFollowers(user);
            return { name: user, popScore:score, totalLikes:totalLikes, followers:followers }; // Construct leaderboard entry
          }));
          const currentUserScore = await getScore(username);
          const currentUserLikes = await getTotalLikes(username);
          const currentFollowers = await getFollowers(username);

          const currentUser = { name: username, popScore: currentUserScore, totalLikes:currentUserLikes, followers:currentFollowers };
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
  async function saveFollowers (followers) {
    try {
      const res = await fetch(`http://localhost:3001/saveFollowers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: username, followers:followers}),
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
  async function getTotalLikes(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/getPopScore?user=${user}`
    );
    const data = await response.json();
    // console.log(data);
    return data.totalLikes;
  };
  async function getFollowers(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/getPopScore?user=${user}`
    );
    const data = await response.json();
    // console.log(data);
    return data.followers;
  };
  // const friends = [
  //   { name: "a", score: 45 },
  //   { name: "b", score: 70 },
  //   { name: "c", score: 60 },
  // ];
  const currentUser = { name: username, score: 85 };
  // const leaderboard = [currentUser, ...friends];

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (sortConfig.key === "score" || sortConfig.key === "popScore") {
      return sortConfig.order === "desc" ? b.popScore - a.popScore : a.popScore - b.popScore;
    } else if (sortConfig.key === "totalLikes") {
      return sortConfig.order === "desc" ? b.totalLikes - a.totalLikes : a.totalLikes - b.totalLikes;
    } else if (sortConfig.key === "followers") {
      return sortConfig.order === "desc" ? b.followers - a.followers : a.followers - b.followers;
    }
    return 0;
  });
  const handleSortChange = (e) => {
    const [key, order] = e.target.value.split("-");
    setSortConfig({ key, order });
  };
  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      {/* Dropdown for selecting the metric */}
      <select
        className="sort-dropdown"
        value={sortConfig.key}
        onChange={(e) => setSortConfig((prev) => ({ ...prev, key: e.target.value }))}
      >
        <option value="popScore">Popularity Score</option>
        <option value="totalLikes">Total Likes</option>
        <option value="followers">Followers</option>

      </select>
  
      {/* Toggle button for sorting order */}
      <button
        className="sort-toggle"
        onClick={() =>
          setSortConfig((prev) => ({
            ...prev,
            order: prev.order === "asc" ? "desc" : "asc",
          }))
        }
      >
      {sortConfig.order === "asc" ? "↑" : "↓"}      </button>
  
      {sortedLeaderboard.length === 0 ? (
        <p className="loading-message">Loading leaderboard...</p>
      ) : (
        sortedLeaderboard.map((entry, index) => (
          <div
            key={index}
            className={`leaderboard-item ${entry.name === username ? "highlight" : ""}`}
          >
            <p className="name">{`${index + 1}. ${entry.name}`}</p>
            <p className="score">
              {sortConfig.key === "popScore" && `${entry.popScore.toFixed(1)}`}
              {sortConfig.key === "totalLikes" && `${entry.totalLikes}`}
              {sortConfig.key === "followers" && `${entry.followers}`}
            </p>
          </div>
        ))
      )}
    </div>
  );
  
  
  
  
  
}
export default Leaderboard;