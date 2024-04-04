debugValue = "no debug value yet";
game = null;

/**
 * Loaded before the game is opened
 */
function preload(){
  loadAllYAML();
}
/**
 * Called once when the page is opened
 */
function setup() {
  //everything in evades is based on radius instead of diameter so we use radius
  ellipseMode(RADIUS);

  initCanvas();
  game = initGame();
}

var tFix = 0.5;
/**
 * Called every frame
 */
function draw() {
  tFix = deltaTime / (1000 / 60) / 2;
  updateAll();
  background(51);
  push();
  doCamTransform(cameraFocusX, cameraFocusY, 1);
  game.draw();

  pop();
  drawCinemaBars();

  drawDebugValueText();
}
function drawDebugValueText(){
  fill(255);
  noStroke();
  textSize(24);
  text(debugValue, 0, 24);
}

function updateAll(){
  game.update();
}