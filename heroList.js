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
  "jolt": Jolt,
  "jotunn": Jotunn,
  "jötunn": Jotunn,
  "jot": Jotunn,
  "jöt": Jotunn,

  "fab": Fab,
  "leporid": Leporid,
  "toukka": Toukka,
  "nov": Nov,
  "irit": Irit,
  
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
  "rameses",
  "jolt",
  "jotunn",
]

modHeroes = [
  "fab",
  "leporid",
  "toukka",
  "nov",
  "irit",
]

variantHeroes = [
  "oldmorfe",
]


heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}