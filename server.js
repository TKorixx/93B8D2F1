// WaveVibe backend - server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());          // engedélyezzük a CORS-t a frontendnek
app.use(express.json());

// Mintaadatok
let artists = [
  { id: 1, name: "Azahriah", genre: "Pop / Alternative" },
  { id: 2, name: "Desh", genre: "HipHop / RnB" },
  { id: 3, name: "T. Danny", genre: "Pop / Rap" },
  { id: 4, name: "Bruno x Spacc", genre: "Trap / Party" },
];

// Alap
app.get("/", (req, res) => {
  res.send("WaveVibe API működik 🎵");
});

// GET /artists
app.get("/artists", (req, res) => {
  res.json(artists);
});

// POST /artists (hozzáadás) - extra pont
app.post("/artists", (req, res) => {
  const { name, genre } = req.body;
  if (!name || !genre) {
    return res.status(400).json({ message: "Hiányzó name vagy genre" });
  }
  const newArtist = { id: artists.length + 1, name, genre };
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

app.listen(PORT, () => {
  console.log(`🎧 WaveVibe API fut: http://localhost:${PORT}`);
});
