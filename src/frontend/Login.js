import React, { useContext } from "react";
import "./styles/Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "./UserContext";
import localstorage from 'localstorage-slim';

import CreateAccount from "./CreateAccount";


let tempUser = "";

function Login() {
  const [username, setUserName] = useState(localStorage.getItem("username") || "");
  const [pass, setPass] = useState(localStorage.getItem("password") || "");
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("remember") || false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const nav = useNavigate();
  const { setUsername, setEmail } = useContext(UserContext);

  const handleUser = (e) => {
    setUserName(e.target.value);
  }

  const handlePass = (e) => {
    setPass(e.target.value);
  }

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    console.log(rememberMe);
  };

  const handleVerificationCodeInput = (e) => {
    setVerificationCode(e.target.value);
  };

  const closeModal = () => {
    setShowCodeInput(false);
  };

  const checkUser = async (e) => {
    e.preventDefault();
    try {
      const returnVal = await fetch("http://localhost:3001/fetchUsers");
      const users = await returnVal.json();
      let track = false;
      for (let i = 0; i < users.length; i++) {
        debugger;
        if (users[i].username === username && users[i].password === pass) {
          tempUser = users[i];
          console.log("here");
          console.log("two factor = " + users[i].twoStepAuth);
          track = true;

          if (rememberMe) {
            localStorage.setItem("remember", true);
            localStorage.setItem("username", username);
            localStorage.setItem("password", pass);
          } else {
            localStorage.removeItem("remember");
            localStorage.removeItem("username");
            localStorage.removeItem("password");
          }
          
          if (users[i].twoStepAuth) {
            const generateCodeResponse = await fetch("http://localhost:3001/generate2FACode", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            });
            const result = await generateCodeResponse.json();
            if (generateCodeResponse.ok) {
              // Display input field for verification code
              setShowCodeInput(true);
            } else {
              document.getElementById("error-message").innerText = result.message || "Error generating 2FA code.";
            }
          } else {
            console.log("no twofactor");
            // If no 2FA, log in directly
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
              setUsername(users[i].docId);
              // setUsername(username);
              setEmail(username);
              // setIsLoggedIn(true);
              localstorage.set('user', username);
              localstorage.set('pass', pass);
              nav("/", { user: users[i] })
            } catch (error) {
              console.log(error);
            }
          }
          break;
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

  const verify2FACode = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/verify2FACode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          code: verificationCode,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        try {
          const auth = getAuth();
          console.log("username = " + username + " pass = " + pass);
          signInWithEmailAndPassword(auth, username, pass)
            .then((userCredential) => {
              const user = userCredential.user;
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
          // setUsername(username);
          closeModal(); // Close the 2FA modal on successful verification
          const returnVal = await fetch("http://localhost:3001/fetchUsers");
          const users = await returnVal.json();
          nav("/", { user: tempUser })
        } catch (error) {
          console.log(error);
        }
      } else {
        document.getElementById("2fa-error-message").innerText = result.message || "Invalid verification code.";
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmitWithGoogle = async (e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setUsername(auth.currentUser.email);
    signInWithPopup(auth, provider)
      .then(async (res) => {
        const cred = GoogleAuthProvider.credentialFromResult(res);
        // console.log(res.user);
        nav("/", {user: auth.currentUser.email});
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="loginDiv">
      <form className="loginForm" onSubmit={checkUser}>
        <h2>Login</h2>
        <div className="errorDiv">
          <p id="error-message" className="error-message"></p>
        </div>
        <div className="userNameDiv">
          <label htmlFor="user">Email</label>
          <input
            type="text"
            id="user"
            name="user"
            required
            value={username}
            onChange={handleUser}
          />
        </div>
        <div className="passDiv">
          <label htmlFor="pass">Password</label>
          <input
            type="password"
            id="pass"
            name="pass"
            required
            value={pass}
            onChange={handlePass}
          />
        </div>
        <div className="rememberMeDiv">
          <label htmlFor="rememberMe">Remember me on this device</label>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMe}
          />
        </div>
        <button id="login" type="submit">Login</button>
        <div className="alreadyHaveAccount">
          <Link to="/create-account">Don't have an account? Sign up</Link>
        </div>
        <div className="buttonDiv">
          <button type="submit" className="gButton" onClick={handleSubmitWithGoogle}>
            Login with Google
          </button>
        </div>
        <Routes>
          <Route path="/create-account" element={<CreateAccount />}></Route>
        </Routes>
      </form>
      {showCodeInput && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter 2FA Code</h3>
            <div className="errorDiv">
              <p id="2fa-error-message" className="error-message"></p>
            </div>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              required
              onChange={handleVerificationCodeInput}
            />
            <button onClick={verify2FACode}>Verify Code</button>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;