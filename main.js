debugValue = 0;
game = null;
ui = null;

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
  frameRate(settings.fps);
  textFont('Helvetica');
  //everything in evades is based on radius instead of diameter so we use radius
  ellipseMode(RADIUS);

  initCanvas();
  game = initGame();
  ui = initUI();
}

var tFix = 0.5;
var timeCap = 250;
/**
 * Called every frame
 */
function draw() {
  tFix = deltaTime / (1000 / 60) / 2;
  dTime = deltaTime;
  if (deltaTime > timeCap){
    tFix = 0;
    dTime = 0;
  }
  updateAll();
  background(51);
  push();
  doCamTransform(cameraFocusX, cameraFocusY, 1);
  game.draw();
  ui.draw();
  pop();

  drawCinemaBars();

  //drawDebugValueText();
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

function keyPressed() {
  if (keyCode === 81) { game.cycleMainPlayer(); }
}