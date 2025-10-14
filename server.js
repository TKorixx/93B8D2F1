// WaveVibe backend server
const express = require("express");
const app = express();
const PORT = 3000;

// Engedélyezzük a JSON kérések feldolgozását
app.use(express.json());

// Mintaadatok
const artists = [
  { id: 1, name: "Azahriah", genre: "Pop / Alternative" },
  { id: 2, name: "Desh", genre: "HipHop / RnB" },
  { id: 3, name: "T. Danny", genre: "Pop / Rap" },
  { id: 4, name: "Bruno x Spacc", genre: "Trap / Party" },
];

// Alap útvonal (teszt)
app.get("/", (req, res) => {
  res.send("WaveVibe API működik 🎵");
});

// GET /artists - összes előadó
app.get("/artists", (req, res) => {
  res.json(artists);
});

// POST /artists - új előadó hozzáadása (extra pontért)
app.post("/artists", (req, res) => {
  const newArtist = req.body;
  if (!newArtist.name || !newArtist.genre) {
    return res.status(400).json({ message: "Hiányzó adatok" });
  }
  newArtist.id = artists.length + 1;
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

// Szerver indítása
app.listen(PORT, () => {
  console.log(`🎧 Szerver fut: http://localhost:${PORT}`);
});
