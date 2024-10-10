import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./TopTracks";
import "./styles/Stats.css";

const Stats = () => {
  return (
    <div>
      <nav>
        {/* <button> */}
          <Link to="/toptracks">TopTracks</Link>
        {/* </button> */}
      </nav>
      <Routes>
        <Route path="/toptracks" element={<Tracks/>} />
      </Routes>
    </div>
  );
};

export default Stats;
