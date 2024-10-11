import React, { useContext } from "react";
import "./styles/Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { UserContext } from "./UserContext";
import CreateAccount from "./CreateAccount"

function Login() {
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false); // Flag for 2FA
  const [verificationCode, setVerificationCode] = useState(""); // Store the verification code
  const [showCodeInput, setShowCodeInput] = useState(false); // Toggle code input form
  const [tempUsername, setTempUsername] = useState(""); // Temporary store of username for 2FA
  const nav = useNavigate();
  const { setUsername } = useContext(UserContext);

  const handleUser = (e) => {
    setUserName(e.target.value);
  }

  const handlePass = (e) => {
    setPass(e.target.value);
  }

  const handleVerificationCodeInput = (e) => {
    setVerificationCode(e.target.value);
  };

  const checkUser = async (e) => {
    e.preventDefault();
    console.log(1);
    try {
      const returnVal = await fetch("http://localhost:3001/fetchUsers");
      const users = await returnVal.json();
      let isValidUser = false;
      // let track = false;
      for (let i = 0; i < users.length; i++) {
        if(users[i].username === username && users[i].password === pass) {
          isValidUser = true;
          setTempUsername(username); // Save username temporarily for 2FA
          
          // Check if the user has 2FA enabled
          if (users[i].TwoFactor) {
            setIsTwoFactorEnabled(true); // Enable 2FA if true
          } else {
            // Directly log in if 2FA is not enabled
            setUsername(username);
            nav("/", { state: true }); // Redirect after successful login
          }
        }
      }
      if (isValidUser && isTwoFactorEnabled) {
        // Generate 2FA code
        const generateCodeRes = await fetch("http://localhost:3001/generate2FACode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const result = await generateCodeRes.json();
        if (generateCodeRes.ok) {
          setShowCodeInput(true); // Show code input form
        } else {
          document.getElementById("error-message").innerHTML = result.message || "Error generating 2FA code.";
        }
      } else if (!isValidUser) {
        document.getElementById("error-message").innerHTML = "Incorrect email or password.";
      }
      // console.log(users[0]);

    } catch (error) {
      console.log(error);
    }
  }

  const verify2FACode = async (e) => {
    e.preventDefault();
    try {
      const verifyRes = await fetch("http://localhost:3001/verify2FACode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: tempUsername, code: verificationCode }),
      });

      const result = await verifyRes.json();
      if (verifyRes.ok) {
        setUsername(tempUsername);
        nav("/", { state: true }); // Redirect after successful 2FA
      } else {
        document.getElementById("error-message").innerHTML = result.message || "Invalid verification code.";
      }
    } catch (error) {
      console.log("Error verifying code: ", error);
    }
  };

  const handleSubmitWithGoogle = async(e) => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    setUsername(auth.currentUser.email);
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
              isPublic: false,
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
            onChange={handlePass}
          />
        </div>
        <button type="submit">Login</button>

        {showCodeInput && (
          <form className="verificationForm" onSubmit={verify2FACode}>
            <div className="verificationCodeDiv">
              <label htmlFor="verificationCode">Enter 2FA Code</label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                required
                onChange={handleVerificationCodeInput}
              />
            </div>
            <button type="submit">Verify Code</button>
          </form>
        )}

        <div className="alreadyHaveAccount">
          <Link to="/create-account">Don't have an account? Sign up</Link>
        </div>
        <div className="buttonDiv">
          <button type="submit" className="gButton" onClick={handleSubmitWithGoogle}>
            Login with Google
          </button>
        </div>
        <div className="buttonDiv">
          <button type="submit" className="spoButton" onClick={handleSubmitWithSpotify}>
            Login with Spotify
          </button>
        </div>
        <Routes>
          <Route path="/create-account" element={<CreateAccount />}></Route>
        </Routes>
      </form>
    </div>
  );
}

export default Login