const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

let followers = {}; // { profileUserId: [userIds...] }

// Toggle follow/unfollow API
app.post("/api/follow-toggle/:profileId", (req, res) => {
  const { userId } = req.body;
  const profileId = req.params.profileId;

  if (!followers[profileId]) followers[profileId] = [];

  if (followers[profileId].includes(userId)) {
    // Unfollow
    followers[profileId] = followers[profileId].filter(id => id !== userId);
    res.json({ message: "You unfollowed this user", following: false });
  } else {
    // Follow
    followers[profileId].push(userId);
    res.json({ message: "You are now following this user", following: true });
  }
});

// Old follow API (no change)
app.post("/api/follow/:profileId", (req, res) => {
  const { userId } = req.body;
  const profileId = req.params.profileId;

  if (!followers[profileId]) followers[profileId] = [];

  if (!followers[profileId].includes(userId)) {
    followers[profileId].push(userId);
    res.json({ message: "You are now following this user" });
  } else {
    res.json({ message: "Already following" });
  }
});

// Old unfollow API (no change)
app.post("/api/unfollow/:profileId", (req, res) => {
  const { userId } = req.body;
  const profileId = req.params.profileId;

  if (followers[profileId]) {
    followers[profileId] = followers[profileId].filter(id => id !== userId);
    res.json({ message: "You unfollowed this user" });
  } else {
    res.json({ message: "You were not following" });
  }
});

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

//  Demo login/register APIs
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ success: true, email });
});
app.post("/logout", (req, res) => {
  // Client ko bolenge token delete kare
  res.json({ message: "Logged out successfully" });
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  res.json({ success: true, email });
});

//  Only ONE listen (5000 hata diya, 3000 final)
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


