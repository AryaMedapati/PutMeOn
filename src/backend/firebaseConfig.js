const admin = require("firebase-admin");
const serviceAccount = require("./servicekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://put-me-on-418b7-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = db;