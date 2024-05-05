function keyPressed() {
  if (keyCode === 81) { game.cycleMainPlayer(); }
  if (keyCode === 49) { game.mainPlayer.upgradeSpeed(); }
  if (keyCode === 50) { game.mainPlayer.upgradeEnergy(); }
  if (keyCode === 51) { game.mainPlayer.upgradeRegen(); }
  if (keyCode === 52) { game.mainPlayer.ability1.upgrade(game.mainPlayer); }
  if (keyCode === 53) { game.mainPlayer.ability2.upgrade(game.mainPlayer); }
  if (keyCode === 70) { game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints = 99; }
  if (keyCode === 27) { if (cheatMenuOpen){closeCheatMenu();} else {openCheatMenu();} }
  if (keyCode === 69) { game.mainPlayer.moveToAreaStart(); }
  if (keyCode === 84) { game.mainPlayer.moveToAreaEnd(); }
  if (keyCode === 82) { 
    if (game.mainPlayer.dead){
      game.mainPlayer.doCheatRevive = true;
    } else {
      game.mainPlayer.changeAreaCheat(10); game.mainPlayer.moveToAreaStart()
    }; 
  }
}