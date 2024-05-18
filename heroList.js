heroList = {
  "magmax": Magmax,
  "rime": Rime,
  "morfe": Morfe,
  "aurora": Aurora,
  "necro": Necro,
  "brute": Brute,
  "nexus": Nexus,
  "shade": Shade,
  //"euclid": Euclid,

  "oldmorfe": OldMorfe,
  "fab": Fab,
}

vanillaHeroes = [
  "magmax",
  "rime",
  "morfe",
  "aurora",
  "necro",
  "brute",
  "nexus",
  "shade"
]

modHeroes = [
  "fab",
]

variantHeroes = [
  "oldmorfe",
]


heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}