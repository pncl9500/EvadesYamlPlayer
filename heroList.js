heroList = {
  "magmax": Magmax,
  "rime": Rime,
  "morfe": Morfe,
  "aurora": Aurora,
  "necro": Necro,
  "brute": Brute,
  "nexus": Nexus,
}

heroDict = new Map();

for (const [key, value] of Object.entries(heroList)){
  heroDict.set(key, value);
}