import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import Playlists from "./Playlists";

const Home = () => {
  const location = useLocation();
  let passIn2 = "";
  if (location.state) {
    passIn2 = location.state.user;
  }
  console.log(passIn2);
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <p>This is the main page of your Firebase React application.</p>
      <Routes>
      <Route path="/playlists" element={<Playlists user = {passIn2}/>} />
      </Routes>
      
    </div>
  );
};

export default Home;