import {React, useEffect, useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";
import "./styles/Home.css";
import localstorage from 'localstorage-slim';


const Home = () => {


  const location = useLocation();
  let passIn2 = "";
  const info = [];

  async function getRecentlyPlayed(user) {
    const url = "http://localhost:3001";
    // const url = "https://put-me-on-418b7.web.app";
    const response = await fetch(
      `${url}/recentlyPlayed?user=${user}`
    );
    const data = await response.json();
    info.push(data.data.items[0].track);
    // console.log(data.data.items[0].track);
  };
  if (location.state) {
    passIn2 = location.state.user;
  }
  const friends = ["test3@email.com", "test4@email.com"];
  for(let i = 0; i < friends.length; i++) {
    const user = friends[i];
    getRecentlyPlayed(user);
  }
  // console.log(info);
  const friendsListeningActivity = [
    {
      name: 'Alice',
      song: 'Blinding Lights',
      artist: 'The Weeknd',
      time: '10 minutes ago',
    },
    {
      name: 'Bob',
      song: 'Levitating',
      artist: 'Dua Lipa',
      time: '30 minutes ago',
    },
    {
      name: 'Charlie',
      song: 'Shape of You',
      artist: 'Ed Sheeran',
      time: '1 hour ago',
    },
    // Add more friends' activities as needed
  ];
  console.log(passIn2);
  const getTimeSinceListened = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    return `${hours} hours ago`;
};
  console.log(info);
    return (
    <div>
        <div className="track-list">
            <h1>Recently Played Tracks</h1>
            {info.map((track, index) => {
                const artistName = track.album.artists[0].name;
                const timeSinceListened = getTimeSinceListened(track.listenedAt);

                return (
                    <div className="track-activity" key={index}>
                        <div className="track-name">{track.name}</div>
                        <div className="listening-info">
                            <span className="artist">{artistName}</span> from <span className="album">{track.album.name}</span>
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