import logo from "./logo.svg";
import "./App.css";
import { app } from "./firebase";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";

import Home from "./Home";
import Stats from "./Stats";
import Messages from "./Messages";
import Playlists from "./Playlists";
import Profile from "./Profile";

function App() {
  useEffect(() => {
    // Confirm Firebase is initialized
    console.log("Firebase App:", app);
  }, []);
  return (
    <Router>
      <nav>
        <Link
          to="/"
          style={{ color: "blue", textDecoration: "none", marginRight: "15px" }}
        >
          Home
        </Link>
        <Link
          to="/stats"
          style={{ color: "blue", textDecoration: "none", marginRight: "15px" }}
        >
          Statistics
        </Link>
        <Link
          to="/messages"
          style={{ color: "blue", textDecoration: "none", marginRight: "15px" }}
        >
          Messages
        </Link>
        <Link
          to="/playlists"
          style={{ color: "blue", textDecoration: "none", marginRight: "15px" }}
        >
          Playlists
        </Link>
        <Link
          to="/profile"
        >
          <div>
            <CgProfile className="icon"/>
          </div>
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
