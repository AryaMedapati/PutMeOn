import {React, useEffect, useState, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";
import "./styles/Home.css";
import localstorage from 'localstorage-slim';


const Home = () => {


  const location = useLocation();
  
  let passIn2 = "";
  const [info, setInfo] = useState([]);

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
  if (location.state) {
    passIn2 = location.state.user;
  }
  const friends = ["test3@email.com", "test4@email.com", "test2@email.com"];
  async function getReady() {
    const tracks =[]
    for(let i = 0; i < friends.length; i++) {
      const user = friends[i];
      let track = await getRecentlyPlayed(user);
      console.log(track);
      tracks.push(track);
      console.log(tracks);
  
    }
    setInfo(tracks)
  }
  useEffect(() => {
    getReady();
  }, [])

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
        <h1 className="header1">My Friends</h1>
        <div className="track-list">

            {info.map((track, index) => {
                const artistName = track ? track.track.album.artists[0].name : "Error";
                // console.log(artistName);
                const timeSinceListened = getTimeSincePlayed(track.played_at);

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