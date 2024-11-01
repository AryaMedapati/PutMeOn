import React, { useState, useEffect, useContext } from "react";
import localstorage from "localstorage-slim";
import { UserContext } from "../UserContext";

const CompareFriend = () => {
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [comparisonData, setComparisonData] = useState(null);
  const { email } = useContext(UserContext);

  useEffect(() => {
    const fetchFriends = async () => {
      const username = email || localstorage.get("user");
      if (username) {
        try {
          const res = await fetch("http://localhost:3001/fetchFriends", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          });
          const data = await res.json();
          setFriends(data.friends);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
    };

    fetchFriends();
  }, [email]);

  const isValidDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    return regex.test(date);
  };

  const handleCompare = async () => {
    if (!isValidDate(date)) {
      setErrorMessage("Incorrect format, please enter date in MM/DD/YYYY");
      return;
    }

    setErrorMessage("");
    if (selectedFriend) {
      try {
        const userReportRes = await fetch(
          "http://localhost:3001/generateReport",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: email || localstorage.get("user"),
              time: date,
            }),
          }
        );
        const userReportData = await userReportRes.json();

        const friendReportRes = await fetch(
          "http://localhost:3001/generateReport",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: selectedFriend, time: date }),
          }
        );
        const friendReportData = await friendReportRes.json();

        setComparisonData({
          user: userReportData,
          friend: friendReportData,
        });
        console.log(comparisonData);
      } catch (error) {
        console.error("Error generating report:", error);
      }
    }
  };

  return (
    <div>
      <h2>Compare Friends</h2>
      <select
        onChange={(e) => setSelectedFriend(e.target.value)}
        value={selectedFriend}
      >
        <option value="">Select a friend</option>
        {friends.map((friend) => (
          <option key={friend} value={friend}>
            {friend}
          </option>
        ))}
      </select>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter date (MM/DD/YYYY)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
      </div>
      <button onClick={handleCompare}>Compare Listening Stats</button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {comparisonData && (
        <div>
          <h3>Comparison Report</h3>
          <h4>Total Listening Time</h4>
          <p>{comparisonData.user.totalTime} minutes (You)</p>
          <p>
            {comparisonData.friend.totalTime} minutes ({selectedFriend})
          </p>

          <h5>Your Top Artists:</h5>
          <ul>
            {comparisonData.user.artistMap.slice(0, 5).map((artist) => (
              <li key={artist.artistId}>
                {artist.name}: {artist.count} listens
              </li>
            ))}
          </ul>

          <h5>{selectedFriend}'s Top Artists:</h5>
          <ul>
            {comparisonData.friend.artistMap.slice(0, 5).map((artist) => (
              <li key={artist.artistId}>
                {artist.name}: {artist.count} listens
              </li>
            ))}
          </ul>

          <h5>Your Top Tracks:</h5>
          <ul>
            {comparisonData.user.trackMap.slice(0, 5).map((track) => (
              <li key={track.trackId}>
                {track.track_name}: {track.count} listens
              </li>
            ))}
          </ul>

          <h5>{selectedFriend}'s Top Tracks:</h5>
          <ul>
            {comparisonData.friend.trackMap.slice(0, 5).map((track) => (
              <li key={track.trackId}>
                {track.track_name}: {track.count} listens
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompareFriend;
