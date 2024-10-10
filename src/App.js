import logo from "./logo.svg";
import "./App.css";
import { app } from "./firebase";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import { IoStatsChartOutline, IoStatsChart } from "react-icons/io5";
import { GoHome, GoHomeFill } from "react-icons/go";
import { TbMessageCircle, TbMessageCircleFilled } from "react-icons/tb";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { PiPlaylist, PiPlaylistFill } from "react-icons/pi";

import Home from "./Home";
import Stats from "./Stats";
import Messages from "./Messages";
import Playlists from "./Playlists";
import Profile from "./Profile";
import Login from "./Login";
import CreateAccount from "./CreateAccount";

function App(props) {

  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isStatHovered, setIsStatHovered] = useState(false);
  const [isPlayHovered, setIsPlayHovered] = useState(false);
  const [isMesHovered, setIsMesHovered] = useState(false);
  const [isProfHovered, setIsProfHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null);


  const {location} = useLocation();
  const nav = useNavigate();
 
  useEffect(() => {
    // Confirm Firebase is initialized
    console.log("Firebase App:", app);
    if (location == null) {
      nav("/login");
    }
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is logged in
        setIsLoggedIn(true);
        setUser(currentUser); // Store user information if needed
      } else {
        // User is logged out
        setIsLoggedIn(false);
        setUser(null);
      }

      // Testing purposes, delete later
      // setIsLoggedIn(true);
      // setUser("dummy");

    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

    return (
      <div>
        {window.location.pathname !== '/login' && window.location.pathname !== '/create-account' && (<nav>
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
                <Link to="/playlists">
                  <div
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
              </nav>)
                }

        <Routes>

          <Route path="/stats" element={<Stats />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={isLoggedIn ? <Profile user={user} /> : <CreateAccount />}
          />
          
        </Routes>
       </div>
    );

  
}

export default App;
