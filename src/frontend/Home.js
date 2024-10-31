import {React, useEffect, useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";
import "./styles/Home.css";
import localstorage from 'localstorage-slim';
import { GiConsoleController } from 'react-icons/gi';


const Home = () => {
  const location = useLocation();
  
  let passIn2 = "";
  const [info, setInfo] = useState([]);
  const[friends, setFriends] = useState([]);
  const [liked, setLiked] = useState(false);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [likedBy, setLikedBy] = useState([]);
  const [likedStatus, setLikedStatus] = useState([]);


  const [likes, setLikes] = useState(0);
  const username = localstorage.get('user');
  async function getRecentlyPlayed(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/recentlyPlayed?user=${user}`
    );
    const data = await response.json();
    // console.log(data);
    return data.data.items[0];
  };
  async function getSaved(user, i, temp, temp2) {

    const url = "http://localhost:3001";
    const response = await fetch(
      `${url}/getRecentlyPlayed?user=${user}`
    );
    const data = await response.json();
    temp[i] = data.currentLikes;
    setCurrentLikes(temp);
    temp2[i] = data.likedBy;
    if (temp2[i]) {
      console.log()
      setLikedBy(temp2);
    }
    else {
      temp2[i] = [];
      setLikedBy(temp2);

    }
      
    // console.log(data);
    return data.recentlyPlayed;
  }
  if (location.state) {
    passIn2 = location.state.user;
  }
  const toggleLike = (index) => {
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
  useEffect(() => {
    const initialLikedStatus = likedBy.map(likedByUsers => likedByUsers.includes(username));
    setLikedStatus(initialLikedStatus);
  }, [likedBy]);
  // const friends = ["test3@email.com", "test4@email.com", "test2@email.com"];
  async function getReady(friendsList) {
    const tracks =[]
    const tempCurrentLikes = currentLikes;
    const tempLikedBy = likedBy;
    console.log(tempCurrentLikes);

    console.log(friendsList);
    for(let i = 0; i < friendsList.length; i++) {
      const user = friendsList[i];
      let track = await getRecentlyPlayed(user);
      console.log(track);
      tracks.push(track);
      console.log(tracks);
      const savedTrack = await getSaved(friendsList[i], i, tempCurrentLikes, tempLikedBy);
      console.log(savedTrack);
      console.log(track.track.id);
      if (savedTrack != track.track.id) {
        tempCurrentLikes[i] = 0;
        setCurrentLikes(tempCurrentLikes);
      }
      saveRecentlyPlayed(friendsList[i], track.track.id, currentLikes[i], likedBy[i]);
    }
    setInfo(tracks);
    if (friendsList.length == 0) {
      document.getElementById("nofriends").innerHTML = "Please add friends.";
    }
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
      return data.friends
    } catch (error) {
      console.error(error);
    }
  };
  async function saveRecentlyPlayed (userName, song, currentLikesUser, likedBy) {
    console.log(currentLikes);
    try {
      const res = await fetch(`http://localhost:3001/saveRecentlyPlayed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userName, song: song, likes: currentLikesUser, likedBy:likedBy }),
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
  const handleLike = (index) => {
    if (!likedBy[index].includes(username)) {
      console.log(index);
      let updatedLikes = currentLikes;
      updatedLikes[index]++;
      setCurrentLikes(updatedLikes);
      let likedByTemp = likedBy;
      likedByTemp[index].push(username);
      console.log(currentLikes);
      saveRecentlyPlayed(friends[index], info[index].track.id, updatedLikes[index], likedByTemp[index]);
    }


  }
  const handleLike2 = (index) => {
    let updatedLikes = currentLikes;
    updatedLikes[index]--;
    setCurrentLikes(updatedLikes);
    const likedByTemp = likedBy;
    likedByTemp[index] = likedByTemp[index].filter(user => user !== username);
    setLikedBy(likedByTemp);
    saveRecentlyPlayed(friends[index], info[index].track.id, updatedLikes[index], likedByTemp[index]);

  }
  const handleComment = () => {

  }
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

  // console.log(info);
    return (
    <div>
        <h1 className="header1" id="nofriends">My Friends</h1>
        <div className="track-list">

            {info.map((track, index) => {
                const artistName = track ? track.track.album.artists[0].name : "Error";
                // console.log(artistName);
                const timeSinceListened = getTimeSincePlayed(track.played_at);
                const userLiked = likedBy[index]?.includes(username);

                return (
                    <div className="track-activity" key={index}>
                      <div className="friend">{friends[index]}</div>
                        <div className="album-cover"><img src={track.track.album.images[0].url} alt="Error"/></div>
                        <div className="track-name">{track ? track.track.name : "Error"}</div>
                        <div className="listening-info">
                            <div className="artist">{artistName}</div>
                            <div className="album">{track? track.track.album.name : "Error"}</div>
                        </div>
                        <div className="time">{timeSinceListened}</div>
                        <div className="interaction-buttons">
                <button
                    className={`like-button ${liked ? 'liked' : ''}`}
                    onClick={() =>toggleLike(index)}
                >
                    {userLiked ? '❤️' : '🤍'} {currentLikes[index]}
                </button>
                <button className="comment-button" onClick={() => handleComment(track.id)}>
                    Comment
                </button>
            </div>
                    </div>
                );
            })}
        </div>

      <Routes>
      <Route path="/playlists" element={<Playlists user = {passIn2}/>} />
      </Routes>
      
    </div>
  );
};

export default Home;