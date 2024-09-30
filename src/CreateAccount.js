import React, { useState, useEffect } from "react"
import "./Login.css"
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import Login from "./Login";

function CreateAccount() {

  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [isPublic, setIsPublic] = useState(true); // State to manage account visibility
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

  const handleCheckboxChange = () => {
    setIsPublic((prevValue) => !prevValue); // Toggle the public/private state
  };

  const handleSubmit = async (e) => {
    console.log("good");
    e.preventDefault();
    try {
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

      const returnVal = await res.json();
      console.log(returnVal)
      nav("/");
    } catch (error) {
      console.log("Error: " + error)
    }
  
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
        <div className="privacyDiv">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={handleCheckboxChange}
            />
            Make my account private
          </label>
        </div>
        <button type="submit" onClick={handleSubmit} disabled={!!errorMessage || !!errorMessage}>Create Account</button>
        <div className="alreadyHaveAccount">
            <Link to =  "/login" >Already have an account? Log in</Link>
        </div>
        <Routes>
            <Route path = "../login" element = {<Login />}></Route>
        </Routes>
      </form>
    </div>
  )
}

export default CreateAccount