const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Public/assets mappa kiszolgálása ---
const assetsPath = path.join(__dirname,"assets");
if (!fs.existsSync(assetsPath)) fs.mkdirSync(assetsPath, { recursive: true });
app.use("/assets", express.static(assetsPath));

// --- Multer feltöltés konfiguráció ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, assetsPath),
  filename: (req, file, cb) => {
    const safeName = req.body.name.toLowerCase().replace(/\s+/g, "-");
    const ext = path.extname(file.originalname);
    cb(null, `${safeName}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// --- Mintaadatok ---
let artists = [
  { 
    id: 1, 
    name: "Azahriah", 
    genre: "Pop / Alternative", 
    imageFile: "azahriah.jpg", 
    info: "Azahriah a magyar pop és alternatív zenei színtér egyik legismertebb fiatal előadója. Karizmatikus stílusa és kreatív dalszövegei miatt rengeteg rajongóval rendelkezik.",
    musicinfo: "„Rampapapam” Azahriah egyik legismertebb és legmeghatározóbb dala.",
    youtube: "https://www.youtube.com/embed/SHTqyvPB78E?list=RDSHTqyvPB78E&start_radio=1"
  },
  { 
    id: 2, 
    name: "Desh", 
    genre: "HipHop / RnB", 
    imageFile: "desh.jpg", 
    info: "Desh a magyar hiphop világ feltörekvő csillaga. Egyedi flow-ja és lírai stílusa miatt különleges helyet foglal el a zenei palettán.",
    musicinfo: "„Mokka” Desh egyik legnépszerűbb dala.",
    youtube: "https://www.youtube.com/embed/RT00oAdUmYc?list=RDRT00oAdUmYc&start_radio=1"
  },
  { 
    id: 3, 
    name: "T. Danny", 
    genre: "Pop / Rap", 
    imageFile: "tdanny.jpg", 
    info: "T. Danny egy sokoldalú előadó, aki a pop és rap elemeit ötvözi zenéjében. Lemezei és videoklipjei nagy sikert arattak a fiatal közönség körében.",
    musicinfo: "„Pletyka” T. Danny egyik legismertebb slágere.",
    youtube: "https://www.youtube.com/embed/B8wL1GIDcm4?list=RDB8wL1GIDcm4"
  },
  { 
    id: 4, 
    name: "Bruno x Spacc", 
    genre: "Trap / Party", 
    imageFile: "brunoxspacc.jpg", 
    info: "Bruno x Spacc a trap és party zenei stílus egyik kiemelkedő képviselője Magyarországon. Dinamikus dalai garantáltan felpörgetik a hangulatot.",
    musicinfo: "„MOLLYWOOD (Afterparty)” Bruno x Spacc egyik legikonikusabb bulislágere.",
    youtube: "https://www.youtube.com/embed/EePoS6COqYs"
  },
];

let songs = [
  { id: 1, artist: "Azahriah", title: "Rampapapam", year: 2025, nezettseg:15000000 },
  { id: 2, artist: "Desh", title: "Mokka", year: 2025, nezettseg:29000000 },
  { id: 3, artist: "T. Danny", title: "Pletyka", year: 2025, nezettseg:2000000 },
  { id: 4, artist: "Bruno x Spacc", title: "Afterparty", year: 2025, nezettseg:814000 },
];

// --- API végpontok ---
app.get("/artists", (req, res) => res.json(artists));
app.get("/songs", (req, res) => res.json(songs));

app.post("/artists", upload.single("artistImage"), (req, res) => {
  const { name, genre, info } = req.body; // info mező hozzáadva
  if (!name || !genre) return res.status(400).json({ message: "Hiányzó name vagy genre" });

  const imageFile = req.file ? req.file.filename : "default.jpg";
  const newArtist = { id: artists.length + 1, name, genre, imageFile, info }; // info elmentése
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

app.listen(PORT, () => console.log(`Backend fut: http://localhost:${PORT}`));
