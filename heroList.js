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
  "candy": Candy,
  "mirage": Mirage,
  "boldrock": Boldrock,
  "bold": Boldrock,
  "rock": Boldrock,
  "br": Boldrock,

  "fab": Fab,
  "leporid": Leporid,
  "toukka": Toukka,
  "nov": Nov,
  "irit": Irit,
  "tecto": Tecto,
  "lide": Lide,
  "kuipra": Kuipra,
  
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
  "candy",
  "mirage",
  "boldrock",
]

modHeroes = [
  "fab",
  "leporid",
  "toukka",
  "nov",
  "irit",
  "tecto",
  "lide",
  "kuipra",
]

variantHeroes = [
  "oldmorfe",
]


heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}