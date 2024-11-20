import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./TopTracks";
import Artists from "./TopArtists";
import Genres from "./TopGenres";
import GV from "./GenreVisual";
import TH from "./TrackVisual";
import AH from "./ArtistVisual";
import "../styles/Stats.css";

const Stats = () => {
  return (
    <div className="stats-container">
      <nav className="navbar">
        <div className="logo">
          <h1>Music Stats</h1>
        </div>
        <div className="nav-links">
          <Link to="/toptracks" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">🎵</span>Top Tracks
            </div>
          </Link>
          <Link to="/topartists" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">🎤</span>Top Artists
            </div>
          </Link>
          <Link to="/topgenres" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">🎧</span>Top Genres
            </div>
          </Link>
          <Link to="/genrevis" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">📊</span>Genre Visual
            </div>
          </Link>
          <Link to="/trackvis" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">🔊</span>Track Visual
            </div>
          </Link>
          <Link to="/artistvis" className="nav-link">
            <div className="nav-item">
              <span className="nav-icon">👤</span>Artist Visual
            </div>
          </Link>
        </div>
      </nav>

      <div className="content-container">
        <Routes>
          <Route path="/toptracks" element={<Tracks />} />
          <Route path="/topartists" element={<Artists />} />
          <Route path="/topgenres" element={<Genres />} />
          <Route path="/genrevis" element={<GV />} />
          <Route path="/trackvis" element={<TH />} />
          <Route path="/artistvis" element={<AH />} />
        </Routes>
      </div>
    </div>
  );
};

export default Stats;
