function getRptl(){
  return {
    cc: "regionFiles/vanilla/central-core.yaml",
    cch: "regionFiles/vanilla/central-core-hard.yaml",
    cc3: "regionFiles/vanilla/catastrophic-core.yaml",
    hh2: "regionFiles/vanilla/haunted-halls.yaml",
    mm3: "regionFiles/vanilla/mysterious-mansion.yaml",
    cc4: "regionFiles/vanilla/coupled-corridors.yaml",
    pp: "regionFiles/vanilla/peculiar-pyramid.yaml",
    pph: "regionFiles/vanilla/peculiar-pyramid-hard.yaml",
    ss2: "regionFiles/vanilla/shifting-sands.yaml",
    dd2: "regionFiles/vanilla/dusty-depths.yaml",
    ww: "regionFiles/vanilla/wacky-wonderland.yaml",
    gg: "regionFiles/vanilla/glacial-gorge.yaml",
    ggh: "regionFiles/vanilla/glacial-gorge-hard.yaml",
    vv: "regionFiles/vanilla/vicious-valley.yaml",
    vvh: "regionFiles/vanilla/vicious-valley-hard.yaml",
    hh: "regionFiles/vanilla/humongous-hollow.yaml",
    hhh: "regionFiles/vanilla/humongous-hollow-hard.yaml",
    ee: "regionFiles/vanilla/elite-expanse.yaml",
    eeh: "regionFiles/vanilla/elite-expanse-hard.yaml",
    ee2: "regionFiles/vanilla/endless-echo.yaml",
    ee2h: "regionFiles/vanilla/endless-echo-hard.yaml",
    dd: "regionFiles/vanilla/dangerous-district.yaml",
    ddh: "regionFiles/vanilla/dangerous-district-hard.yaml",
    qq: "regionFiles/vanilla/quiet-quarry.yaml",
    qqh: "regionFiles/vanilla/quiet-quarry-hard.yaml",
    mm: "regionFiles/vanilla/monumental-migration.yaml",
    mmh: "regionFiles/vanilla/monumental-migration-hard.yaml",
    oo: "regionFiles/vanilla/ominous-occult.yaml",
    ooh: "regionFiles/vanilla/ominous-occult-hard.yaml",
    ff: "regionFiles/vanilla/frozen-fjord.yaml",
    ffh: "regionFiles/vanilla/frozen-fjord-hard.yaml",
    rr: "regionFiles/vanilla/restless-ridge.yaml",
    rrh: "regionFiles/vanilla/restless-ridge-hard.yaml",
    tt: "regionFiles/vanilla/toxic-territory.yaml",
    tth: "regionFiles/vanilla/toxic-territory-hard.yaml",
    mm2: "regionFiles/vanilla/magnetic-monopole.yaml",
    mm2h: "regionFiles/vanilla/magnetic-monopole-hard.yaml",
    bb: "regionFiles/vanilla/burning-bunker.yaml",
    bbh: "regionFiles/vanilla/burning-bunker-hard.yaml",
    gg2: "regionFiles/vanilla/grand-garden.yaml",
    gg2h: "regionFiles/vanilla/grand-garden-hard.yaml",
    cc2: "regionFiles/vanilla/cyber-castle.yaml",
    cc2h: "regionFiles/vanilla/cyber-castle-hard.yaml",
    ii: "regionFiles/vanilla/infinite-inferno.yaml",
    ww2: "regionFiles/vanilla/withering-wasteland.yaml",
    ss: "regionFiles/vanilla/stellar-square.yaml",
    rl: "regionFiles/vanilla/research-lab.yaml",
  }
}

function addVanillaRegionsToGame(game){
  let regionAbbreviations = [];
  let keys = Object.keys(getRptl());
  for (var i in keys){
    game.addRegion(regionFromName(keys[i]));
  }
}