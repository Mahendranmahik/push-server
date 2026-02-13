const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ✅ Firebase Service Account from Render ENV (3 variables)
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// API endpoint
app.post("/sendPush", async (req, res) => {
  const { token, title, body } = req.body;

  if (!token) {
    return res.status(400).send("FCM token missing");
  }

  const message = {
    notification: {
      title: title || "New Message",
      body: body || "You received a message",
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Push sent:", response);
    res.send("Push Sent Successfully");
  } catch (e) {
    console.error("Push Error:", e);
    res.status(500).send("Error sending push");
  }
});

// Render auto PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
