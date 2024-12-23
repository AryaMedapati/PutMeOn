import logo from "./images/logo.svg";
import "./styles/App.css";
import { app } from "./firebase";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  Switch,
} from "react-router-dom";
import { IoStatsChartOutline, IoStatsChart } from "react-icons/io5";
import { GoHome, GoHomeFill } from "react-icons/go";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { PiPlaylist, PiPlaylistFill } from "react-icons/pi";
import localstorage from "localstorage-slim";

import Home from "./Home";
import Stats from "./statistics/Stats";
import Messages from "./Messages";
import Playlists from "./Playlists";
import NewPlaylist from "./NewPlaylist";
import Profile from "./Profile";
import Tracks from "./statistics/TopTracks";
import Artists from "./statistics/TopArtists";
import Genres from "./statistics/TopGenres";
import GV from "./statistics/GenreVisual";
import TH from "./statistics/TrackVisual";
import AH from "./statistics/ArtistVisual";
import PStat from "./statistics/PutMeOnStats";
import CompareFriend from "./statistics/CompareFriend";
import ShareStats from "./statistics/ShareStats";
import FriendProfileView from "./FriendProfileView";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import EditCollabPlaylist from "./EditCollabPlaylist";
import Leaderboard from "./Leaderboard";
import Global from "./Global";
import Poll from "./Poll";
import Quiz from "./Quiz";

function App(props) {
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isStatHovered, setIsStatHovered] = useState(false);
  const [isPlayHovered, setIsPlayHovered] = useState(false);
  const [isMesHovered, setIsMesHovered] = useState(false);
  const [isProfHovered, setIsProfHovered] = useState(false);

  const { location } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    // Confirm Firebase is initialized
    console.log("Firebase App:", app);
    if (props.user == null) {
      // props.user = "";
    }
    const storedUser = localstorage.get("user");
    const storedPass = localstorage.get("pass");

    console.log(storedUser);
    // if (storedLoggedIn) {
    //   setIsLoggedIn(true);
    // }
    // if (location == null) {
    //   nav("/login");
    // }
    if (!storedUser || storedUser == "") {
      nav("/login");
    }
  }, []);
  //  console.log(props.user);
  // console.log(location);
  let passIn = "";
  if (location) {
    // passIn = location.state.user;
    // console.log(passIn);
  }
  return (
    <div>
      {window.location.pathname !== "/login" &&
        window.location.pathname !== "/create-account" && (
          <nav>
            <Link to="/">
              <div
                onMouseEnter={() => setIsHomeHovered(true)}
                onMouseLeave={() => setIsHomeHovered(false)}
              >
                {isHomeHovered ? (
                  <GoHomeFill className="icon" />
                ) : (
                  <GoHome className="icon" />
                )}
              </div>
            </Link>
            <Link to="/stats">
              <div
                onMouseEnter={() => setIsStatHovered(true)}
                onMouseLeave={() => setIsStatHovered(false)}
              >
                {isStatHovered ? (
                  <IoStatsChart className="icon" />
                ) : (
                  <IoStatsChartOutline className="icon" />
                )}
              </div>
            </Link>
            <Link to={{ pathname: "/playlists" }}>
              <div
                id="playlistPage"
                onMouseEnter={() => setIsPlayHovered(true)}
                onMouseLeave={() => setIsPlayHovered(false)}
              >
                {isPlayHovered ? (
                  <PiPlaylistFill className="icon" />
                ) : (
                  <PiPlaylist className="icon" />
                )}
              </div>
            </Link>
            <Link to="/messages">
              <div
                onMouseEnter={() => setIsMesHovered(true)}
                onMouseLeave={() => setIsMesHovered(false)}
              >
                {isMesHovered ? (
                  <TbMessageCircleFilled className="icon" />
                ) : (
                  <TbMessageCircle className="icon" />
                )}
              </div>
            </Link>
            <Link to="/profile">
              <div
                id="profilePage"
                onMouseEnter={() => setIsProfHovered(true)}
                onMouseLeave={() => setIsProfHovered(false)}
              >
                {isProfHovered ? (
                  <FaUserCircle className="icon" />
                ) : (
                  <FaRegUserCircle className="icon" />
                )}
              </div>
            </Link>
          </nav>
        )}
      <Routes>
        <Route path="/stats" element={<Stats />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/new-playlist" element={<NewPlaylist />} />
        <Route
          path="/playlists/edit-collab-playlist"
          element={<EditCollabPlaylist />}
        />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/spotify" element={<Messages />} />
        <Route path="/toptracks" element={<Tracks />} />
        <Route path="/" element={<Home />} />
        <Route path="/topartists" element={<Artists />} />
        <Route path="/topgenres" element={<Genres />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/genrevis" element={<GV />} />
        <Route path="/trackvis" element={<TH />} />
        <Route path="/artistvis" element={<AH />} />
        <Route path="/customstats" element={<PStat />} />
        <Route path="/comparefriend" element={<CompareFriend />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/global" element={<Global />} />
        <Route path="/polls" element={<Poll />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/sharestats" element={<ShareStats />} />
        <Route path="/profile/:username" element={<FriendProfileView />} />
      </Routes>
    </div>
  );
}

export default App;
