heroList = {
  "magmax": Magmax,
  "rime": Rime,
  "morfe": Morfe,
  "aurora": Aurora,
  "necro": Necro,
  "brute": Brute,
  "nexus": Nexus,
  "shade": Shade,
  "oldmorfe": OldMorfe,
  //"euclid": Euclid,
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

heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}