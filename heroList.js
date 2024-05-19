heroList = {
  "magmax": Magmax,
  "rime": Rime,
  "morfe": Morfe,
  "aurora": Aurora,
  "necro": Necro,
  "brute": Brute,
  "nexus": Nexus,
  "shade": Shade,
  "euclid": Euclid,
  "chrono": Chrono,
  "reaper": Reaper,
  "rameses": Rameses,
  "ram": Rameses,

  "fab": Fab,
  "leporid": Leporid,
  
  "oldmorfe": OldMorfe,
  "ogmorfe": OldMorfe,
}

vanillaHeroes = [
  "magmax",
  "rime",
  "morfe",
  "aurora",
  "necro",
  "brute",
  "nexus",
  "shade",
  "euclid",
  "chrono",
  "reaper",
  //"rameses"
]

modHeroes = [
  "fab",
  "leporid",
]

variantHeroes = [
  "oldmorfe",
]


heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}