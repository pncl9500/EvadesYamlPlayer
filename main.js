debugValue = "";
game = null;
ui = null;
cheatMenuOpen = false;

/**
 * Loaded before the game is opened
 */
function preload(){
  loadAssets();
  loadAllYAML();
}
/**
 * Called once when the page is opened
 */
function setup() {
  basePixelDensity = pixelDensity();

  frameRate(settings.fps);
  textFont('Helvetica');
  //everything in evades is based on radius instead of diameter so we use radius
  ellipseMode(RADIUS);

  initCanvas();
  game = initGame();
  ui = initUI();
  cheatMenuItems = setCheatMenuItems();
  
  processUrlParams();
}

var tFix = 0.5;
var timeCap = 250;
var timeScale = 1;
var gameClock = 0;
/**
 * Called every frame
 */
function draw() {
  if (deltaTime > timeCap){
    tFix = 0;
    deltaTime = 0;
  }
  dTime = deltaTime;
  if (settings.tasMode){
    dTime = 1000 / settings.fps;
  }
  dTime *= timeScale;
  tFix = dTime / (1000 / 60) / 2;
  
  if (!settings.gamePaused){
    updateAll();
    gameClock += dTime;
  }
  background(settings.backgroundBrightness);
  push();
  doCamTransform(cameraFocusX, cameraFocusY, 1);
  game.draw();
  ui.draw();
  pop();

  drawCinemaBars();

  if (cheatMenuOpen){
    drawCheatMenu();
  }
  drawDebugValueText();
}

function skipFrame(){
  if (deltaTime > timeCap){
    tFix = 0;
    deltaTime = 0;
  }
  dTime = deltaTime;
  if (settings.tasMode){
    dTime = 1000 / settings.fps;
  }
  console.log(dTime);
  dTime *= timeScale;
  tFix = dTime / (1000 / 60) / 2;
  updateAll();
  gameClock += dTime;
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

function processUrlParams(){
  //separate url into each parameter
  var urlParams = window.location.search.split("?");
  //remove empty first parameter
  urlParams.shift();
  for (var i = 0; i < urlParams.length; i++){
    //split each parameter into its key and value
    var pair = urlParams[i].split("=");
    var param = pair[0];
    var val = pair[1];
    //do stuff with each parameter
    switch (param) {
      case "region":
        let region = 0;
        try {
          let nameToSearch = regionCodes[val];
          for (var i in game.regions){
            if (game.regions[i].name.toLowerCase() == nameToSearch){
              region = i;
            }
          }
        } catch (error) {
          
        }
        game.mainPlayer.area.exit(game.mainPlayer);
        game.mainPlayer.area.attemptUnload(game.mainPlayer);
        game.mainPlayer.goToRegionFromId(region);
        game.mainPlayer.goToAreaFromId(0);
        game.mainPlayer.area.enter(game.mainPlayer);
        game.mainPlayer.area.attemptLoad(true); 
        game.mainPlayer.moveToAreaStart();
        break;
      case "hero":
        game.mainPlayer.swapHero(val);
        break;
      case "points":
        game.mainPlayer.upgradePoints = 150;
        break;
      case "stats":
        game.mainPlayer.upgradePoints = 150;
        game.mainPlayer.speed = gameConsts.maxSpeed;
        game.mainPlayer.maxEnergy = gameConsts.maxEnergy;
        game.mainPlayer.regen = gameConsts.maxRegen;
        break;
      case "fullstats":
        game.mainPlayer.upgradePoints = 160;
        game.mainPlayer.speed = gameConsts.maxSpeed;
        game.mainPlayer.maxEnergy = gameConsts.maxEnergy;
        game.mainPlayer.regen = gameConsts.maxRegen;
        for (let i = 0; i < 5; i++){
          game.mainPlayer.ability1.upgrade(game.mainPlayer);
          game.mainPlayer.ability2.upgrade(game.mainPlayer);
        }
        break;
      default:
        break;
    }
  }
}

regionCodes = {
  cc: "central core",
  cch: "central core hard",
  cc3: "catastrophic core",
  hh2: "haunted halls",
  mm3: "mysterious mansion",
  cc4: "coupled corridors",
  pp: "peculiar pyramid",
  pph: "peculiar pyramid hard",
  ss2: "shifting sands",
  dd2: "dusty depths",
  ww: "wacky wonderland",
  gg: "glacial gorge",
  ggh: "glacial gorge hard",
  vv: "vicious valley",
  vvh: "vicious valley hard",
  hh: "humongous hollow",
  hhh: "humongous hollow hard",
  ee: "elite expanse",
  eeh: "elite expanse hard",
  ee2: "endless echo",
  ee2h: "endless echo hard",
  dd: "dangerous district",
  ddh: "dangerous district hard",
  qq: "quiet quarry",
  qqh: "quiet quarry hard",
  mm: "monumental migration",
  mmh: "monumental migration hard",
  oo: "ominous occult",
  ooh: "ominous occult hard",
  ff: "frozen fjord",
  ffh: "frozen fjord hard",
  rr: "restless ridge",
  rrh: "restless ridge hard",
  tt: "toxic territory",
  tth: "toxic territory hard",
  mm2: "magnetic monopole",
  mm2h: "magnetic monopole hard",
  bb: "burning bunker",
  bbh: "burning bunker hard",
  gg2: "grand garden",
  gg2h: "grand garden hard",
  cc2: "cyber castle",
  cc2h: "cyber castle hard",
  ii: "infinite inferno",
  ww2: "withering wasteland",
  ss: "stellar square",
  rl: "research lab",
}