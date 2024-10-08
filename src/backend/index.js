const express = require("express");
// const functions = require('firebase-functions');
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors");
const axios = require("axios");
const request = require('request');
const querystring = require("querystring");
const clientID = '7a37fde68f1a48df8e71e42f6415b1a1';
const clientSecret = 'dc9a38df3b6a4c35b01cc538ad66d460';
let accessToken = "";
let refreshToken = "";

const app = express();
const port = process.env.PORT || 3001;
const frontPort = 5002;
const url = `http://localhost:${port}`;
const frontUrl = `http://localhost:${frontPort}`;
// const url = "https://put-me-on-418b7.web.app"
// const port = 5002;
// app.use(express.json());
// app.use(json());
app.use(cors());

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
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/topTracks", async (req, res) => {
  try {
    const token = accessToken;
    const limit = 50;
    console.log(token);
    const topTracksResponse = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    //console.log(topTracksResponse)

    res.status(200).json({ data: topTracksResponse.data.items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});


app.get("/spotify-login", async (req, res) => {
  // console.log("hello");
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      scope: 'ugc-image-upload user-read-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private',
      redirect_uri: `${url}/callback`
    })
  );
})

app.get("/callback", function(req, res) {
  // console.log("here");
  var authVal = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code,
      redirect_uri: `${url}/callback`,
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
      res.redirect(`${frontUrl}/?` +
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
});
