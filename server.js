const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

// ✅ Load Firebase key from Render ENV
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// 🔥 IMPORTANT FIX (Convert \\n to real line breaks)
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

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

// Render uses PORT automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
