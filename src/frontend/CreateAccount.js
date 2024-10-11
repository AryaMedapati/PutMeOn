import React, { useState, useEffect } from "react"
import "./styles/Login.css"
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import Login from "./Login";

function CreateAccount() {

  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [isPrivate, setIsPrivate] = useState(false); // State to manage account visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const nav = useNavigate();


  const handleUser = (e) => {
    const inputUser = e.target.value;
    setUserName(inputUser);
    if (userName.search("@") == -1){
      setErrorMessage2(
        "Please enter a valid email address."
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

  const handleCheckboxChange = () => {
    setIsPrivate((prevValue) => !prevValue);
  };

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

      const returnVal = await fetch("http://localhost:3001/fetchUsers");
      const users = await returnVal.json();
      let track = false;
      for (let i = 0; i < users.length; i++) {
        if(users[i].username === userName) {
          track = true;
        }

      const res = await fetch("http://localhost:3001/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: pass,
          isPrivate: isPrivate,
        }),
      });


      }
      if (track) {
        document.getElementById("error-message").innerHTML = "Account already exists with email."
      }
      else {
        const res = await fetch("http://localhost:3001/insertUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            password: pass,
            isPublic: isPublic,
          }),
        });
        try {
          const auth = getAuth();
          createUserWithEmailAndPassword(auth, userName, pass)
            .then((userCredential) => {
              const user = userCredential.user;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
            nav("/", {user:userName})
        } catch (error) {
          console.log(error);
        }
      } 
    } catch (error) {
      console.log("Error: " + error)
    }
    
  }

  const handleSubmitWithGoogle = async(e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then (async(res) => {
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
              isPrivate: isPrivate,
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
      <form className="loginForm"  onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <div className="errorDiv">
          <p id="error-message"  className="error-message"></p>
        </div>
        <div className="userNameDiv">
          <label htmlFor="user" >Email</label>
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
        <div className="privacyDiv">
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={handleCheckboxChange}
            />
            Make my account private
          </label>
        </div>
        <button type="submit" onClick={handleSubmit} disabled={!!errorMessage || !!errorMessage}>Create Account</button>
        <div className="alreadyHaveAccount">
            <Link to =  "/login" >Already have an account? Log in</Link>
        </div>
        <div className="buttonDiv">
          <button type="submit" className = "gButton" onClick={handleSubmitWithGoogle}>Create Account with Google</button>
        </div>
        {/* <div className="buttonDiv">
          <button type="submit" className = "spoButton"onClick={handleSubmitWithSpotify}>Create Account with Spotify</button>
        </div> */}

        <Routes>
            <Route path = "../login" element = {<Login />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default CreateAccount