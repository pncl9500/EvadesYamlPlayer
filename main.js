debugValue = 0;
/**
 * Called once when the page is opened
 */
function setup() {
  //everything in evades is based on radius instead of diameter so we use radius
  ellipseMode(RADIUS);

  initCanvas();
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