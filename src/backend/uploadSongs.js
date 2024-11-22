
// const { getFirestore, doc, setDoc } = require("firebase/firestore");
const bp = require("body-parser");
const db = require("./firebaseConfig");
const admin = require("firebase-admin");
const request = require("request");
const querystring = require("querystring");
const cron = require("node-cron");
const { createCanvas } = require("canvas");
const { Chart, registerables } = require("chart.js");
Chart.register(...registerables);

let user = "";
const { ArrayTimestamp } = require("@blueprintjs/icons");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Function to upload data from CSV to Firebase
async function uploadSongs() {
  const datasetPath = path.join(__dirname, "../../datasets/top10k-spotify-artist-metadata.csv");

  // Open the CSV file and read data row by row
  const songsArray = []; // Initialize an array to hold all songs

  // Open the CSV file and read data row by row
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on("data", (row) => {
      songsArray.push(row); // Collect each row into the array
    })
    .on("end", async () => {
      try {
        // Once all rows are read, create a single document with the array
        const docRef = db.collection("spotifySongs").doc("top_800_artists");
        await docRef.set({ artists: songsArray }); // Store all songs in an array under the 'songs' field
        console.log("All songs uploaded as a single document.");
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    });
}

// Run the upload function
uploadSongs();
