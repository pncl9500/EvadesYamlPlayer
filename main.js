debugValue = 0;
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
  testRegion = regionFromName("cc");
}

/**
 * Called every frame
 */
function draw() {
  background(51);
  push();
  doCamTransform(256, 0, 1);
  

  pop();
  drawCinemaBars();

  //drawDebugValueText();
}
function drawDebugValueText(){
  fill(255);
  noStroke();
  textSize(32);
  text(debugValue, 0, 32);
}