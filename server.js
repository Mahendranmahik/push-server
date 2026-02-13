const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

// API endpoint
app.post("/sendPush", async (req, res) => {
  const { token, title, body } = req.body;

  const message = {
    notification: { title, body },
    token: token,
  };

  try {
    await admin.messaging().send(message);
    res.send("Push Sent Successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send("Error sending push");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
