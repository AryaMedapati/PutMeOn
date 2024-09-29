const express = require("express");
const bp = require("body-parser");
const db = require("./firebaseConfig");
const cors = require("cors")

const app = express();
const port = process.env.PORT || 3001;
app.use(bp.json());
app.use(cors())

app.post("/insertUser", async (req, res) => {
  const{username, password} = req.body;
  try{
    console.log("Here")
    const userInfo = db.collection("UserData").doc();
    await userInfo.set({username, password});
    console.log("success")
    res.status(200).json({message: "Success"});
  } catch (error) {
      console.log(error)
      res.status(500).json({message: error})
  }
});

app.listen(port, () => {
  console.log("Server running on port " + port)
})
