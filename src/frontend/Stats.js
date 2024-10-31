import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./statistics/TopTracks";
import Artists from "./statistics/TopArtists";
import Genres from "./statistics/TopGenres";
import GV from "./statistics/GenreVisual";
import TH from "./statistics/TrackVisual";
import AH from "./statistics/ArtistVisual";
import PStat from "./statistics/PutMeOnStats";
import "./styles/Stats.css";

const Stats = () => {
  return (
    <div>
      <nav>
        {/* <button> */}
        <Link to="/toptracks">TopTracks</Link>
        <Link to="/topartists">TopArtists</Link>
        <Link to="/topgenres">TopGenres</Link>
        <Link to="/genrevis">GenreVisual</Link>
        <Link to="/trackvis">TrackVisual</Link>
        <Link to="/artistvis">ArtistVisual</Link>
        <Link to="/customstats">PutMeOnStats</Link>
        {/* </button> */}
      </nav>
      <Routes>
        <Route path="/toptracks" element={<Tracks />} />
        <Route path="/topartists" element={<Artists />} />
        <Route path="/topgenres" element={<Genres />} />
        <Route path="/genrevis" element={<GV />} />
        <Route path="/trackvis" element={<TH />} />
        <Route path="/artistvis" element={<AH />} />
        <Route path="/customstats" element={<PStat />} />
      </Routes>
    </div>
  );
};

export default Stats;
