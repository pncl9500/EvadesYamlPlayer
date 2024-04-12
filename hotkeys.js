function keyPressed() {
  if (keyCode === 81) { game.cycleMainPlayer(); }
  if (keyCode === 82) { game.mainPlayer.doCheatRevive = true; }
}