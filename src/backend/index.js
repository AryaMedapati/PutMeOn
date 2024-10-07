const express = require("express");
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5002;
// const port = 5002;
// app.use(express.json());
// app.use(json());
app.use(cors());

app.post("/insertUser", bp.json(), async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log("Here");
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({ username, password });
    console.log("success");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/topTracks", async (req, res) => {
  const accessToken = "BQBKEPiZzTFKU9HMs-ADSda0JSedvCsV9IA5HNL-UMc9Dc02chMd0tESp8j_PBRZBpEf5lwrImm7lzqni3xKLxbYzX0LLmU7oijOvlj-QXSR3XF6hIM"; // My token
  try {
    const topTracksResponse = axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({ data: topTracksResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/testing", async (req, res) => {
  res.status(200).json({message: "Hello"});
})

app.listen(port, () => {
  console.log("Server running on port " + port);
});
