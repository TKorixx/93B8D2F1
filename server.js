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
app.use("/assets", express.static(assetsPath));

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
    info: "Azahriah a magyar pop és alternatív zenei színtér egyik legismertebb fiatal előadója. Karizmatikus stílusa és kreatív dalszövegei miatt rengeteg rajongóval rendelkezik. Számos koncerttel és lemezzel örvendezteti meg a közönséget.",
    musicinfo: "„Rampapapam” Azahriah egyik legismertebb és legmeghatározóbb dala, amely a modern magyar popzene határait feszegeti. A dalban keveredik a pop, az alternatív és az elektronikus hangzás, miközben a refrén azonnal fülbemászóvá teszi. A „Rampapapam” szövege az önazonosságról, szabadságról és a fiatalos lendületről szól — tökéletesen tükrözve Azahriah generációs üzenetét. A klip vizuálisan is kiemelkedő, hiszen látványos képi világa tökéletesen kiegészíti a dal energikus, mégis érzelmes hangulatát.",
    youtube: "https://www.youtube.com/embed/SHTqyvPB78E?list=RDSHTqyvPB78E&start_radio=1"
  },
  { 
    id: 2, 
    name: "Desh", 
    genre: "HipHop / RnB", 
    imageFile: "desh.jpg", 
    info: "Desh a magyar hiphop világ feltörekvő csillaga. Egyedi flow-ja és lírai stílusa miatt különleges helyet foglal el a zenei palettán. Számos együttműködés és fesztivál fellépés jellemzi pályafutását.",
    musicinfo: "„Mokka” Desh egyik legnépszerűbb dala, amely a könnyed, mégis stílusos RnB és trap elemeket ötvözi. A szám egy laza, magabiztos életérzést közvetít, miközben a szövegben visszaköszön Desh jellegzetes humoros és önironikus stílusa. A „Mokka” refrénje rendkívül fülbemászó, emiatt a klubokban és a TikTokon is gyorsan virálissá vált. A dal videóklipje látványos, modern vizuális világot mutat, ami tovább erősíti Desh egyedi előadói karakterét.",
    youtube: "https://www.youtube.com/embed/RT00oAdUmYc?list=RDRT00oAdUmYc&start_radio=1"
  },
  { 
    id: 3, 
    name: "T. Danny", 
    genre: "Pop / Rap", 
    imageFile: "tdanny.jpg", 
    info: "T. Danny egy sokoldalú előadó, aki a pop és rap elemeit ötvözi zenéjében. Lemezei és videoklipjei nagy sikert arattak a fiatal közönség körében. Előadásai mindig energikusak és interaktívak.",
    musicinfo: "„Pletyka” T. Danny egyik legismertebb slágere, amelyben a fiatal előadó a hírnév árnyoldalait és a róla keringő szóbeszédeket dolgozza fel. A dal egyaránt hordoz popos dallamokat és modern rap-elemeket, miközben őszintén reflektál a közösségi média világára és a személyes támadásokra. A fülbemászó refrén és az őszinte szöveg miatt sokan tudnak vele azonosulni, ezért gyorsan a toplisták élére került. A klip vizuálisan is erős, modern, városi hangulatot áraszt, tökéletesen kiegészítve T. Danny karakterét.",
    youtube: "https://www.youtube.com/embed/B8wL1GIDcm4?list=RDB8wL1GIDcm4"
  },
  { 
    id: 4, 
    name: "Bruno x Spacc", 
    genre: "Trap / Party", 
    imageFile: "brunoxspacc.jpg", 
    info: "Bruno x Spacc a trap és party zenei stílus egyik kiemelkedő képviselője Magyarországon. Dinamikus dalai garantáltan felpörgetik a hangulatot. Rajongói különösen szeretik a bulis, energikus előadásait." ,
    musicinfo: "„MOLLYWOOD (Afterparty)” Bruno x Spacc egyik legikonikusabb bulislágere, amely tökéletesen visszaadja a fiatalos életérzést és az éjszakai partik felszabadult hangulatát. A dal lendületes ütemei és fülbemászó refrénje miatt gyorsan közönségkedvenc lett a magyar trap és pop szcénában. A szövegben keveredik a luxusélet, a humor és a könnyed szórakozás, ami tipikusan Bruno x Spacc stílusát tükrözi. A klipben a srácok sajátos, vagány energiája uralja a képernyőt, igazi modern „afterparty-himnusz” lett belőle.",
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
  const { name, genre, info } = req.body;
  if (!name || !genre) return res.status(400).json({ message: "Hiányzó name vagy genre" });

  const imageFile = req.file ? req.file.filename : "default.jpg";
  const newArtist = { id: artists.length + 1, name, genre, imageFile, info };
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

app.listen(PORT, () => console.log(`Backend fut: http://localhost:${PORT}`));
