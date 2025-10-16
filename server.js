// 93B8D2F1/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer"); 
const path = require("path");      
const fs = require('fs'); 
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());          
app.use(express.json());  

// --- KÉPFELTÖLTÉS ÉS STATIKUS FÁJLOK KONFIGURÁCIÓJA ---

// Ha a mappák a 'C:\Users\Kori\Desktop' alatt vannak:
// Két szintet lépünk fel (Desktop), majd belépünk a másik mappába.
const desktopPath = path.join(__dirname, '..', '..');
const frontendPublicPath = path.join(desktopPath, '1C7A5B3E', 'public');
// Ezt az útvonalat kézzel is ellenőrizheti: C:\Users\Kori\Desktop\1C7A5B3E\public

app.use(express.static(frontendPublicPath)); 

// A feltöltés célmappája
const uploadDir = path.join(frontendPublicPath, 'assets');

// Mappa ellenőrzése és létrehozása
if (!fs.existsSync(uploadDir)) {
    console.log(`Létrehozzuk a mappát: ${uploadDir}`);
    fs.mkdirSync(uploadDir, { recursive: true });
} else {
    console.log(`Feltöltési mappa útvonala: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    const artistName = req.body.name.toLowerCase().replace(/\s+/g, '-');
    const extension = path.extname(file.originalname); 
    const newFileName = `${artistName}-${Date.now()}${extension}`;
    cb(null, newFileName); 
  }
});

const upload = multer({ storage: storage });

// --- MINTAADATOK ---

let artists = [
  { id: 1, name: "Azahriah", genre: "Pop / Alternative", imageFile: "azahriah.jpg" },
  { id: 2, name: "Desh", genre: "HipHop / RnB", imageFile: "desh.jpg" },
  { id: 3, name: "T. Danny", genre: "Pop / Rap", imageFile: "tdanny.jpg" },
  { id: 4, name: "Bruno x Spacc", genre: "Trap / Party", imageFile: "brunoxspacc.jpg" },
];

let songs = [
  { id: 1, artist: "Azahriah", title: "Rampapapam", year: 2023 },
  { id: 2, artist: "Desh", title: "Ennyi volt", year: 2024 },
  { id: 3, artist: "T. Danny", title: "Megvolt", year: 2023 },
  { id: 4, artist: "Bruno x Spacc", title: "Táncolj!", year: 2024 },
];


// --- API VÉGPONTOK ---

// GET /artists
app.get("/artists", (req, res) => {
  res.json(artists);
});

// POST /artists (Képfeltöltés)
app.post("/artists", upload.single('artistImage'), (req, res) => {
  const { name, genre } = req.body; 
  
  if (!name || !genre) {
    return res.status(400).json({ message: "Hiányzó name vagy genre" });
  }
  
  const imageFile = req.file ? req.file.filename : "";
  
  const newArtist = { id: artists.length + 1, name, genre, imageFile: imageFile }; 
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

// GET /songs
app.get("/songs", (req, res) => {
  res.json(songs);
});

// POST /songs
app.post("/songs", (req, res) => {
    // A logikusan összefüggő kódok a teljességhez
    const { artist, title, year } = req.body;
    const songYear = year || new Date().getFullYear(); 

    if (!artist || !title) {
        return res.status(400).json({ message: "Hiányzó artist vagy title" });
    }
    
    const newSong = { id: songs.length + 1, artist, title, year: Number(songYear) };
    songs.push(newSong);
    
    res.status(201).json(newSong);
});


app.listen(PORT, () => {
  console.log(`🎧 WaveVibe API fut: http://localhost:${PORT}`);
});