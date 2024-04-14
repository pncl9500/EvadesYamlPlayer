function keyPressed() {
  if (keyCode === 81) { game.cycleMainPlayer(); }
  if (keyCode === 82) { game.mainPlayer.doCheatRevive = true; }
  if (keyCode === 49) { game.mainPlayer.upgradeSpeed(); }
  if (keyCode === 50) { game.mainPlayer.upgradeEnergy(); }
  if (keyCode === 51) { game.mainPlayer.upgradeRegen(); }
  if (keyCode === 52) { game.mainPlayer.ability1.upgrade(game.mainPlayer); }
  if (keyCode === 53) { game.mainPlayer.ability2.upgrade(game.mainPlayer); }
}