const { getFirestore, doc, getDoc, setDoc } = require("firebase/firestore");
const express = require("express");
// const functions = require('firebase-functions');
const bp = require("body-parser");
const db = require("./firebaseConfig");
const admin = require("firebase-admin");
const cors = require("cors");
const axios = require("axios");
const request = require("request");
const querystring = require("querystring");
const cron = require("node-cron");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
Chart.register(...registerables);
const clientID = "6e24baf59c484801a146e21891775723";
const clientSecret = "177482208fff40f7991ac0b139b2627e";
let accessToken = "";
let refreshToken = "";

let user = "";
const { ArrayTimestamp } = require("@blueprintjs/icons");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');


const app = express();
const port = process.env.PORT || 3001;
const frontPort = 3000;
const url = `http://localhost:${port}`;
const frontUrl = `http://localhost:${frontPort}`;
const mainUrl = "https://put-me-on-418b7.web.app";
// app.use(express.json());
// app.use(json());

app.use(bp.json({ limit: "50mb" }));
app.use(cors());

const tempCodeStore = {};

const userProfile = {
  username: "",
  profilePic: "",
  bio: "",
  friends: [],
  isPrivate: false,
};
// async function updateField() {
//   await updateDoc(docRef, {
//     fieldName: "newValue" // Specify the field and its new value
//   });
// }
async function saveToken(user) {
  // console.log("user: "+ user);
  try {
    const getUsers = db.collection("UserData");
    // const user = user;
    const value = getUsers.where('username', '==', user);
    const snapshot = await value.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      // console.log(userData);
      await userDoc.ref.update({
        accessToken: accessToken
      });

    }
  } catch (error) {
    console.log(error);
  }
}
async function saveRecentlyPlayed(user, song, likes, likedBy, laughingLikes, laughingLikedBy, fire, fireLikedBy, comments, totalLikes, totalReactions, totalComments) {
  // console.log("user: "+ user);
  console.log(likedBy);
  try {
    const getUsers = db.collection("UserData");
    // const user = user;
    const value = getUsers.where('username', '==', user);
    const snapshot = await value.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      // console.log(userData);
      await userDoc.ref.update({
        recentlyPlayed: song,
        currentLikes: likes,
        likedBy: likedBy,
        currentLaughingLikes: laughingLikes,
        laughingLikedBy: laughingLikedBy,
        fire: fire,
        fireLikedBy: fireLikedBy,
        comments: comments,
        totalLikes: totalLikes,
        totalReactions: totalReactions,
        totalComments: totalComments
      });

    }
  } catch (error) {
    console.log(error);
  }
}
async function savePopularityScore(user, popScore) {
  // console.log("user: "+ user);
  try {
    const getUsers = db.collection("UserData");
    // const user = user;
    const value = getUsers.where('username', '==', user);
    const snapshot = await value.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      // console.log(userData);
      await userDoc.ref.update({
        popScore:popScore
      });

    }
  } catch (error) {
    console.log(error);
  }
}
app.get("/calculateAveragePopularity", async (req, res) => {
  try {
    const col = db.collection("UserData");
    const snapshot = await col.get();
    let total = 0;
    let vals = 0;
    snapshot.forEach((doc) => {
      if (doc.data().popScore) {
        total += doc.data().popScore;
        vals+=1
      }
    })
    const average = total/vals
    res.json({total: average});
  } catch (error) {
    console.log(error);
  }
})
app.get("/calculateAverageLikes", async (req, res) => {
  try {
    const col = db.collection("UserData");
    const snapshot = await col.get();
    let total = 0;
    let vals = 0;
    snapshot.forEach((doc) => {
      if (doc.data().totalLikes) {
        total += doc.data().totalLikes;
        vals+=1
      }
    })
    const average = total/vals
    res.json({total: average});
  } catch (error) {
    console.log(error);
  }
})
app.get("/calculateAverageFollowers", async (req, res) => {
  try {
    const col = db.collection("UserData");
    const snapshot = await col.get();
    let total = 0;
    let vals = 0;
    snapshot.forEach((doc) => {
      if (doc.data().followers) {
        total += doc.data().followers;
        vals+=1
      }
    })
    const average = total/vals
    res.json({total: average});
  } catch (error) {
    console.log(error);
  }
})
app.get("/calculateAverageReactions", async (req, res) => {
  try {
    const col = db.collection("UserData");
    const snapshot = await col.get();
    let total = 0;
    let vals = 0;
    snapshot.forEach((doc) => {
      if (doc.data().totalReactions) {
        total += doc.data().totalReactions;
        vals+=1
      }
    })
    const average = total/vals
    res.json({total: average});
  } catch (error) {
    console.log(error);
  }
})
app.get("/calculateAverageComments", async (req, res) => {
  try {
    const col = db.collection("UserData");
    const snapshot = await col.get();
    let total = 0;
    let vals = 0;
    snapshot.forEach((doc) => {
      if (doc.data().totalComments) {
        total += doc.data().totalComments;
        vals+=1
      }
    })
    const average = total/vals
    res.json({total: average});
  } catch (error) {
    console.log(error);
  }
})
async function saveFollowers(user, followers) {
  // console.log("user: "+ user);
  try {
    const getUsers = db.collection("UserData");
    // const user = user;
    const value = getUsers.where('username', '==', user);
    const snapshot = await value.get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      // console.log(userData);
      await userDoc.ref.update({
        followers:followers
      });

    }
  } catch (error) {
    console.log(error);
  }
}

function generateRandomCode(length = 6) {
  return crypto
    .randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
}

app.post("/insertUser", async (req, res) => {
  try {
    // console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set(req.body);
    console.log("success");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.post("/insertCollabPlaylist", async (req, res) => {
  try {
    // console.log("Here")
    const playlistInfo = db.collection("CollabPlaylists").doc();
    await playlistInfo.set(req.body);
    res.status(200).json({ message: "Success", documentId: playlistInfo.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/fetchCollabPlaylist", async (req, res) => {
  try {
    const docId = req.headers['documentid'];
    const userDoc = db.collection("CollabPlaylists").doc(docId);
    const doc = await userDoc.get();
    const user = doc.data()
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/updateCollabPlaylist", async (req, res) => {
  try {
    const docId = req.headers['documentid'];
    const userRef = db.collection('CollabPlaylists').doc(docId);
    await userRef.set(req.body, { merge: true });

    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

app.post("/addFriend", async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);
    const { username, sender } = req.body;
    console.log(username);
    console.log(sender);
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();
    console.log(recipientSnapshot);

    if (recipientSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientId = recipientDoc.id;

    const notificationData = {
      message: `Friend request from ${sender}`,
      recipient: recipientId,
      sender: sender,
      status: "unread",
    };

    const recipientUserRef = db.collection("UserData").doc(recipientId);
    const recipientUserDoc = await recipientUserRef.get();
    const recipientData = recipientUserDoc.data();
    // console.log(recipientData);

    if (recipientData.notifications) {
      await recipientUserRef.update({
        notifications: admin.firestore.FieldValue.arrayUnion(notificationData),
      });
    } else {
      await recipientUserRef.set(
        { notifications: [notificationData] },
        { merge: true }
      );
    }

    if (recipientData.friendRequests) {
      await recipientUserRef.update({
        friendRequests: admin.firestore.FieldValue.arrayUnion(sender),
      });
    } else {
      await recipientUserRef.set({ friendRequests: [sender] }, { merge: true });
    }

    res.json({ message: `Friend request sent to ${username}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.post("/acceptFriendRequest", async (req, res) => {
  try {
    const { recipientUsername, senderUsername } = req.body;
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", recipientUsername)
      .get();
    const senderSnapshot = await db
      .collection("UserData")
      .where("username", "==", senderUsername)
      .get();

    const recipientDoc = recipientSnapshot.docs[0];
    const senderDoc = senderSnapshot.docs[0];
    const recipientId = recipientDoc.id;
    const senderId = senderDoc.id;

    const recipientUserRef = db.collection("UserData").doc(recipientId);
    const recipientUserDoc = await recipientUserRef.get();
    const recipientData = recipientUserDoc.data();
    const senderUserRef = db.collection("UserData").doc(senderId);
    const senderUserDoc = await senderUserRef.get();
    const senderData = senderUserDoc.data();

    if (!recipientData.friends_list) {
      await recipientUserRef.update({
        friends_list: [],
      });
    }

    if (!senderData.friends_list) {
      await senderUserRef.update({
        friends_list: [],
      });
    }
    await recipientUserRef.update({
      friends_list: admin.firestore.FieldValue.arrayUnion(senderUsername),
    });

    await senderUserRef.update({
      friends_list: admin.firestore.FieldValue.arrayUnion(recipientUsername),
    });

    const notificationData = {
      message: `${recipientUsername} accepted your friend request.`,
      recipient: senderId,
      status: "unread",
    };

    await senderUserRef.update({
      notifications: admin.firestore.FieldValue.arrayUnion(notificationData),
    });

    await recipientUserRef.update({
      friendRequests: admin.firestore.FieldValue.arrayRemove(senderUsername),
    });

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.post("/removeFriend", async (req, res) => {
  try {
    const { recipientUsername, senderUsername } = req.body;
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", recipientUsername)
      .get();
    const senderSnapshot = await db
      .collection("UserData")
      .where("username", "==", senderUsername)
      .get();

    const recipientDoc = recipientSnapshot.docs[0];
    const senderDoc = senderSnapshot.docs[0];
    const recipientId = recipientDoc.id;
    const senderId = senderDoc.id;

    const recipientUserRef = db.collection("UserData").doc(recipientId);
    const senderUserRef = db.collection("UserData").doc(senderId);

    await recipientUserRef.update({
      friends_list: admin.firestore.FieldValue.arrayRemove(senderUsername),
    });

    await senderUserRef.update({
      friends_list: admin.firestore.FieldValue.arrayRemove(recipientUsername),
    });

    res.json({
      message: `Removed ${recipientUsername} and ${senderUsername} as friends`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

app.get("/fetchUsers", async (req, res) => {
  try {
    const getUsers = db.collection("UserData");
    const snapshot = await getUsers.get();
    const users = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(users);
  } catch (error) {
    // console.log(error);
    res.status(500).send(error);
  }
});

app.get("/fetchUserByUsername", async (req, res) => {
  try {
    const username = req.headers['username'];
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    const user = recipientSnapshot.docs[0].data()
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving document:", error);
  }
});

app.get("/fetchCurrentUser", async (req, res) => {
  try {
    const docId = req.headers["documentid"];
    const userDoc = db.collection("UserData").doc(docId);
    const doc = await userDoc.get();
    const user = doc.data();
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/fetchNotifications", async (req, res) => {
  try {
    const { username } = req.body;
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    if (recipientSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientData = recipientDoc.data();

    if (recipientData.notifications) {
      res.json({ notifications: recipientData.notifications });
    } else {
      res.json({ notifications: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/fetchFriendRequests", async (req, res) => {
  try {
    const { username } = req.body;
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    if (recipientSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientData = recipientDoc.data();

    if (recipientData.friendRequests) {
      res.json({ friendRequests: recipientData.friendRequests });
    } else {
      res.json({ friendRequests: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/fetchFriends", async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    if (recipientSnapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientData = recipientDoc.data();

    if (recipientData.friends_list) {
      res.json({ friends: recipientData.friends_list });
    } else {
      res.json({ friends: [] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/updateUser", async (req, res) => {
  try {
    const docId = req.headers["documentid"];
    const userRef = db.collection("UserData").doc(docId);
    await userRef.set(req.body, { merge: true });

    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.post("/updateUserbyUsername", async (req, res) => {
  try {
    const username = req.headers['username'];
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    const userDoc = recipientSnapshot.docs[0];
    const userRef = userDoc.ref;
    await userRef.set(req.body, { merge: true });

    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.post("/updateUserbyUsername", async (req, res) => {
  try {
    const username = req.headers['username'];
    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    const userDoc = recipientSnapshot.docs[0];
    const userRef = userDoc.ref;
    await userRef.set(req.body, { merge: true });

    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
});

app.post("/cypressUserReset", async (req, res) => {
  try {
    const docId = req.headers["documentid"];
    const userRef = db.collection("UserData").doc(docId);
    await userRef.set(req.body, { merge: false });

    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

app.get("/topTracks", async (req, res) => {
  try {
    const timeline = req.query.timeline;
    const token = accessToken;
    const limit = 50;
    // console.log(token);
    const topTracksResponse = await axios.get(
      `https://api.spotify.com/v1/me/top/tracks?time_range=${timeline}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(topTracksResponse);

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

app.get("/currentlyPlaying", async (req, res) => {
  try {
    const token = accessToken; // Ensure the accessToken is already set for the user
    const currentlyPlayingResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (currentlyPlayingResponse.data && currentlyPlayingResponse.data.item) {
      const track = currentlyPlayingResponse.data.item;
      res.status(200).json({
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        progress_ms: currentlyPlayingResponse.data.progress_ms,
        duration_ms: track.duration_ms,
      });
    } else {
      res.status(200).json({ message: "No song is currently playing." });
    }
  } catch (error) {
    // console.error("Error fetching currently playing song:", error);
    // res.status(500).json({ message: "Failed to fetch currently playing song." });
  }
});

async function logTrackToDatabase(
  userId,
  artists,
  duration,
  progress,
  popularity,
  time_played,
  track_id,
  track_name
) {
  try {
    const recipientSnapshot = await db
      .collection("UserListening")
      .where("user_id", "==", userId)
      .get();

    let recipientRef;
    if (recipientSnapshot.empty) {
      recipientRef = await db.collection("UserListening").add({
        user_id: userId,
        listening_data: [],
      });
      console.log("New document created for user.");
    } else {
      recipientRef = db
        .collection("UserListening")
        .doc(recipientSnapshot.docs[0].id);
    }

    const trackData = {
      artists,
      duration,
      popularity,
      progress,
      time_played,
      track_id,
      track_name,
    };

    await recipientRef.update({
      listening_data: admin.firestore.FieldValue.arrayUnion(trackData),
    });

    // const recipientDoc = recipientSnapshot.docs[0];
    // const recipientId = recipientDoc.id;
    // const recipientUserRef = db.collection("UserData").doc(recipientId);

    // await recipientUserRef.update({
    //   listening_data: admin.firestore.FieldValue.arrayUnion(
    //     artists,
    //     duration,
    //     popularity,
    //     progress,
    //     time_played,
    //     track_id,
    //     track_name
    //   ),
    // });
    console.log("Track added to database");
  } catch (error) {
    console.log(error);
  }
}

async function getLastPlayedTrackForUser(username) {
  console.log(username);
  const recipientSnapshot = await db
    .collection("UserListening")
    .where("user_id", "==", username)
    .get();

  if (recipientSnapshot.empty) {
    console.log("No listening data found for the user.");
    return null;
  }

  const recipientDoc = recipientSnapshot.docs[0];
  const listeningData = recipientDoc.data().listening_data;

  // Check if there is any listening data
  if (!listeningData || listeningData.length === 0) {
    console.log("No listening history found for the user.");
    return null;
  }

  const lastPlayedData = listeningData[listeningData.length - 1];
  console.log(lastPlayedData);
  const {
    artist_names,
    duration,
    popularity,
    progress,
    time_played,
    track_id,
    track_name,
  } = lastPlayedData;

  return {
    track_id,
    time_played,
  };
}

async function trackCurrentlyPlaying(userId, accessToken) {
  try {
    const currentlyPlayingResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (currentlyPlayingResponse.data && currentlyPlayingResponse.data.item) {
      const track = currentlyPlayingResponse.data;
      const artists = track.item.artists;
      const duration = track.item.duration_ms;
      const progress = track.progress_ms;
      const popularity = track.item.popularity;
      const timestamp = track.timestamp;
      const trackId = track.item.id;
      const name = track.item.name;
      console.log(artists);
      console.log(duration);
      console.log(progress);
      console.log(popularity);
      console.log(timestamp);
      console.log(trackId);
      console.log(name);

      const progressMs = currentlyPlayingResponse.data.progress_ms;
      const lastPlayed = await getLastPlayedTrackForUser(userId);
      const listenedAtLeast30Sec = progressMs >= 30000;

      if (lastPlayed) {
        const lastPlayedTrackId = lastPlayed.track_id;
        const lastPlayedProgressMs = lastPlayed.progress;

        if (trackId === lastPlayedTrackId) {
          if (listenedAtLeast30Sec) {
            if (progressMs > lastPlayedProgressMs) {
              console.log(
                "Not logging, already playing longer than last entry."
              );
              return;
            } else if (lastPlayedProgressMs - progressMs >= 30000) {
              await logTrackToDatabase(
                userId,
                artists,
                duration,
                progress,
                popularity,
                timestamp,
                trackId,
                name
              );
              console.log(`New entry logged for: ${name}`);
            }
          }
        } else if (listenedAtLeast30Sec) {
          await logTrackToDatabase(
            userId,
            artists,
            duration,
            progress,
            popularity,
            timestamp,
            trackId,
            name
          );
          console.log(`New track logged: ${name}`);
        }
      } else if (listenedAtLeast30Sec) {
        await logTrackToDatabase(
          userId,
          artists,
          duration,
          progress,
          popularity,
          timestamp,
          trackId,
          name
        );
        console.log(`First entry logged for: ${name}`);
      }
    } else {
      console.log("No song is currently playing.");
    }
  } catch (error) {
    console.error("Error fetching currently playing song:", error);
  }
}

const startSpotifyTracking = (username, token) => {
  console.log("before cron schedule");
  cron.schedule("*/30 * * * * *", () => {
    console.log("about to track currently playing");
    console.log(username);
    trackCurrentlyPlaying(username, token);
  });
};

app.post("/startTracking", async (req, res) => {
  try {
    const { username } = req.body;
    const token = accessToken;

    console.log("before tracking function call");

    startSpotifyTracking(username, token);
    res.status(200).json({ message: "Spotify tracking started." });
  } catch (error) {
    console.log(error);
  }
});

app.post("/generateReport", async (req, res) => {
  try {
    const { username, time } = req.body;
    const unixTime = new Date(time).getTime();
    const recipientSnapshot = await db
      .collection("UserListening")
      .where("user_id", "==", username)
      .get();

    if (recipientSnapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const listeningData = recipientDoc.data().listening_data;

    const filteredData = listeningData.filter(
      (item) => item.time_played >= unixTime
    );

    let totalTime = 0;
    const trackMap = {};
    const artistMap = {};
    const artistListenTime = {};

    filteredData.forEach((item) => {
      const { track_id, track_name, duration, popularity, artists } = item;

      totalTime += Math.round(duration / 60000);

      if (!trackMap[track_id]) {
        trackMap[track_id] = {
          trackId: track_id,
          track_name,
          count: 0,
        };
      }
      trackMap[track_id].count += 1;

      artists.forEach((artist) => {
        const { id: artistId, name: artistName } = artist;

        if (!artistMap[artistId]) {
          artistMap[artistId] = {
            artistId,
            name: artistName,
            count: 0,
          };
        }
        artistMap[artistId].count += 1;

        if (!artistListenTime[artistId]) {
          artistListenTime[artistId] = {
            artistId,
            name: artistName,
            minutes: 0,
          };
        }
        artistListenTime[artistId].minutes += Math.round(duration / 60000);
      });
    });

    res.status(200).json({
      totalTime: Math.round(totalTime),
      trackMap: Object.values(trackMap).sort((a, b) => b.count - a.count),
      artistMap: Object.values(artistMap).sort((a, b) => b.count - a.count),
      artistListenTime: Object.values(artistListenTime).sort(
        (a, b) => b.minutes - a.minutes
      ),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
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
  // console.log(data);
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
  user = req.query.user;
  console.log(user);
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
      saveToken(user);
      // Redirect to frontend with tokens
      // res.send(`
      //   <script>
      //     window.opener.postMessage({
      //       access_token: "${access_token}",
      //       refresh_token: "${refresh_token}"
      //     }, "*");
      //     window.close();
      //   </script>
      // `);
      res.redirect(

        `${frontUrl}/transferToken?` +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token,
          })
      );
    } else {
      // console.log("error");
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

app.post("/generate2FACode", async (req, res) => {
  const { username } = req.body;
  user = username
  // Validate input
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Fetch the user by username
    const userSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

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
      service: "gmail",
      auth: {
        user: "putmeonproject@gmail.com", // Your email address
        pass: "rvrl pstn twfh kjip ", // Your email password or app password
      },
    });

    // Send the email with the verification code
    const mailOptions = {
      from: "putmeonproject@gmail.com",
      to: userEmail,
      subject: "Your 2FA Verification Code",
      text: `Hello,\n\nYour verification code is: ${verificationCode}\nThis code will expire in 5 minutes.\n\nBest regards,\nYour Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("Error generating 2FA code:", error);
    return res
      .status(500)
      .json({ message: "Error generating 2FA code", error: error.message });
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
app.get("/checkUserExists", (req, res) => {
  try {
    const getUsers = db.collection("UserData");
    const user = req.query.user;
    console.log(user);
    const value = getUsers.where('username', '==', user);
    const newVal = value.get().then((snapshot) => {
      res.status(200).json(snapshot);
    })

    // res.status(200).json({ message: "user exists" });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }


})
app.get("/recentlyPlayed", async (req, res) => {
  try {
    const userN = req.query.user;
    const usersCollection = db.collection('UserData');
    const val = usersCollection.where('username', '==', userN);
    const snapshot = await val.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const token = userDoc.data().accessToken; 
    // console.log(token);
    const recentlyPlayed = await axios.get(
      `https://api.spotify.com/v1/me/player/recently-played?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(recentlyPlayed)

    res.status(200).json({ data: recentlyPlayed.data });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: error });
  }
});

app.post("/savePopScore", async(req,res) => {
  const popScore = req.body.popScore;
  const user = req.body.user;
  await savePopularityScore(user, popScore);
  res.status(200).json({ message: "Success" });
})
app.post("/saveFollowers", async(req,res) => {
  const followers = req.body.followers;
  const user = req.body.user;
  await saveFollowers(user, followers);
  res.status(200).json({ message: "Success" });
})
app.get("/getPopScore", async(req,res) => {
  const username = req.query.user;
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
})

app.post("/saveRecentlyPlayed", async(req, res) => {
  const song = req.body.song;
  const user = req.body.user;
  const currentLikes = req.body.likes;
  const likedBy = req.body.likedBy;
  const laughingLikes = req.body.laughing;
  const laughingLikedBy = req.body.laughingLikedBy;
  const fire = req.body.fire;
  const fireLikedBy = req.body.fireLikedBy;
  const comments = req.body.comments;
  const totalLikes = req.body.totalLikes;
  const totalReactions = req.body.totalReactions;
  const totalComments = req.body.totalComments
  console.log(likedBy);
  await saveRecentlyPlayed(user, song, currentLikes, likedBy, laughingLikes, laughingLikedBy, fire, fireLikedBy, comments, totalLikes, totalReactions, totalComments);
  res.status(200).json({ message: "Success" });

})
app.get("/getRecentlyPlayed", async (req, res) => {
  const username = req.query.user;
  console.log(username);
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
app.get("/getFollowers", async (req,res) => {
  const token = accessToken;
  const response = await axios.get(
    `https://api.spotify.com/v1/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const followers = response.data.followers.total;
  console.log("Followers:" + followers);
  res.status(200).json({ data: followers });
});



app.post("/fetchChats", async (req, res) => {
  try {
    const { username } = req.body;

    const recipientSnapshot = await db
      .collection("UserData")
      .where("username", "==", username)
      .get();

    if (recipientSnapshot.empty) {
      // console.log("this is an issue");
      return res.status(404).json({ message: "User not found" });
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientData = recipientDoc.data();

    if (recipientData.chats) {
      // console.log("okay so now we're here");
      res.json({ chats: recipientData.chats });

    } else {
      // console.log("le sigh");
      res.json({ chats: [] });
    }
  } catch (error) {
    // console.log("why oh why");
    console.log(error);
    res.status(500).send(error);
  }
});

app.post('/fetchChatNames', async (req, res) => {
  const { chatIDs, currentUser } = req.body;
  const chatNames = [];

  // console.log("chatIDs=" + chatIDs);
  try {
    for (const chatID of chatIDs) {
      const querySnapshot = await db.collection('MessageData')
        .where('chatID.id', '==', chatID)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const messageDoc = querySnapshot.docs[0];
        let participants = messageDoc.data().participants;
        participants = participants.filter(participant => participant !== currentUser)
          .sort();
        chatNames.push(participants);
      } else {
        // console.log("so its empty/");
      }
    }

    res.status(200).json({ chatNames });
  } catch (error) {
    console.error('Error fetching chat names:', error);
    res.status(500).json({ error: 'Failed to fetch chat names' });
  }
});

app.post("/insertChat", async (req, res) => {
  try {
    const chatInfo = db.collection("MessageData").doc();

    await chatInfo.set({
      text: req.body.text,
      createdAt: req.body.createdAt,
      sender: req.body.sender,
      recipient: req.body.recipient,
      participants: req.body.participants,
      chatID: req.body.chatID,
    });

    if (typeof req.body.recipient === 'string') {
      console.log("case string");
      const recipientSnapshot = await db
        .collection("UserData")
        .where("username", "==", req.body.recipient)
        .get();

      if (recipientSnapshot.empty) {
        return res.status(404).json({ message: "User not found" });
      }
      const recipientDoc = recipientSnapshot.docs[0];
      const recipientId = recipientDoc.id;

      const notificationData = {
        message: `Unread message from from ${req.body.sender}`,
        recipient: recipientId,
        sender: req.body.sender,
        status: "unread",
        type: "msg",
      };

      const recipientUserRef = db.collection("UserData").doc(recipientId);
      const recipientUserDoc = await recipientUserRef.get();
      const recipientData = recipientUserDoc.data();

      if (recipientData.notifications) {
        await recipientUserRef.update({
          notifications: admin.firestore.FieldValue.arrayUnion(notificationData),
        });
      } else {
        await recipientUserRef.set(
          { notifications: [notificationData] },
          { merge: true }
        );
      }
    } else {
      console.log("case array");
      for (const rec of req.body.recipient) {
        const recipientSnapshot = await db
          .collection("UserData")
          .where("username", "==", rec)
          .get();

        if (recipientSnapshot.empty) {
          return res.status(404).json({ message: "User not found" });
        }

        const recipientDoc = recipientSnapshot.docs[0];
        const recipientId = recipientDoc.id;

        const chatName = req.body.participants
          .filter(element => element !== rec)
          .join(", ");
        const notificationData = {
          message: `Unread message from from ${chatName}`,
          recipient: recipientId,
          sender: req.body.sender,
          status: "unread",
          type: "msg",
        };

        const recipientUserRef = db.collection("UserData").doc(recipientId);
        const recipientUserDoc = await recipientUserRef.get();
        const recipientData = recipientUserDoc.data();

        if (recipientData.notifications) {
          await recipientUserRef.update({
            notifications: admin.firestore.FieldValue.arrayUnion(notificationData),
          });
        } else {
          await recipientUserRef.set(
            { notifications: [notificationData] },
            { merge: true }
          );
        }
      }
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/updateUserChats', async (req, res) => {
  const { participants, newChatID } = req.body;

  // Log the inputs for debugging
  // console.log('Updating chats for user:', username);
  // console.log('New Chat ID:', newChatID);

  if (!Array.isArray(participants) || participants.length === 0) {
    return res.status(400).send({ error: 'Invalid participants array' });
  }

  // Ensure newChatID is a valid string
  if (typeof newChatID !== 'string' || !newChatID) {
    console.error('Invalid newChatID:', newChatID);
    return res.status(400).send({ error: 'Invalid newChatID' });
  }

  try {
    const updatePromises = participants.map(async (username) => {
      // Query the UserData collection to find the user by username
      const querySnapshot = await db.collection('UserData')
        .where('username', '==', username)
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        // Update the chats field for the matched user document
        const userDoc = querySnapshot.docs[0];
        await userDoc.ref.update({
          chats: admin.firestore.FieldValue.arrayUnion(newChatID),
        });
      } else {
        console.warn(`User with username ${username} not found.`);
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    res.status(200).send({ message: 'User chats updated successfully for all participants' });
  } catch (error) {
    console.error('Error updating user chats:', error);
    res.status(500).send({ error: 'Failed to update user chats for participants' });
  }
});

app.post('/fetchChatHistory', async (req, res) => {
  const { chatID } = req.body; // Get chatID from request body
  // console.log("chat history id = " + chatID);

  if (!chatID) {
    return res.status(400).json({ error: 'Chat ID is required.' });
  }

  try {
    const messagesSnapshot = await db.collection('MessageData')
      .where('chatID.id', '==', chatID)
      .orderBy('createdAt') // Ensure messages are ordered by creation time
      .get();

    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages. Please try again later.' });
  }
});

app.post('/fetchChatInfo', async (req, res) => {
  const { chatID , sender } = req.body;

  // console.log("my fetch id = " + chatID );

  if (!chatID) {
    return res.status(400).json({ error: 'Chat ID is required.' });
  }

  if (!sender) {
    return res.status(400).json({ error: 'sender is required.' });
  }
  
  try {
    const querySnapshot = await db.collection('MessageData')
      .where('chatID.id', '==', chatID)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'No document found' });
    }

    const participants = querySnapshot.docs[0].data().participants;
    const recipients = participants.filter(participant => participant !== sender);

    return res.status(200).json({ participants:participants, recipients:recipients });
  } catch (error) {
    console.error('Error fetching chat info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/fetchChatRecipients', async (req, res) => {
  const { chatID, sender } = req.body;

  console.log("received chatID, sender:" + chatID + " " + sender);

  if (!chatID) {
    return res.status(400).json({ error: 'Chat ID is required.' });
  }
  if (!sender) {
    return res.status(400).json({ error: 'sender is required.' });
  }

  try {
    const querySnapshot = await db.collection('MessageData')
      .where('chatID.id', '==', chatID)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      // console.log("okay so it is in fact empty");
      return res.status(404).json({ message: 'No document found' });
    }

    const allParticipants = querySnapshot.docs[0].data().participants;
    const recipients = allParticipants.filter(participant => participant !== sender);

    return res.status(200).json({ recipients: recipients });
  } catch (error) {
    console.error('Error fetching recipients:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log("Server running on port " + port);
});
