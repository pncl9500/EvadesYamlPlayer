//random notes
//evades canvas APPEARS to lock itself at 720 units tall at all times
//unlikely for it to be different since 720 is a very round number
//so width is 1280
//each tile is 32 units wide
//players are 32 units wide
//everything is a radius so use radius mode...

/**
 * Intended aspect ratio for the game screen
 */
const targetCanvRatio = 16/9;
/**
 * Apsect Ratio of the window's screen
 */
var windowAspectRatio = 16/9;
/**
 * Width of the game's screen in pixels
 */
var gsPixelWidth = 1280;
/**
 * Height of the game's screen in pixels
 */
var gsPixelHeight = 720;
/**
 * Height of the game's screen in game units
 */
const gsUnitHeight = 720;
/**
 * Height of the game's screen in game units (not actually necessary)
 */
const gsUnitWidth = 1280;
/**
 * Ratio between pixels and game units
 */
var pixelToUnitRatio = 1;
/**
 * Horizontal center of screen
 */
var cameraFocusX = 0;
/**
 * Vertical center of screen
 */
var cameraFocusY = 0;

/**
 * Creates the canvas and gets canvas aspect ratio
 */
function initCanvas(){
  createCanvas(windowWidth, windowHeight);
  windowAspectRatio = windowWidth / windowHeight;
  //This is some kludge shit right here
  //drawCinemaBars() sets a bunch of variables needed to scale the game properly
  //those variables have default variables but they're wrong
  //if this wasn't here, the game would be drawn with bad proportions for 1 frame
  drawCinemaBars();
}

/**
 * A drawing transformation that moves a point to the center of the canvas
 * @param {number} x - x coordinate of desired canvas center
 * @param {number} y - y coordinate of desired canvas center
 * @param {number} zoom - write this later
 */
function doCamTransform(x, y, zoom){
  //making a camera class is cringe because evades.io always has fixed cam
  //hope this wont bite me in the ass later
  //x and y are always backwards for some reason

  //0,0 is at the top left so we need to move it
  translate(windowWidth / 2, windowHeight / 2);
  //scale by ratio between game screen and intended screen height
  var ratio = pixelToUnitRatio;

  scale(ratio * zoom, ratio * zoom);
  //move intended center to screen center
  translate(-x, -y);
}

/**
 * Called whenever user resizes the window, resizes canvas and gets canvas aspect ratio
 */
function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  windowAspectRatio = windowWidth / windowHeight;
}


/**
 * Maintains intended aspect ratio by drawing bars, sets game screen width/height variables unfortunately
 */
function drawCinemaBars(){
  rectMode(CORNER);
  //game screen must always maintain a 16:9 aspect ratio regardless of screen proportions
  //so we will draw dark gray bars over the screen
  //this is entirely drawn without any screen transform (because its easier that way)
  fill(34);
  noStroke();
  if (windowAspectRatio < targetCanvRatio){
    //window is too tall, actual window width = game screen width
    //bars are on top/bottom sides
    gsPixelWidth = windowWidth;
    gsPixelHeight = gsPixelWidth / targetCanvRatio;
    let barWidth = gsPixelWidth;
    let barHeight = (windowHeight - gsPixelHeight) / 2;

    //top bar - top left is always 0,0
    rect(0, 0, barWidth, barHeight);
    //bottom bar - top left is 0, bottom of window - height of bar
    rect(0, windowHeight - barHeight, barWidth, barHeight);
  } else {
    gsPixelHeight = windowHeight;
    gsPixelWidth = gsPixelHeight * targetCanvRatio;
    let barHeight = gsPixelHeight;
    let barWidth = (windowWidth - gsPixelWidth) / 2;
    //window is too wide, actual window height = game screen height
    //bars are on left/right sides

    //left bar - top left is always 0,0
    rect(0, 0, barWidth, barHeight);
    //right bar - top left is always right of window - width of bar, 0
    rect(windowWidth - barWidth, 0, barWidth, barHeight);
  }
  //we did it, and now we set the ratio between pixels to units since we know how many pixels it is tall
  pixelToUnitRatio = gsPixelHeight / gsUnitHeight;
}