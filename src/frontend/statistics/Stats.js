import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Tracks from "./TopTracks";
import Artists from "./TopArtists";
import Genres from "./TopGenres";
import GV from "./GenreVisual";
import TH from "./TrackVisual";
import AH from "./ArtistVisual";
import PStat from "./PutMeOnStats";
import CompareFriend from "./CompareFriend";
import "./../styles/Stats.css";

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
        <Link to="/comparefriend">CompareFriend</Link>
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
        <Route path="/comparefriend" element={<CompareFriend />} />
      </Routes>
    </div>
  );
};

export default Stats;
