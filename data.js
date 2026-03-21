const worldBossData = [
  {
    name: "Enraged Sakun / Enraged Tundro",
    images: [
      "image/Enraged-Sakun.png",
      "image/Enraged-Tundro.png"
    ],
    times: ["Mon - Sun 19:12"],
    maps: [
      { name: "Sandstorm Desert", image: "image/Sandstorm-Desert.jpg" },
      { name: "Sandfall Desert", image: "image/Sandfall-Desert.jpg" }
    ]
  },
  {
    name: "Cruel Cletus",
    images: ["image/Cruel-Cletus.png"],
    times: ["Tue 02:02", "Sat 23:02"],
    maps: [{ name: "Tainted Fen", image: "image/Tainted-Fen.jpg" }]
  },
  {
    name: "Namazu",
    images: ["image/Namazu.png"],
    times: ["Tue 19:02", "Thu 01:02", "Fri 21:02", "Sun 18:02"],
    maps: [{ name: "Pandahama Island", image: "image/Pandahama-Island.jpg" }]
  },
  {
    name: "Frigid Queen Glaceon",
    images: ["image/Frigid-Queen-Glaceon.png"],
    times: ["Wed 21:05", "Fri 03:05", "Sat 17:05"],
    maps: [{ name: "Crystal Tower", image: "image/Crystal-Tower.jpg" }]
  },
  {
    name: "Monoxia",
    images: ["image/Monoxia.png"],
    times: ["Sun 17:15"],
    maps: [{ name: "Tainted Fen", image: "image/Tainted-Fen.jpg" }]
  },
  {
    name: "The Excavater",
    images: ["image/The-Excavater.png"],
    times: ["Wed 01:02", "Thu 20:02", "Sat 20:02"],
    maps: [
      { name: "Sandstorm Desert", image: "image/Sandstorm-Desert.jpg" },
      { name: "Port Plunder", image: "image/Port-Plunder.jpg" }
    ]
  },
  {
    name: "Okeanos",
    images: ["image/Okeanos.png"],
    times: ["Thu 00:05", "Sun 20:02"],
    maps: [
      { name: "Port Plunder", image: "image/Port-Plunder.jpg" },
      { name: "Hidden Cavern 3F", image: "image/Hidden-Cavern-3F.jpg" }
    ]
  },
  {
    name: "Ishva",
    images: ["image/Ishva.png"],
    times: ["Sat 21:05"],
    maps: [{ name: "Hidden Hollow", image: "image/Hidden-Hollow.jpg" }]
  },
  {
    name: "Hedorah / Sraclone",
    images: [
      "image/Hedorah.png",
      "image/Sraclone.png"
    ],
    times: ["Tue 20:05", "Fri 22:05"],
    maps: [{ name: "Hidden Cavern 3F", image: "image/Hidden-Cavern-3F.jpg" }]
  },
  {
    name: "Pyre Lord Azjolor / Rakdos",
    images: [
      "image/Pyre-Lord-Azjolor.png",
      "image/Rakdos.png"
    ],
    times: ["Mon: 04:03 22:03", "Tue - Thu: 22:03", "Fri: 16:03 22:03", "Sat - Sun: 04:03 16:03 22:03"],
    maps: [{ name: "The Fire Pit", image: "image/The-Fire-Pit.jpg" }]
  }
];

const reflectionData = [
  {
    name: "Skerris",
    image: "image/Skerris.png",
    magicStats: "70 45 15",
    physicalStats: "63 38 8",
    mapName: "Catacombs",
    mapImage: "image/Catacombs.jpg"
  },
  {
    name: "Cruel Cletus",
    image: "image/Cruel-Cletus.png",
    magicStats: "90 65 50",
    physicalStats: "80 60 30",
    mapName: "Tainted Fen",
    mapImage: "image/Tainted-Fen.jpg"
  },
  {
    name: "Typhoonus",
    image: "image/Typhoonus.png",
    magicStats: "90 70 50 30 10",
    physicalStats: "90 70 50 30 10",
    mapName: "Golden Temple",
    mapImage: "image/Golden-Temple.jpg"
  },
  {
    name: "Okeanos",
    image: "image/Okeanos.png",
    magicStats: "90 70 50 30",
    physicalStats: "90 70 50 30",
    mapName: "Port Plunder",
    mapImage: "image/Port-Plunder.jpg"
  },
  {
    name: "Avatar of Archane",
    image: "image/Avatar-of-Archane.png",
    magicStats: "75 50 25",
    physicalStats: "75 50 25",
    mapName: "Dead Mans Peak",
    mapImage: "image/Dead-Mans-Peak.jpg"
  },
  {
    name: "Gigabit",
    image: "image/Gigabit.png",
    magicStats: "75 50 25",
    physicalStats: "75 50 25",
    mapName: "Von Steins Mansion",
    mapImage: "image/Von-Steins-Mansion.jpg"
  },
  {
    name: "Livid",
    image: "image/Livid.png",
    magicStats: "90",
    physicalStats: "90",
    mapName: "Colossus Shadowfields",
    mapImage: "image/Colossus-Shadowfields.jpg"
  },
  {
    name: "Gigantes the Insane",
    image: "image/Gigantes-the-Insane.png",
    magicStats: "50",
    physicalStats: "50",
    mapName: "Decomus",
    mapImage: "image/Decomus.jpg"
  },
  {
    name: "Roszak",
    image: "image/Roszak.png",
    magicStats: "40",
    physicalStats: "40",
    mapName: "Paniye Circus Troupe",
    mapImage: "image/Paniye-Circus-Troupe.jpg"
  },
  {
    name: "Lost Mysterion",
    image: "image/Lost-Mysterion.png",
    magicStats: "Unknown",
    physicalStats: "Unknown",
    mapName: "Nightfall Shelter",
    mapImage: "image/Nightfall-Shelter.jpg"
  }
];

const battlefieldData = [
  { time: "07:43", mode: "Flagmatch" },
  { time: "08:03", mode: "Molten Arena" },
  { time: "08:23", mode: "Deathmatch" },
  { time: "08:43", mode: "Flagmatch" },
  { time: "09:03", mode: "Molten Arena" },
  { time: "09:23", mode: "Deathmatch" },
  { time: "09:43", mode: "Flagmatch" },
  { time: "10:03", mode: "Molten Arena" },
  { time: "10:23", mode: "Deathmatch" },
  { time: "10:43", mode: "Flagmatch" },
  { time: "11:03", mode: "Molten Arena" },
  { time: "11:23", mode: "Deathmatch" },
  { time: "11:43", mode: "Flagmatch" },
  { time: "12:03", mode: "Molten Arena" },
  { time: "12:23", mode: "Deathmatch" },
  { time: "12:43", mode: "Flagmatch" },
  { time: "13:03", mode: "Molten Arena" },
  { time: "13:23", mode: "Colosseum" },
  { time: "13:43", mode: "Flagmatch" },
  { time: "14:03", mode: "Molten Arena" },
  { time: "14:23", mode: "Battle of Atlantis" },
  { time: "14:43", mode: "Capture the Flag" },
  { time: "15:03", mode: "Molten Arena" },
  { time: "15:23", mode: "Deathmatch" },
  { time: "15:43", mode: "Flagmatch" },
  { time: "16:23", mode: "Battle of Atlantis" },
  { time: "16:43", mode: "Capture the Flag" },
  { time: "17:03", mode: "Molten Arena" },
  { time: "17:23", mode: "Deathmatch" },
  { time: "17:43", mode: "Flagmatch" },
  { time: "18:03", mode: "Molten Arena" },
  { time: "18:23", mode: "Colosseum" },
  { time: "18:43", mode: "Capture the Flag" },
  { time: "19:03", mode: "Molten Arena" },
  { time: "19:23", mode: "Deathmatch" },
  { time: "19:43", mode: "Flagmatch" },
  { time: "20:03", mode: "Molten Arena" },
  { time: "20:23", mode: "Battle of Atlantis" },
  { time: "20:43", mode: "Capture the Flag" },
  { time: "21:03", mode: "Molten Arena" },
  { time: "21:23", mode: "Colosseum" },
  { time: "21:43", mode: "Flagmatch" },
  { time: "22:23", mode: "Battle of Atlantis" },
  { time: "22:43", mode: "Capture the Flag" },
  { time: "23:03", mode: "Molten Arena" },
  { time: "23:23", mode: "Deathmatch" },
  { time: "23:43", mode: "Flagmatch" },
  { time: "00:03", mode: "Molten Arena" },
  { time: "00:23", mode: "Colosseum" },
  { time: "00:43", mode: "Capture the Flag" },
  { time: "01:03", mode: "Molten Arena" },
  { time: "01:23", mode: "Deathmatch" },
  { time: "01:43", mode: "Flagmatch" },
  { time: "02:03", mode: "Molten Arena" },
  { time: "02:23", mode: "Battle of Atlantis" },
  { time: "02:43", mode: "Capture the Flag" },
  { time: "03:03", mode: "Molten Arena" },
  { time: "03:23", mode: "Deathmatch" },
  { time: "03:43", mode: "Flagmatch" },
  { time: "04:23", mode: "Battle of Atlantis" },
  { time: "04:43", mode: "Capture the Flag" },
  { time: "05:03", mode: "Molten Arena" },
  { time: "05:23", mode: "Colosseum" },
  { time: "05:43", mode: "Flagmatch" },
  { time: "06:03", mode: "Molten Arena" },
  { time: "06:23", mode: "Deathmatch" },
  { time: "06:43", mode: "Flagmatch" }
];

