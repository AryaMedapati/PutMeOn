import React, { useContext } from "react";
import "./styles/Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";

import {getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "./UserContext";
import CreateAccount from "./CreateAccount"

function Login() {
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();
  const { setUsername } = useContext(UserContext);

  const handleUser = (e) => {
    setUserName(e.target.value);
  }

  const handlePass = (e) => {
    setPass(e.target.value);
  }

  const checkUser = async (e) => {
    e.preventDefault();
    try {
      const returnVal = await fetch("http://localhost:3001/fetchUsers");
      const users = await returnVal.json();
      let track = false;
      for (let i = 0; i < users.length; i++) {
        if(users[i].username === username && users[i].password === pass) {
          track = true;

          try {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, username, pass)
              .then((userCredential) => {
                const user = userCredential.user;
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
              });
              nav("/", {user:users[i]})
            } catch (error) {
              console.log(error);
            }
          }

          setUsername(username);
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
    setUsername(auth.currentUser.email);
    signInWithPopup(auth, provider)
      .then (async (res) => {
        const cred = GoogleAuthProvider.credentialFromResult(res);
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
        {/* <div className="buttonDiv">
          <button type="submit" className = "spoButton"onClick={handleSubmitWithSpotify}>Login with Spotify</button>
        </div> */}
        <Routes>
            <Route path = "/create-account" element = {<CreateAccount />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default Login