outdatedMapNames = [
  "Burning Bunker Hard",
]

extrapolatedMapNames = [
  "Dusty Depths",
  "Research Lab",
  "Withering Wasteland",
  "Burning Bunker",
  "Shifting Sands",
]

unimplementedGimmickMapNames = [
  "Cyber Castle",
  "Cyber Castle Hard",
  "Stellar Square",
  "Endless Echo",
  "Endless Echo Hard",
  "Burning Bunker",
  "Burning Bunker Hard",
  "Mysterious Mansion",
  "Haunted Halls",
  "Frozen Fjord",
  "Frozen Fjord Hard",
  "Dusty Depths",
  "Research Lab",
]


function getRegionSelectorMenu(){
  let totalMissingEnemies = ["ring_sniper"];
  let totalEnemyTypes = 98;
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}, "Return to the previous menu."),
    txt("Region List", 20), bigLine(),
  ];
  for (let i in game.regions){
    let nb = btn(game.regions[i].name, 180, 12, () => {
      game.mainPlayer.area.exit(game.mainPlayer);
      game.mainPlayer.area.attemptUnload(game.mainPlayer);
      game.mainPlayer.goToRegionFromId(i);
      game.mainPlayer.goToAreaFromId(0);
      game.mainPlayer.area.enter(game.mainPlayer);
      game.mainPlayer.area.attemptLoad(true);
      game.mainPlayer.moveToAreaStart();
    })
    try {
      nb.color.r = game.regions[i].properties.background_color[0];
      nb.color.g = game.regions[i].properties.background_color[1];
      nb.color.b = game.regions[i].properties.background_color[2];
      nb.hoverColor.r = game.regions[i].properties.background_color[0] + 40;
      nb.hoverColor.g = game.regions[i].properties.background_color[1] + 40;
      nb.hoverColor.b = game.regions[i].properties.background_color[2] + 40;
      if (game.regions[i].properties.background_color[0] + game.regions[i].properties.background_color[1] + game.regions[i].properties.background_color[2] < 216){
        nb.textColor.r = 255;
        nb.textColor.g = 255;
        nb.textColor.b = 255;
      }
    } catch (error) {
      //do nothing
    }
    let unknownEnemyTypes = game.regions[i].areas[0].scanForUnknownEnemyTypes();
    let items = [nb];
    if (unknownEnemyTypes.length > 0){
      let str;
      if (unknownEnemyTypes.length === 1){
        str = game.regions[i].name + ` has ${unknownEnemyTypes.length} missing enemy type (`;
      } else {
        str = game.regions[i].name + ` has ${unknownEnemyTypes.length} missing enemy types (`;
      }
      for (let i = 0; i < unknownEnemyTypes.length; i++){
        if (!totalMissingEnemies.includes(unknownEnemyTypes[i])){
          totalMissingEnemies.push(unknownEnemyTypes[i]);
        }
        str += unknownEnemyTypes[i];
        if (i === unknownEnemyTypes.length - 1){
          str += ")"
          continue;
        }
        str += ", "
      }
      let but = btn(" ! ", null, 12, () => {}, str);
      but.color = {r: 255, g: 220, b: 255};
      but.hoveredColor = {r: 90, g: 40, b: 90};
      items.push(but)
    }
    if (unimplementedGimmickMapNames.includes(game.regions[i].name)){
      let but = btn(" ! ", null, 12, () => {}, `${game.regions[i].name}'s mechanics have not been fully implemented.`);
      but.color = {r: 220, g: 255, b: 255};
      but.hoveredColor = {r: 40, g: 90, b: 90};
      items.push(but);
    }
    if (outdatedMapNames.includes(game.regions[i].name)){
      let but = btn(" ! ", null, 12, () => {}, `${game.regions[i].name}'s map file is outdated.`);
      but.color = {r: 255, g: 255, b: 220};
      but.hoveredColor = {r: 90, g: 90, b: 40};
      items.push(but);
    }
    if (extrapolatedMapNames.includes(game.regions[i].name)){
      let but = btn(" ! ", null, 12, () => {}, `${game.regions[i].name}'s map file is a modified version of an outdated file and has not been obtained from a developer. May not be fully accurate.`);
      but.color = {r: 255, g: 255, b: 220};
      but.hoveredColor = {r: 90, g: 90, b: 40};
      items.push(but);
    }
    list.push(row(items));
  }
  list.push(txt("", 8));
  list.push(txt(`Total missing enemies (${totalMissingEnemies.length}/${totalEnemyTypes}, ${round((totalMissingEnemies.length/totalEnemyTypes) * 1000) / 10}% missing, ${totalEnemyTypes- totalMissingEnemies.length}/${totalEnemyTypes} complete, ${round(((totalEnemyTypes - totalMissingEnemies.length)/totalEnemyTypes) * 1000) / 10}% complete):`, 12));
  for (let i in totalMissingEnemies){
    list.push(txt(totalMissingEnemies[i], 8));
  }
  if (totalMissingEnemies.length === 0){
    list.push(txt("All enemies have been implemented, and I can finally rest.", 8));
  }
  return list;
}