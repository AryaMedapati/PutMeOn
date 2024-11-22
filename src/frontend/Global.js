import React, { useEffect, useState } from 'react';
import "./styles/Global.css";
import localstorage from 'localstorage-slim';

const Global = () => {
  const [averageScore, setAverageScore] = useState(null);
  const [averageLikes, setAverageLikes] = useState(null);
  const [averageFollowers, setAverageFollowers] = useState(null);
  const [averageReactions, setAverageReactions] = useState(null);
  const [averageComments, setAverageComments] = useState(null);

  const [curLikes, setCurLikes] = useState(null);
  const [curFollowers, setCurFollowers] = useState(null);
  const [curReactions, setCurReactions] = useState(null);
  const [curComments, setCurComments] = useState(null);

  const [percentDiff, setPercentDiff] = useState(null);
  const [likesDiff, setLikesDiff] = useState(null);
  const [followersDiff, setFollowersDiff] = useState(null);
  const [reactionsDiff, setReactionsDiff] = useState(null);
  const [commentsDiff, setCommentsDiff] = useState(null);

  const [curScore, setCurScore] = useState(null);
  const [error, setError] = useState(null);
  const user = localstorage.get("user");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        if (!user) {
          setError("User not found in local storage.");
          return;
        }
  
        const avgScore = await fetchAverage("calculateAveragePopularity");
        setAverageScore(avgScore);

        const avgLikes = await fetchAverage("calculateAverageLikes");
        setAverageLikes(avgLikes);

        const avgFollowers = await fetchAverage("calculateAverageFollowers");
        setAverageFollowers(avgFollowers);

        const avgReactions = await fetchAverage("calculateAverageReactions");
        setAverageReactions(avgReactions);

        const avgComments = await fetchAverage("calculateAverageComments");
        setAverageComments(avgComments);

        const currentUserScore = await getScore(user);
        const currentUserLikes = await getLikes(user);
        const currentUserFollowers = await getFollowers(user);
        const currentUserReactions = await getReactions(user);
        const currentUserComments = await getComments(user);

        setCurScore(currentUserScore);
        setCurLikes(currentUserLikes);
        setCurFollowers(currentUserFollowers);
        setCurReactions(currentUserReactions);
        setCurComments(currentUserComments);

        if (avgScore) setPercentDiff(((currentUserScore - avgScore) / avgScore) * 100);
        if (avgLikes) setLikesDiff(currentUserLikes - avgLikes);
        if (avgFollowers) setFollowersDiff(currentUserFollowers - avgFollowers);
        if (avgReactions) setReactionsDiff(currentUserReactions - avgReactions);
        if (avgComments) setCommentsDiff(currentUserComments - avgComments);

      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("Unable to load scores. Please try again later.");
      }
    };

    fetchScores();
  }, [user]);

  async function fetchAverage(endpoint) {
    const response = await fetch(`http://localhost:3001/${endpoint}`);
    const data = await response.json();
    return data.total || 0;
  }

  async function getScore(user) {
    return await fetchStat(user, "getPopScore", "popScore");
  }

  async function getLikes(user) {
    return await fetchStat(user, "getPopScore", "totalLikes");
  }

  async function getFollowers(user) {
    return await fetchStat(user, "getPopScore", "followers");
  }

  async function getReactions(user) {
    return await fetchStat(user, "getPopScore", "totalReactions");
  }

  async function getComments(user) {
    return await fetchStat(user, "getPopScore", "totalComments");
  }

  async function fetchStat(user, endpoint, key) {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/${endpoint}?user=${user}`);
    const data = await response.json();
    return data[key] || 0;
  }

  return (
    <div className="global-container">
      <h1>Global Statistics</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="stats-container">
          <StatCard
            title="Popularity Score"
            value={curScore ? curScore.toFixed(1) : "Loading..."}
            difference={percentDiff}
            unit="%"
            positiveMessage="Above"
            negativeMessage="Below"
            isPercentage={true}
          />
          <StatCard
            title="Total Likes Received"
            value={curLikes}
            difference={likesDiff}
            positiveMessage="More than"
            negativeMessage="Less than"
          />
          <StatCard
            title="Followers"
            value={curFollowers}
            difference={followersDiff}
            positiveMessage="More than"
            negativeMessage="Less than"
          />
          <StatCard
            title="Total Reactions Received"
            value={curReactions}
            difference={reactionsDiff}
            positiveMessage="More than"
            negativeMessage="Less than"
          />
          <StatCard
            title="Total Comments Received"
            value={curComments}
            difference={commentsDiff}
            positiveMessage="More than"
            negativeMessage="Less than"
          />
        </div>
      )}
    </div>
  );
  
};

const StatCard = ({
  title,
  value,
  difference,
  unit = "",
  positiveMessage,
  negativeMessage,
  isPercentage = false,
}) => (
  <div className="stat-card">
    <p>{title}: {value !== null ? value : "Loading..."}</p>
    {difference !== null ? (
      <>
        <p className={difference > 0 ? "positive" : "negative"}>
          {Math.abs(difference.toFixed(0))}{unit}
        </p>
        <p>
          {difference > 0 ? positiveMessage : negativeMessage} the global average
        </p>
      </>
    ) : (
      <p className="loading">Loading...</p>
    )}
  </div>
);

export default Global;
