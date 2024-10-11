const express = require("express");
// const functions = require('firebase-functions');
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors");
const axios = require("axios");
const request = require("request");
const querystring = require("querystring");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
Chart.register(...registerables);
const clientID = "6e24baf59c484801a146e21891775723";
const clientSecret = "177482208fff40f7991ac0b139b2627e";
let accessToken = "";
let refreshToken = "";

const app = express();
const port = process.env.PORT || 3001;
const frontPort = 3000;
const url = `http://localhost:${port}`;
const frontUrl = `http://localhost:${frontPort}`;
const mainUrl = "https://put-me-on-418b7.web.app";
// app.use(express.json());
// app.use(json());
app.use(bp.json());
app.use(cors());

const userProfile = {
  username: "",
  profilePic: "",
  bio: "",
  friends: [],
  isPrivate: false,
};

app.post("/insertUser", async (req, res) => {
  const { username, password, isPrivate } = req.body;
  try {
    // console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({ username, password, isPrivate });
    console.log("success");
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
    const users = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

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
    console.log(topArtistsResponse);

    res.status(200).json({ data: topArtistsResponse.data.items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

const generatePieChart = (genreData) => {
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const labels = genreData.map((item) => item.genre);
  const data = genreData.map((item) => item.count);
  const backgroundColor = [
    "#ff6384",
    "#36a2eb",
    "#cc65fe",
    "#ffce56",
    "#fd6b19",
    "#4bc0c0",
    "#9966ff",
    "#ff9f40",
  ];

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor.slice(0, data.length), // Dynamic colors based on number of genres
        },
      ],
    },
    options: {
      responsive: false,
    },
  });

  return canvas.toBuffer();
};

app.get("/genrePie", async (req, res) => {
  const timeline = req.query.timeline;
  const token = accessToken;
  const limit = 50;
  const topArtistsResponse = await axios.get(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeline}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const getGenreCounts = (data) => {
    let genreCounts = {};
    data.forEach((entry) => {
      entry.genres.forEach((genre) => {
        if (genreCounts[genre]) {
          genreCounts[genre]++;
        } else {
          genreCounts[genre] = 1;
        }
      });
    });
    return genreCounts;
  };
  const rankGenres = (genreCounts) => {
    let genreArray = Object.entries(genreCounts);
    genreArray.sort((a, b) => b[1] - a[1]);
    let rankedGenres = [];
    let rank = 1;

    genreArray.forEach((item, index) => {
      if (index === 0) {
        rankedGenres.push({ genre: item[0], count: item[1], rank });
      } else {
        if (item[1] === genreArray[index - 1][1]) {
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        } else {
          rank = index + 1;
          rankedGenres.push({ genre: item[0], count: item[1], rank });
        }
      }
    });

    return rankedGenres;
  };
  // console.log(topArtistsResponse);
  const data = await topArtistsResponse.data.items;
  console.log(data);
  const genreCounts = getGenreCounts(data);
  const rankedGenres = rankGenres(genreCounts);
  const chartBuffer = generatePieChart(rankedGenres);

  res.set("Content-Type", "image/png");
  res.send(chartBuffer);
});

const generateHistogram = (popularityData) => {
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const histogramData = new Array(11).fill(0);
  popularityData.forEach((popularity) => {
    const index = Math.floor(popularity / 10);
    histogramData[index]++;
  });

  const labels = Array.from({ length: 11 }, (_, i) => i * 10);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Popularity Frequency",
          data: histogramData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Frequency",
          },
        },
        x: {
          title: {
            display: true,
            text: "Popularity (0-100)",
          },
        },
      },
    },
  });

  return canvas.toBuffer();
};

app.get("/trackChart", async (req, res) => {
  const timeline = req.query.timeline;
  const token = accessToken;
  const limit = 50;
  const topTracksResponse = await axios.get(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeline}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await topTracksResponse.data.items;
  const popularityData = data.map((track) => track.popularity);
  const histogramBuffer = generateHistogram(popularityData);
  res.set("Content-Type", "image/png");
  res.send(histogramBuffer);
});

app.get("/artistChart", async (req, res) => {
  const timeline = req.query.timeline;
  const token = accessToken;
  const limit = 50;
  const topTracksResponse = await axios.get(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeline}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await topTracksResponse.data.items;
  const popularityData = data.map((artist) => artist.popularity);
  const histogramBuffer = generateHistogram(popularityData);
  res.set("Content-Type", "image/png");
  res.send(histogramBuffer);
});

app.get("/spotify-login", async (req, res) => {
  // console.log("hello");
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientID,
        scope:
          "ugc-image-upload user-read-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-top-read user-read-recently-played user-library-modify user-library-read user-read-email user-read-private",
        redirect_uri: `${url}/callback`,
      })
  );
});

app.get("/callback", function (req, res) {
  // console.log("here");
  var authVal = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: req.query.code,
      redirect_uri: `${url}/callback`,
      grant_type: "authorization_code",
    },
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(clientID + ":" + clientSecret).toString("base64"),
    },
    json: true,
  };
  request.post(authVal, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body);
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;
      accessToken = body.access_token;
      refreshToken = body.refreshToken;
      // Redirect to frontend with tokens
      res.redirect(
        `${mainUrl}/?` +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          })
      );
    } else {
      console.log("error");
    }
  });
});

app.get("/profile", async (req, res) => {
  const { username } = req.query;
  try {
    const userDoc = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

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
  console.log("Server running on port " + port);
});
