function keyPressed() {
  if (keyCode === 27) { if (cheatMenuOpen){closeCheatMenu();} else {openCheatMenu();} closeFileImporter()}

  if (game.players.length === 0){
    //suppress inputs other than escape menu if no players exist
    return;
  }
  if (keyCode === 81) { game.cycleMainPlayer(); }
  if (keyCode === 49) { game.mainPlayer.upgradeSpeed(); }
  if (keyCode === 50) { game.mainPlayer.upgradeEnergy(); }
  if (keyCode === 51) { game.mainPlayer.upgradeRegen(); }
  if (keyCode === 52 && game.mainPlayer.ability1.canBeUpgradedManually) { game.mainPlayer.ability1.upgrade(game.mainPlayer); }
  if (keyCode === 53 && game.mainPlayer.ability2.canBeUpgradedManually) { game.mainPlayer.ability2.upgrade(game.mainPlayer); }
  if (keyCode === 70) { game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints = 160; for(var i = 0; i < 5; i++){game.mainPlayer.ability1.upgrade(game.mainPlayer)}; for(var i = 0; i < 5; i++){game.mainPlayer.ability2.upgrade(game.mainPlayer)};}
  if (keyCode === 69) { game.mainPlayer.moveToAreaStart(); }
  if (keyCode === 84) { game.mainPlayer.moveToAreaEnd(); }
  if (keyCode === 82) { 
    if (game.mainPlayer.dead){
      game.mainPlayer.doRevive = true;
    } else {
      game.mainPlayer.changeAreaCheat(10); game.mainPlayer.moveToAreaStart()
    }; 
  }
  if (keyCode === 86) { settings.invincibilityCheat = !settings.invincibilityCheat; }
  if (keyCode === 66) { settings.infiniteAbilityUseCheat = !settings.infiniteAbilityUseCheat; }
  if (keyCode === 72) { ui.heroCard.hidden = !ui.heroCard.hidden; }
  if (keyCode === 77) { ui.miniMap.hidden = !ui.miniMap.hidden; }
  if (keyCode === 80) { skipFrame(); }
  if (keyCode === 112) { showProfile = !showProfile }
}

function mouseClicked(){
  if (cheatMenuOpen){
    return;
  }
  settings.mouseToggled = !settings.mouseToggled;
}