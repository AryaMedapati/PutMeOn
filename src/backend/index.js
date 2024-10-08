const express = require("express");
// const functions = require('firebase-functions');
const bp = require("body-parser");
const db = require("./firebaseConfig");
const request = require('request');
const querystring = require("querystring");
const cors = require("cors")
const clientID = '6e24baf59c484801a146e21891775723';
const clientSecret = '177482208fff40f7991ac0b139b2627e';
let accessToken = "";
let refreshToken = "";

const app = express();
const port = process.env.PORT || 3001;
app.use(bp.json());
app.use(cors())

const userProfile = {
  username: '',
  profilePic: '',
  bio: '',
  friends: [], 
  isPublic: false
};

app.post("/insertUser", async (req, res) => {
  const{username, password, isPublic} = req.body;
  try{
    // console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({username, password, isPublic});
    console.log("success")
    res.status(200).json({message: "Success"});
  } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
  }
});

app.get("/fetchUsers", async (req, res) => {
  try {
    const getUsers = db.collection("UserData");
    const snapshot = await getUsers.get();
    const users = snapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})
app.get("/spotify-login", async (req, res) => {
  // console.log("hello");
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      scope: 'ugc-image-upload user-read-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private',
      redirect_uri: 'http://localhost:3001/callback'
    })
  );
})

app.get("/callback", function(req, res) {
  // console.log("here");
  var authVal = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code,
      redirect_uri: 'http://localhost:3001/callback',
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type' : 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64'))
    },
    json:true
  };
  request.post(authVal, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body);
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      accessToken = body.access_token;
      refreshToken = body.refreshToken;
      // Redirect to frontend with tokens
      res.redirect('https://put-me-on-418b7.web.app/?' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        })
      );
    } else {
      console.log("error");
    }
  });
})
app.get("/profile", async (req, res) => {
  const { username } = req.query;
  try {
    const userDoc = await db.collection("UserData").where("username", "==", username).get();

    if (userDoc.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = userDoc.docs[0].data();
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port)
})
