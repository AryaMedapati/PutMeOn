const express = require("express");
// const functions = require('firebase-functions');
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors");
const axios = require("axios");
const request = require('request');
const querystring = require("querystring");
const clientID = '6e24baf59c484801a146e21891775723';
const clientSecret = '177482208fff40f7991ac0b139b2627e';
let accessToken = "";
let refreshToken = "";
const nodemailer = require("nodemailer"); // Add nodemailer for sending emails
const crypto = require("crypto"); // For generating random codes

const app = express();
const port = process.env.PORT || 3001;
const frontPort = 3000;
const url = `http://localhost:${port}`;
const frontUrl = `http://localhost:${frontPort}`;
const mainUrl = "https://put-me-on-418b7.web.app"
// app.use(express.json());
// app.use(json());
app.use(bp.json());
app.use(cors());

const tempCodeStore = {};

function generateRandomCode(length = 6) {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

app.post("/insertUser", async (req, res) => {
  const { username, password, isPrivate } = req.body;
  try {
    // console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({ username, password, isPrivate });
    console.log("success")
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
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

app.get("/topTracks", async (req, res) => {
  try {
    const timeline = req.query.timeline;
    const token = accessToken;
    const limit = 50;
    console.log(token);
    const topTracksResponse = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeline}&limit=${limit}`,
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

app.get("/topArtists", async (req, res) => {
  try {
    const timeline = req.query.timeline;
    const token = accessToken;
    const limit = 50;
    console.log(token);
    const topArtistsResponse = await axios.get(
      `https://api.spotify.com/v1/me/top/artists?time_range=${timeline}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(topArtistsResponse)

    res.status(200).json({ data: topArtistsResponse.data.items });
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

app.get("/callback", function (req, res) {
  // console.log("here");
  var authVal = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code,
      redirect_uri: `${url}/callback`,
      grant_type: 'authorization_code'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64'))
    },
    json: true
  };
  request.post(authVal, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body);
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      accessToken = body.access_token;
      refreshToken = body.refreshToken;
      // Redirect to frontend with tokens
      res.redirect(`${mainUrl}/?` +
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

app.post("/generate2FACode", async (req, res) => {
  const { username } = req.body;

  // Validate input
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Fetch the user by username
    const userSnapshot = await db.collection("UserData").where("username", "==", username).get();

    if (userSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userSnapshot.docs[0].data();
    const userEmail = userData.username;

    // Generate the random verification code
    const verificationCode = generateRandomCode();

    // Store the code temporarily for the user (e.g., in database or cache for production)
    tempCodeStore[username] = {
      code: verificationCode,
      createdAt: Date.now(),
    };

    // Set up the email transport (use environment variables for credentials in production)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'putmeonproject@gmail.com', // Your email address
        pass: 'rvrl pstn twfh kjip ',    // Your email password or app password
      },
    });

    // Send the email with the verification code
    const mailOptions = {
      from: 'putmeonproject@gmail.com',
      to: userEmail,
      subject: 'Your 2FA Verification Code',
      text: `Hello ${username},\n\nYour verification code is: ${verificationCode}\nThis code will expire in 5 minutes.\n\nBest regards,\nYour Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Error generating 2FA code:', error);
    return res.status(500).json({ message: 'Error generating 2FA code', error: error.message });
  }
});

app.post("/verify2FACode", (req, res) => {
  const { username, code } = req.body;

  // Validate input
  if (!username || !code) {
    return res.status(400).json({ message: "Username and code are required" });
  }

  // Check if code exists for the username
  const storedData = tempCodeStore[username];
  if (!storedData) {
    return res.status(400).json({ message: "No code generated for this user" });
  }

  const { code: storedCode, createdAt } = storedData;

  // Check if the code matches
  if (storedCode !== code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  // Check if the code is expired (valid for 5 minutes)
  const codeExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  if (Date.now() - createdAt > codeExpiryTime) {
    return res.status(400).json({ message: "Code expired" });
  }

  // If code is correct and not expired, verification is successful
  delete tempCodeStore[username]; // Remove the code after successful verification
  return res.status(200).json({ message: "Code verified successfully" });
});

/*
app.post('/sendRandomCode', async (req, res) => {
  const { username } = req.body;
  console.log("a");
  if (!username) {
    return res.status(400).json({ message: 'Username required' });
  }

  const randomCode = generateRandomCode();
  console.log("b");
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user: 'putmeonproject@gmail.com', // Your email address
      pass: 'rvrl pstn twfh kjip ',    // Your email password or app password
    },
  });
  console.log("c");
  // Email content
  const mailOptions = {
    from: 'putmeonproject@gmail.com',
    to: username,
    subject: 'Your Random Code',
    text: `Hello,\n\nYour random code is: ${randomCode}\n\nBest regards,\nYour Team`,
  };
  console.log("d");
  try {
    // Send mail
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});
*/
app.listen(port, () => {
  console.log("Server running on port " + port)
});
