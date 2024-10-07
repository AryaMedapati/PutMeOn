import React from "react"
import "./styles/Login.css"
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import CreateAccount from "./CreateAccount"

function Login() {
  return(
    <div className="loginDiv">
      <form className="loginForm">
        <h2>Login</h2>
        <div className="userNameDiv">
          <label htmlFor="user">Username</label>
          <input type = "text" id="user" name="user" required></input>
        </div>
        <div className="passDiv">
          <label htmlFor="pass">Password</label>
          <input type = "text" id="pass" name="pass" required></input>
        </div>
        <button type="submit">Login</button>
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