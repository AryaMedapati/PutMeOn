import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./TopTracks";
import Artists from "./TopArtists";
import "./styles/Stats.css";

const Stats = () => {
  return (
    <div>
      <nav>
        {/* <button> */}
          <Link to="/toptracks">TopTracks</Link>
          <Link to="/topartists">TopArtists</Link>
        {/* </button> */}
      </nav>
      <Routes>
        <Route path="/toptracks" element={<Tracks/>} />
        <Route path="/topartists" element={<Artists/>} />
      </Routes>
    </div>
  );
};

export default Stats;
