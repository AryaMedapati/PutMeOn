import { React, useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  Switch,
} from "react-router-dom";
import Playlists from "./Playlists";
import Leaderboard from "./Leaderboard";
import Poll from "./Poll";
import Quiz from "./Quiz";
import Global from "./Global";
import "./styles/Home.css";
import localstorage from "localstorage-slim";
import { GiConsoleController } from "react-icons/gi";
import { FaGlobe, FaTrophy, FaPoll } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";

const Home = () => {
  const location = useLocation();
  const nav = useNavigate();
  let passIn2 = "";
  const [info, setInfo] = useState([]);
  const [friends, setFriends] = useState([]);
  const [liked, setLiked] = useState(false);
  const [laughingLiked, setLaughingLiked] = useState(false);
  const [fireLiked, setFireLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [currentLaughingLikes, setCurrentLaughingLikes] = useState([]);
  const [currentFireLikes, setCurrentFireLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsStatus, setCommentsStatus] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [likedBy, setLikedBy] = useState([]);
  const [laughingLikedBy, setLaughingLikedBy] = useState([]);
  const [fireLikedBy, setFireLikedBy] = useState([]);
  const [likedStatus, setLikedStatus] = useState([]);
  const [laughingLikedStatus, setLaughingLikedStatus] = useState([]);
  const [fireLikedStatus, setFireLikedStatus] = useState([]);
  const [totalLikes, setTotalLikes] = useState(Array(friends.length).fill(0));
  const [totalReactions, setTotalReactions] = useState(
    Array(friends.length).fill(0)
  );
  const [totalComments, setTotalComments] = useState(
    Array(friends.length).fill(0)
  );
  const [loading, setLoading] = useState(true);

  // const [emojiLikes, setEmojiLikes] = useState([]);
  // const emojis = ['😀', '😢', '😍', '😂', '😎', '🤔'];

  // const [likes, setLikes] = useState(0);
  const username = localstorage.get("user");
  async function getRecentlyPlayed(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(`${url}/recentlyPlayed?user=${user}`);
    const data = await response.json();
    // console.log(data);
    return data.data.items[0];
  }
  async function getSaved(
    user,
    i,
    currentLikesTemp,
    likedByTemp,
    currentLaughingLikesTemp,
    laughingLikedByTemp,
    currentFireLikesTemp,
    fireLikedByTemp,
    commentsTemp,
    totalLikesTemp,
    totalReactionsTemp,
    totalCommentsTemp
  ) {
    const url = "http://localhost:3001";
    const response = await fetch(`${url}/getRecentlyPlayed?user=${user}`);
    const data = await response.json();
    currentLikesTemp[i] = data.currentLikes;
    setCurrentLikes(currentLikesTemp);
    totalLikesTemp[i] = data.totalLikes;
    setTotalLikes(totalLikesTemp);
    currentLaughingLikesTemp[i] = data.currentLaughingLikes;
    setCurrentLaughingLikes(currentLaughingLikesTemp);
    currentFireLikesTemp[i] = data.fire;
    setCurrentFireLikes(currentFireLikesTemp);
    totalReactionsTemp[i] = data.totalReactions;
    setTotalReactions(totalReactionsTemp);
    totalCommentsTemp[i] = data.totalComments;
    setTotalComments(totalCommentsTemp);
    likedByTemp[i] = data.likedBy;
    if (likedByTemp[i]) {
      setLikedBy(likedByTemp);
    } else {
      likedByTemp[i] = [];
      setLikedBy(likedByTemp);
    }
    laughingLikedByTemp[i] = data.laughingLikedBy;
    if (laughingLikedByTemp[i]) {
      setLaughingLikedBy(laughingLikedByTemp);
    } else {
      laughingLikedByTemp[i] = [];
      setLaughingLikedBy(laughingLikedByTemp);
    }
    fireLikedByTemp[i] = data.fireLikedBy;
    if (fireLikedByTemp[i]) {
      setFireLikedBy(fireLikedByTemp);
    } else {
      fireLikedByTemp[i] = [];
      setFireLikedBy(fireLikedByTemp);
    }
    commentsTemp[i] = data.comments || [];
    setComments(commentsTemp);

    // console.log(data);
    return data.recentlyPlayed;
  }
  if (location.state) {
    passIn2 = location.state.user;
  }
  const toggleLike = async (index) => {
    const userLiked = likedBy[index]?.includes(username);

    if (userLiked) {
      setLiked(false);
      handleLike2(index);
    } else {
      setLiked(true);
      handleLike(index);
    }
    const updatedLikedStatus = likedStatus;
    updatedLikedStatus[index] = !userLiked;
    setLikedStatus(updatedLikedStatus);
  };
  const toggleLaughingLike = (index) => {
    const userLiked = laughingLikedBy[index]?.includes(username);

    if (userLiked) {
      setLaughingLiked(false);
      handleLaughingLike2(index);
    } else {
      setLaughingLiked(true);
      handleLaughingLike(index);
    }
    const updatedLikedStatus = laughingLikedStatus;
    updatedLikedStatus[index] = !userLiked;
    setLaughingLikedStatus(updatedLikedStatus);
  };
  const toggleFireLike = (index) => {
    const userLiked = fireLikedBy[index]?.includes(username);

    if (userLiked) {
      setFireLiked(false);
      handleFireLike2(index);
    } else {
      setFireLiked(true);
      handleFireLike(index);
    }
    const updatedLikedStatus = fireLikedStatus;
    updatedLikedStatus[index] = !userLiked;
    setFireLikedStatus(updatedLikedStatus);
  };
  useEffect(() => {
    const initialLikedStatus = likedBy.map((likedByUsers) =>
      likedByUsers.includes(username)
    );
    setLikedStatus(initialLikedStatus);
  }, [likedBy]);
  useEffect(() => {
    const initialLaughingLikedStatus = laughingLikedBy.map((likedByUsers) =>
      likedByUsers.includes(username)
    );
    setLikedStatus(initialLaughingLikedStatus);
  }, [laughingLikedBy]);
  useEffect(() => {
    const initialFireLikedStatus = fireLikedBy.map((likedByUsers) =>
      likedByUsers.includes(username)
    );
    setLikedStatus(initialFireLikedStatus);
  }, [fireLikedBy]);
  useEffect(() => {
    const initialComments = comments.map((likedByUsers) =>
      likedByUsers.includes(username)
    );
    setCommentsStatus(initialComments);
  }, [fireLikedBy]);

  // const friends = ["test3@email.com", "test4@email.com", "test2@email.com"];
  async function getReady(friendsList) {
    const tracks = [];
    const tempCurrentLikes = currentLikes;
    const tempLikedBy = likedBy;
    const tempCurrentLaughingLikes = currentLaughingLikes;
    const tempLaughingLikedBy = laughingLikedBy;
    const tempCurrentFireLikes = currentFireLikes;
    const tempFireLikedBy = fireLikedBy;
    const commentsTemp = comments;
    const totalLikesTemp = totalLikes;
    const totalReactionsTemp = totalReactions;
    const totalCommentsTemp = totalComments;
    console.log(tempCurrentLikes);

    console.log(friendsList);
    for (let i = 0; i < friendsList.length; i++) {
      const user = friendsList[i];
      let track = await getRecentlyPlayed(user);
      console.log(track);
      tracks.push(track);
      console.log(tracks);
      const savedTrack = await getSaved(
        friendsList[i],
        i,
        tempCurrentLikes,
        tempLikedBy,
        tempCurrentLaughingLikes,
        tempLaughingLikedBy,
        tempCurrentFireLikes,
        tempFireLikedBy,
        commentsTemp,
        totalLikesTemp,
        totalReactionsTemp,
        totalCommentsTemp
      );
      console.log(savedTrack);
      console.log(track.track.id);
      if (savedTrack != track.track.id) {
        const tempTotalLikes = totalLikes;
        tempTotalLikes[i] += tempCurrentLikes[i];
        setTotalLikes(tempTotalLikes);
        tempCurrentLikes[i] = 0;
        const tempTotalReactions = totalReactions;
        tempTotalReactions[i] +=
          tempCurrentLaughingLikes[i] + tempCurrentFireLikes[i];
        setTotalReactions(tempTotalReactions);
        const tempTotalComments = totalComments;
        tempTotalComments[i] += comments[i].length;
        setTotalComments(tempTotalComments);
        tempCurrentLaughingLikes[i] = 0;
        tempCurrentFireLikes[i] = 0;
        setCurrentLikes(tempCurrentLikes);
        setCurrentLaughingLikes(tempCurrentLaughingLikes);
        setCurrentFireLikes(tempCurrentFireLikes);
        const tempLikedBy2 = likedBy || [];
        tempLikedBy2[i] = [];
        const tempLaughingLikedBy2 = laughingLikedBy || [];
        tempLaughingLikedBy2[i] = [];
        const tempFireLikedBy2 = fireLikedBy || [];
        tempFireLikedBy2[i] = [];
        const tempComments = comments || [];
        tempComments[i] = [];
        setComments(tempComments);
        setLikedBy(tempLikedBy2);
        setLaughingLikedBy(tempLaughingLikedBy2);
        setFireLikedBy(tempFireLikedBy2);
      }
      saveRecentlyPlayed(
        friendsList[i],
        track.track.id,
        currentLikes[i],
        likedBy[i],
        currentLaughingLikes[i],
        laughingLikedBy[i],
        currentFireLikes[i],
        fireLikedBy[i],
        comments[i],
        totalLikes[i],
        totalReactions[i],
        totalComments[i]
      );
    }
    setInfo(tracks);
    if (friendsList.length == 0) {
      document.getElementById("nofriends").innerHTML = "Please add friends.";
    }
    setLoading(false);
  }
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
      return data.friends;
    } catch (error) {
      console.error(error);
    }
  };
  async function saveRecentlyPlayed(
    userName,
    song,
    currentLikesUser,
    likedByT,
    currentLaughingLikesUser,
    laughingLikedBy,
    currentFireLikesUser,
    fireLikedBy,
    comments,
    totalLikes,
    totalReactions,
    totalComments
  ) {
    // console.log(currentLikes);
    console.log(likedByT);
    console.log(laughingLikedBy);
    try {
      const res = await fetch(`http://localhost:3001/saveRecentlyPlayed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userName,
          song: song,
          likes: currentLikesUser,
          likedBy: likedByT,
          laughing: currentLaughingLikesUser,
          laughingLikedBy: laughingLikedBy,
          fire: currentFireLikesUser,
          fireLikedBy: fireLikedBy,
          comments: comments,
          totalLikes: totalLikes,
          totalReactions: totalReactions,
          totalComments: totalComments,
        }),
      });
      // const data = await res.json();
      // console.log(data);
      // setFriends(data.friends);
      // console.log(friends);
      // return data.friends
    } catch (error) {
      console.error(error);
    }
  }
  const handleLike = (index) => {
    if (!likedBy[index].includes(username)) {
      console.log(index);
      const updatedLikes = currentLikes;
      updatedLikes[index]++;
      setCurrentLikes(updatedLikes);
      const likedByTemp = likedBy;
      likedByTemp[index].push(username);
      console.log(likedByTemp[index]);
      console.log(laughingLikedBy[index]);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        updatedLikes[index],
        likedByTemp[index],
        currentLaughingLikes[index],
        laughingLikedBy[index],
        currentFireLikes[index],
        fireLikedBy[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };

  const handleLike2 = (index) => {
    if (likedBy[index].includes(username)) {
      const updatedLikes = currentLikes;
      updatedLikes[index]--;
      setCurrentLikes(updatedLikes);
      const likedByTemp = likedBy;
      likedByTemp[index] = likedByTemp[index].filter(
        (user) => user !== username
      );
      // setLikedBy(likedByTemp);
      console.log(likedByTemp[index]);
      setLikedBy(likedByTemp);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        updatedLikes[index],
        likedByTemp[index],
        currentLaughingLikes[index],
        laughingLikedBy[index],
        currentFireLikes[index],
        fireLikedBy[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };

  const handleLaughingLike = (index) => {
    if (!laughingLikedBy[index].includes(username)) {
      console.log(index);
      const updatedLikes = currentLaughingLikes;
      updatedLikes[index]++;
      setCurrentLaughingLikes(updatedLikes);
      const likedByTemp2 = laughingLikedBy;
      likedByTemp2[index].push(username);
      console.log(currentLikes);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        currentLikes[index],
        likedBy[index],
        updatedLikes[index],
        likedByTemp2[index],
        currentFireLikes[index],
        fireLikedBy[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };
  const handleLaughingLike2 = (index) => {
    if (laughingLikedBy[index].includes(username)) {
      const updatedLikes = currentLaughingLikes;
      updatedLikes[index]--;
      setCurrentLaughingLikes(updatedLikes);
      const likedByTemp = laughingLikedBy;
      likedByTemp[index] = likedByTemp[index].filter(
        (user) => user !== username
      );
      setLaughingLikedBy(likedByTemp);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        currentLikes[index],
        likedBy[index],
        updatedLikes[index],
        likedByTemp[index],
        currentFireLikes[index],
        fireLikedBy[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };
  const handleFireLike = (index) => {
    if (!fireLikedBy[index].includes(username)) {
      console.log(index);
      const updatedLikes = currentFireLikes;
      updatedLikes[index]++;
      setCurrentFireLikes(updatedLikes);
      const likedByTemp3 = fireLikedBy;
      likedByTemp3[index].push(username);
      console.log(currentLikes);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        currentLikes[index],
        likedBy[index],
        currentLaughingLikes[index],
        laughingLikedBy[index],
        updatedLikes[index],
        likedByTemp3[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };
  const handleFireLike2 = (index) => {
    if (fireLikedBy[index].includes(username)) {
      const updatedLikes = currentFireLikes;
      updatedLikes[index]--;
      setCurrentFireLikes(updatedLikes);
      const likedByTemp3 = fireLikedBy;
      likedByTemp3[index] = likedByTemp3[index].filter(
        (user) => user !== username
      );
      setFireLikedBy(likedByTemp3);
      saveRecentlyPlayed(
        friends[index],
        info[index].track.id,
        currentLikes[index],
        likedBy[index],
        currentLaughingLikes[index],
        laughingLikedBy[index],
        updatedLikes[index],
        likedByTemp3[index],
        comments[index],
        totalLikes[index],
        totalReactions[index],
        totalComments[index]
      );
    }
  };
  const saveNewComment = (index) => {
    console.log(index);
    console.log(newComment);
    const tempComments = [...comments] || [];
    if (!tempComments[index]) {
      tempComments[index] = [];
    }
    console.log(tempComments);
    const newVal = username + ": " + newComment;
    tempComments[index].push(newVal);
    setComments(tempComments);
    setNewComment("");
    setShowCommentInput(false);
    saveRecentlyPlayed(
      friends[index],
      info[index].track.id,
      currentLikes[index],
      likedBy[index],
      currentLaughingLikes[index],
      laughingLikedBy[index],
      currentFireLikes[index],
      fireLikedBy[index],
      comments[index],
      totalLikes[index],
      totalReactions[index],
      totalComments[index]
    );
  };
  const handleComment = (e) => {
    setNewComment(e.target.value);
  };
  const handleLeaderboard = () => {
    nav("/leaderboard");
  };
  const handlePoll = () => {
    nav("/polls");
  };
  const handleQuiz = () => {
    nav("/quiz");
  };
  const handleGlobal = () => {
    nav("/global");
  };
  useEffect(() => {
    const fetchAndSetData = async () => {
      const friendsList = await fetchFriendsList();
      console.log(friendsList);
      // const initialLikedBy = Array(friendsList.length).fill([]);
      // setLiked(initialLikedBy);
      setFriends(friendsList);
      getReady(friendsList);
    };
    fetchAndSetData();
  }, []);
  // useEffect(() => {
  //   console.log(friends);
  // }, [friends]);

  // console.log(passIn2);
  function getTimeSincePlayed(timestamp) {
    const playedDate = new Date(timestamp);
    const now = new Date();

    const secondsAgo = Math.floor((now - playedDate) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`;
    } else {
      return `${hoursAgo} hours ago`;
    }
  }
  const handleViewProfile = () => {
    const friendUser = document.getElementById("friend-id").innerHTML;
    nav(`/profile/${friendUser}`);
  };

  // console.log(info);
  return (
    <div>
      <h1 className="header1" id="nofriends">
        My Friends
      </h1>
      <div className="button-container">
        <button className="icon-button" onClick={handleGlobal}>
          <FaGlobe />
        </button>
        <button className="icon-button" onClick={handleLeaderboard}>
          <FaTrophy />
        </button>
        <button className="icon-button" onClick={handlePoll}>
          <FaPoll />
        </button>
        <button className="icon-button" onClick={handleQuiz}>
          <MdQuiz />
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="track-list">
          {info.map((track, index) => {
            const artistName = track
              ? track.track.album.artists[0].name
              : "Error";
            // console.log(artistName);
            const timeSinceListened = getTimeSincePlayed(track.played_at);
            const userLiked = likedBy[index]?.includes(username);
            const userLaughingLiked =
              laughingLikedBy[index]?.includes(username);
            const userFireLiked = fireLikedBy[index]?.includes(username);

            return (
              <div className="track-activity" key={index}>
                <div
                  className="friend"
                  id="friend-id"
                  onClick={handleViewProfile}
                >
                  {friends[index]}
                </div>
                <div className="album-cover">
                  <img src={track.track.album.images[0].url} alt="Error" />
                </div>
                <div className="track-name">
                  {track ? track.track.name : "Error"}
                </div>
                <div className="listening-info">
                  <div className="artist">{artistName}</div>
                  <div className="album">
                    {track ? track.track.album.name : "Error"}
                  </div>
                </div>
                <div className="time">{timeSinceListened}</div>
                <div className="interaction-buttons">
                  <button
                    className={`like-button ${userLiked ? "liked" : ""}`}
                    onClick={() => toggleLike(index)}
                  >
                    {userLiked ? "❤️" : "❤️"} {currentLikes[index]}
                  </button>
                  <button
                    className={`like-button ${
                      userLaughingLiked ? "liked" : ""
                    }`}
                    onClick={() => toggleLaughingLike(index)}
                  >
                    {userLaughingLiked ? "😂" : "😂"}{" "}
                    {currentLaughingLikes[index]}
                  </button>
                  <button
                    className={`like-button ${userFireLiked ? "liked" : ""}`}
                    onClick={() => toggleFireLike(index)}
                  >
                    {userFireLiked ? "🔥" : "🔥"} {currentFireLikes[index]}
                  </button>
                  {/* <button
                    className="comment-button"
                    onClick={() => saveNewComment(index)}
                >
                    Comment
                </button> */}
                </div>
                <div className="comment-section">
                  <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                  >
                    {showCommentInput ? "Cancel" : "Comment"}
                  </button>
                  {showCommentInput && (
                    <div>
                      <input
                        type="text"
                        value={newComment}
                        onChange={handleComment}
                        placeholder="Type your comment here..."
                      />
                      <button onClick={() => saveNewComment(index)}>
                        Submit
                      </button>
                    </div>
                  )}
                  <div className="comments-list">
                    {comments[index] &&
                      comments[index].map((comment, commentIndex) => (
                        <div key={commentIndex}>{comment}</div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Routes>
        <Route path="/playlists" element={<Playlists user={passIn2} />} />
        <Route path="/leaderboard" element={<Leaderboard />}></Route>
        <Route path="/global" element={<Global />}></Route>
        <Route path="/polls" element={<Poll />}></Route>
        <Route path="/quiz" element={<Quiz />}></Route>
      </Routes>
    </div>
  );
};

export default Home;
