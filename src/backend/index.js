const express = require("express");
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors")

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
    console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({username, password, isPublic});
    console.log("success")
    res.status(200).json({message: "Success"});
  } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
  }
});

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

app.post("/api/user-details", async (req, res) => {
  //const { username, email } = req.body;
  const { username } = req.body;
  try {
    const userRef = db.collection("UserData").where("username", "==", username);
    const userDoc = await userRef.get();

    if (userDoc.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userDoc.docs[0].id;
    //await db.collection("UserData").doc(userId).update({ email });
    //res.status(200).json({ message: "User details updated!" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/privacy", async (req, res) => {
  const { username, isPublic } = req.body;
  try {
    const userRef = db.collection("UserData").where("username", "==", username);
    const userDoc = await userRef.get();

    if (userDoc.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userDoc.docs[0].id;
    await db.collection("UserData").doc(userId).update({ isPublic: isPublic });
    res.status(200).json({ message: "Privacy settings updated!" });
  } catch (error) {
    console.error("Error updating privacy settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/linked-accounts", async (req, res) => {
  //const { username, linkedAccounts } = req.body;
  const { username } = req.body;
  try {
    const userRef = db.collection("UserData").where("username", "==", username);
    const userDoc = await userRef.get();

    if (userDoc.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userDoc.docs[0].id;
    //await db.collection("UserData").doc(userId).update({ linkedAccounts });
    //
    res.status(200).json({ message: "Linked accounts updated!" });
  } catch (error) {
    console.error("Error updating linked accounts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port)
})
