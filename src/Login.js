import React from "react"
import "./Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
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
          nav("/");
        }
      }
      if (!track) {
        document.getElementById("error-message").innerHTML = "Incorrect username or password."
      }
      // console.log(users[0]);

    } catch (error) {
      console.log(error);
    }
  }

  return(
    <div className="loginDiv">
      <form className="loginForm" onSubmit={checkUser}>
        <h2>Login</h2>
        <div className="errorDiv">
          <p id="error-message"  className="error-message"></p>
        </div>
        <div className="userNameDiv">
          <label htmlFor="user">Username</label>
          <input type = "text" id="user" name="user" required onChange={handleUser}></input>
        </div>
        <div className="passDiv">
          <label htmlFor="pass">Password</label>
          <input type = "text" id="pass" name="pass" required onChange={handlePass}></input>
        </div>
        <button type="submit" onClick={checkUser}>Login</button>
        <div className="goToCreate">
            <Link to =  "/create-account" >Don't have an account? Sign up</Link>
        </div>
        <Routes>
            <Route path = "/create-account" element = {<CreateAccount />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default Login