const admin = require("firebase-admin");
require('dotenv').config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_KEY);
// const serviceAccount = require(`${process.env.FIREBASE_SERVICE_KEY}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://put-me-on-418b7-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;