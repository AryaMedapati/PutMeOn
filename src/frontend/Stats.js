import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./TopTracks";
import Artists from "./TopArtists";
import Genres from "./TopGenres";
import "./styles/Stats.css";

const Stats = () => {
  return (
    <div>
      <nav>
        {/* <button> */}
          <Link to="/toptracks">TopTracks</Link>
          <Link to="/topartists">TopArtists</Link>
          <Link to="/topgenres">TopGenres</Link>
        {/* </button> */}
      </nav>
      <Routes>
        <Route path="/toptracks" element={<Tracks/>} />
        <Route path="/topartists" element={<Artists/>} />
        <Route path="/topgenres" element={<Genres/>} />
      </Routes>
    </div>
  );
};

export default Stats;
