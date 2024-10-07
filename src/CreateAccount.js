import React, { useState, useEffect } from "react"
import "./Login.css"
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import Login from "./Login";

function CreateAccount() {

  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const nav = useNavigate();


  const handleUser = (e) => {
    const inputUser = e.target.value;
    setUserName(inputUser);
    if (userName.length < 8){
      setErrorMessage2(
        "Username must be at least 8 characters long."
      );
    } else {
      setErrorMessage2("");
    }
  }

  const handlePass = (e) => {
      const inputPassword = e.target.value;
      setPass(inputPassword);
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(inputPassword)) {
        setErrorMessage(
          "Password must be at least 8 characters long and include both letters and numbers."
        );
      } else {
        setErrorMessage("");
      }
  }

  const handleSubmit = async (e) => {
    console.log("good");
    e.preventDefault();
    // try {
    //   await fetch("http://localhost:3001/fetchUsers");
    //   console.log("inside");

    // } catch (error) {
    //   console.log(error);
    // }
    try {
      const res = await fetch("http://localhost:3001/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName, password: pass
        }),
      });

      const returnVal = await res.json();
      console.log(returnVal)
      nav("/");
    } catch (error) {
      console.log("Error: " + error)
    }
  
  }

  const handleSubmitWithGoogle = async(e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then ((res) => {
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
      <form className="loginForm"  onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="userNameDiv">
          <label htmlFor="user" >Username</label>
          <input type = "text" id="user" name="user" required onChange={handleUser}></input>
        </div>
        {errorMessage2 && (
            <p className="error-message">{errorMessage2}</p>
          )}
        <div className="passDiv">
          <label htmlFor="pass" onChange={handlePass}>Password</label>
          <input type = "text" id="pass" name="pass" required onChange={handlePass}></input>
        </div>
        {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
        <button type="submit" onClick={handleSubmit} disabled={!!errorMessage || !!errorMessage}>Create Account</button>
        <div className="alreadyHaveAccount">
            <Link to =  "/login" >Already have an account? Log in</Link>
        </div>
        <button type="submit" onClick={handleSubmitWithGoogle}>Create Account with Google</button>
        <button type="submit" onClick={handleSubmitWithSpotify}>Create Account with Spotify</button>

        <Routes>
            <Route path = "../login" element = {<Login />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default CreateAccount