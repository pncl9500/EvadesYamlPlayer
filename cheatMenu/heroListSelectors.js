function getHeroSelectorMenu(playerToChange = game.mainPlayer, backMenuDestination = baseCheatMenuItems){
  let bmd = backMenuDestination;
  var nonVanillaShown = false;
  list = [
    row([
      btn("Go back", 38, 12, () => {if (typeof bmd === "function"){bmd = bmd()}queueCheatMenuChange(bmd)}, "Return to the previous menu."),
      btn("Show extra heroes", null, 12, () => {
        if (nonVanillaShown){
          return;
        }
        nonVanillaShown = true;
        cheatMenuItems = cheatMenuItems.concat(pdd(0, 10), txt("Bonus heroes", 20), bigLine())
        cheatMenuItems = cheatMenuItems.concat(getHeroSelectorSectionFromArray(playerToChange, modHeroes));
        cheatMenuItems = cheatMenuItems.concat(pdd(0, 10), txt("Variant heroes", 20), bigLine())
        cheatMenuItems = cheatMenuItems.concat(getHeroSelectorSectionFromArray(playerToChange, variantHeroes));
      }, "Show non-vanilla heroes."),
    ]),
    txt("Vanilla heroes", 20), bigLine(),
  ];

  list = list.concat(getHeroSelectorSectionFromArray(playerToChange, vanillaHeroes));
  list = list.concat()
  return list;
}

function getHeroSelectorSectionFromArray(playerToChange, set){
  let list = [];
  for (var i in set){
    let key = set[i];
    let n = new(heroDict.get(key))(-99999, -99999, 0, "", false, game, 0, 0, [], false);
    n.toRemove = true;
    let nb = btn(n.heroName, 180, 12, () => {
      playerToChange.swapHero(key);
    })
    try {
      nb.color = hexToRgb(pal.hero[key]);
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
        nb.textColor.r = 255;
        nb.textColor.g = 255;
        nb.textColor.b = 255;
      }
    } catch (error) {
      //do nothing
    }
    list.push(nb);
  }
  return list;
}


function getPlayerCreationMenu(backMenuDestination = baseCheatMenuItems){
  let bmd = backMenuDestination;
  var nonVanillaShown = false;
  list = [
    row([
      btn("Go back", 38, 12, () => {if (typeof bmd === "function"){bmd = bmd()}queueCheatMenuChange(bmd)}, "Return to the previous menu."),
      btn("Show extra heroes", null, 12, () => {
        if (nonVanillaShown){
          return;
        }
        nonVanillaShown = true;
        cheatMenuItems = cheatMenuItems.concat(pdd(0, 10), txt("Bonus heroes", 20), bigLine())
        cheatMenuItems = cheatMenuItems.concat(getPlayerCreationSectionFromArray(modHeroes));
        cheatMenuItems = cheatMenuItems.concat(pdd(0, 10), txt("Variant heroes", 20), bigLine())
        cheatMenuItems = cheatMenuItems.concat(getPlayerCreationSectionFromArray(variantHeroes));
      }, "Show non-vanilla heroes."),
    ]),
    row([txt("Random Variation:", 12), 
    tog(11, 11, true, () => {settings.randomDummySpawn = true}, () => {settings.randomDummySpawn = false}, () => {return settings.randomDummySpawn;}, "If enabled, dummy players will be spawned with a random positional variation."),]),
    txt("Vanilla heroes", 20), bigLine(),
  ];

  list = list.concat(getPlayerCreationSectionFromArray(vanillaHeroes));
  list = list.concat()
  return list;
}

function getPlayerCreationSectionFromArray(set){
  let list = [];
  for (var i in set){
    let key = set[i];
    let n = new(heroDict.get(key))(-99999, -99999, 0, "", false, game, 0, 0, [], false);
    n.toRemove = true;
    let nb = btn(n.heroName, 180, 12, () => {
      let dummyNum = max(1, game.players.length);
      let newPlayer = new(heroDict.get(key))(game.mainPlayer.x + random(-32,32) * settings.randomDummySpawn, game.mainPlayer.y + random(-32, 32) * settings.randomDummySpawn, gameConsts.defaultPlayerSize, `Dummy player ${dummyNum}`, false, game, game.mainPlayer.regionNum, game.mainPlayer.areaNum, []);
      game.addPlayer(newPlayer);
    })
    try {
      nb.color = hexToRgb(pal.hero[key]);
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
        nb.textColor.r = 255;
        nb.textColor.g = 255;
        nb.textColor.b = 255;
      }
    } catch (error) {
      //do nothing
    }
    list.push(nb);
  }
  return list;
}