import React from "react"
import "./Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import CreateAccount from "./CreateAccount"

function Login() {
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const handleUser = (e) => {
    setUserName(e.target.value);
  }

  const handlePass = (e) => {
    setPass(e.target.value);
  }

  const checkUser = async (e) => {
    e.preventDefault();
    console.log(1);
    try {
      const returnVal = await fetch("http://localhost:3001/fetchUsers");
      const users = await returnVal.json();
      let track = false;
      for (let i = 0; i < users.length; i++) {
        if(users[i].username === username && users[i].password === pass) {
          track = true;
          nav("/", {state:true});
        }
      }
      if (!track) {
        document.getElementById("error-message").innerHTML = "Incorrect email or password."
      }
      // console.log(users[0]);

    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmitWithGoogle = async(e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then (async (res) => {
        const cred = GoogleAuthProvider.credentialFromResult(res);
        try {
          const res = await fetch("http://localhost:3001/insertUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: auth.currentUser.email,
              password: "google",
              isPublic: isPublic,
            }),
          });
    
          const returnVal = await res.json();
          console.log(returnVal)
          nav("/");
        } catch (error) {
          console.log("Error: " + error)
        }
        // console.log(res.user);
        nav("/");
      }).catch((error) => {
        console.log(error);
      });
  }
  const handleSubmitWithSpotify = async(e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3001/spotify-login";
      //const returnVal = await res.json();
    // console.log(returnVal);
  }

  return(
    <div className="loginDiv">
      <form className="loginForm" onSubmit={checkUser}>
        <h2>Login</h2>
        <div className="errorDiv">
          <p id="error-message"  className="error-message"></p>
        </div>
        <div className="userNameDiv">
          <label htmlFor="user">Email</label>
          <input type = "text" id="user" name="user" required onChange={handleUser}></input>
        </div>
        <div className="passDiv">
          <label htmlFor="pass">Password</label>
          <input type = "text" id="pass" name="pass" required onChange={handlePass}></input>
        </div>
        <button type="submit">Login</button>
        <div className="alreadyHaveAccount">
            <Link to =  "/create-account" >Don't have an account? Sign up</Link>
        </div>
        <div className="buttonDiv">
          <button type="submit" className = "gButton" onClick={handleSubmitWithGoogle}>Login with Google</button>
        </div>
        <div className="buttonDiv">
          <button type="submit" className = "spoButton"onClick={handleSubmitWithSpotify}>Login with Spotify</button>
        </div>
        <Routes>
            <Route path = "/create-account" element = {<CreateAccount />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default Login