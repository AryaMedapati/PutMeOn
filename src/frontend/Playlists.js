import React from 'react';
import { useState, useContext, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate, Switch} from "react-router-dom";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {getAuth} from 'firebase/auth';
import "./styles/Playlists.css";
import { UserContext } from "./UserContext";
import PlaylistList from "./PlaylistList";
import SharedPlaylists from './SharedPlaylists';
import CollabPlaylist from './CollabPlaylist';


const Playlists = (props) => {
  const location = useLocation();
  const auth = getAuth();
  const nav = useNavigate();
  let { username } = useContext(UserContext);
  if (!username) {
    username = auth.currentUser.email;
  }
  const db = getFirestore();
  const storage = getStorage();
  if (props.user == null) {
    // props.user = "";
  }
  const [isPrivate, setIsPrivate] = useState(false); 
  const [privacySettings, setPrivacySettings] = useState({
    topTracks: false,
    topAlbums: false,
    topGenres: false,
    playlists: false,
    listeningActivity: false,
  });
  const [pdf, setPdf] = useState("");
  const [twoStepAuth, setTwoStepAuth] = useState(false);



  // console.log(location.state.user);
  // console.log(auth.currentUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);
    // setPdf(file.name);
  };
  // console.log(location.state);
  const handleSaveSettings = async (du) => {
    console.log(pdf);
    if (username) {
      try {
        console.log("user = " + username);
        console.log("pdf" + pdf);
        await setDoc(doc(db, "UserData", username), {
          privacySettings: privacySettings,
          isPrivate: isPrivate,
          twoStepAuth: twoStepAuth,
          pdf: du
        });
        document.getElementById("uploading").innerHTML = "Done";
        alert("File uploaded successfully.");
      } catch (error) {
        console.error("Error saving settings:", error);
        alert("Error saving privacy settings. Please try again.");
      }
    } else {
      console.log("user = " + username);
      console.log("pdf" + pdf);
      await setDoc(doc(db, "UserData", username), {
        privacySettings: privacySettings,
        isPrivate: isPrivate,
        twoStepAuth: twoStepAuth,
        pdf: du
      });
      
      alert("File uploaded successfully.");
      
    }
  };
  const handleFileSave = async() => {
    if (selectedFile && selectedFile.name.search("pdf") >= 0) {
      const storageRef = ref(storage, `uploads/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              document.getElementById("uploading").innerHTML = "Uploading...";
              break;
          }
        }, 
        (error) => {
            console.log(error);
          }
        , 
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadUrl);
            // setPdf(downloadUrl);
            await handleSaveSettings(downloadUrl);
          });
      if (username) {
        const userDoc = await getDoc(doc(db, "UserData", username));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setPrivacySettings(data.privacySettings || privacySettings);
          setIsPrivate(data.isPrivate || false);
          setTwoStepAuth(data.twoStepAuth || false);
        }
      }
    }
    else if (selectedFile && selectedFile.name.search("pdf") < 0) {
      alert("You must upload a PDF.")
    }
    else {
      alert("Please upload a file.")
    }

  }
  return (
<div className="outer-container">
  <PlaylistList/>
  <SharedPlaylists/>
  <CollabPlaylist/>
  {/* <div className="inner-container">
    <h2>Upload Extensive Listening History</h2>
    <input type="file" onChange={handleFileChange} />
    <button className="saveFile" onClick={handleFileSave}>Save File</button>
    <p id="uploading"></p>
  </div> */}
</div>
  );
};

export default Playlists;
