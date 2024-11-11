
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
  const datasetPath = path.join(__dirname, "../../datasets/top_10000_1950-now.csv");

  // Open the CSV file and read data row by row
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on("data", async (row) => {
      try {
        // For each row, create a document reference in Firestore
        // const docRef = doc(db, "spotifySongs", uuidv4()); // Using UUID for unique document IDs
        // await setDoc(docRef, row);
        const docRef = db.collection("spotifySongs").doc(uuidv4()); // Using UUID for unique document IDs
        await docRef.set(row);
        console.log(`Uploaded: ${row.Song} by ${row.Artist}`);
      } catch (error) {
        console.error("Error uploading document:", error);
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed and data uploaded.");
    });
}

// Run the upload function
uploadSongs();
