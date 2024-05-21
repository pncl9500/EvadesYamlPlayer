debugValue = "";
game = null;
ui = null;
cheatMenuOpen = false;

/**
 * Loaded before the game is opened
 */
function preload(){
  loadFonts();
  loadAllYAML();
}
/**
 * Called once when the page is opened
*/
function setup() {
  loadAssets();
  document.title = "YAML Player"
  basePixelDensity = pixelDensity();

  frameRate(settings.fps);
  textFont('Helvetica');
  //everything in evades is based on radius instead of diameter so we use radius
  ellipseMode(RADIUS);

  initCanvas();
  game = initGame();
  ui = initUI();

  ui.alertBox.hidden = false;
  ui.alertBox.timeUntilVanish = 12000;
  ui.alertBox.alerts.push("Welcome to EvadesYamlPlayer!")
  ui.alertBox.alerts.push("Press escape to open the options menu.")
  ui.alertBox.alerts.push("Press F to fully level.")
  ui.alertBox.alerts.push(" ")
  ui.alertBox.alerts.push("Note that EvadesYamlPlayer is currently in open beta.")
  ui.alertBox.alerts.push("The game does not currently have every Evades.io feature")
  ui.alertBox.alerts.push("and may crash without warning.")

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

let serverLagTimer = 0;
let gameLagTimer = 0;

let storedGameLag = 0;

let shortGameLagCooldown = 0;
let longGameLagCooldown = 0;
let serverLagCooldown = 0;

function draw() {
  let lighting = 1;
  let region = game.mainPlayer.region;
  let area = game.mainPlayer.area;
  // if (region.properties && region.properties.lighting !== undefined) lighting = region.properties.lighting;
  // if (area.properties && area.properties.lighting !== undefined) lighting = area.properties.lighting;
  lightMap.clear();
  lightMap.background(51, 255 * (1 - lighting));
  if (settings.regionBackground){
    if (game.mainPlayer.area.parent.hasOwnProperty("properties") && game.mainPlayer.area.parent.properties.hasOwnProperty("background_color") && !(game.mainPlayer.area.hasOwnProperty("properties") && game.mainPlayer.area.properties !== undefined && game.mainPlayer.area.properties.hasOwnProperty("background_color"))){
      lightMap.background(game.mainPlayer.area.parent.properties.background_color[0], game.mainPlayer.area.parent.properties.background_color[1], game.mainPlayer.area.parent.properties.background_color[2], floor(game.mainPlayer.area.parent.properties.background_color[3] * 0.3));
    }
    if (game.mainPlayer.area.hasOwnProperty("properties") && game.mainPlayer.area.properties !== undefined && game.mainPlayer.area.properties.hasOwnProperty("background_color")){
      lightMap.background(game.mainPlayer.area.properties.background_color[0], game.mainPlayer.area.properties.background_color[1], game.mainPlayer.area.properties.background_color[2], floor(game.mainPlayer.area.properties.background_color[3] * 0.3));
    }
  }
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
  fFix = tFix;
  
  serverLagTimer -= deltaTime;
  gameLagTimer -= deltaTime;
  shortGameLagCooldown -= deltaTime;
  longGameLagCooldown -= deltaTime;
  serverLagCooldown -= deltaTime;
  if (settings.serverLag && gameLagTimer < 0 && serverLagTimer < 0 && serverLagCooldown < 0){
    if (random(0, 100) < settings.serverLagChance / (settings.fps / 30)){
      serverLagTimer = random(settings.serverLagMinLength, settings.serverLagMaxLength);
      ui.alertBox.alerts.push("server lag injected " + floor(serverLagTimer) + "ms");
      ui.alertBox.alpha = 255;
      ui.alertBox.hidden = false;
      serverLagCooldown = settings.serverLagCooldown;
    }
  }
  if (serverLagTimer > 0){
    dTime = 0;
    tFix = 0;
  }
  if (settings.shortGameLag && gameLagTimer < 0 && serverLagTimer < 0 && shortGameLagCooldown < 0){
    if (random(0, 100) < settings.shortGameLagChance / (settings.fps / 30)){
      gameLagTimer = random(settings.shortGameLagMinLength, settings.shortGameLagMaxLength);
      ui.alertBox.alerts.push("short lag injected " + floor(gameLagTimer) + "ms");
      ui.alertBox.alpha = 255;
      ui.alertBox.hidden = false;
      shortGameLagCooldown = settings.shortGameLagCooldown
    }
  }
  if (settings.longGameLag && gameLagTimer < 0 && serverLagTimer < 0 && longGameLagCooldown < 0) {
    if (random(0, 100) < settings.longGameLagChance / (settings.fps / 30)){
      gameLagTimer = random(settings.longGameLagMinLength, settings.longGameLagMaxLength);
      ui.alertBox.alerts.push("long lag injected " + floor(gameLagTimer) + "ms");
      ui.alertBox.alpha = 255;
      ui.alertBox.hidden = false;
      longGameLagCooldown = settings.longGameLagCooldown
    }
  }
  if (gameLagTimer > 0){
    storedGameLag += deltaTime;
    dTime = 0;
    tFix = 0;
    fFix = 0;
  }
  if (storedGameLag > 0 && gameLagTimer <= 0){
    //dTime += min(storedGameLag, 250);
    dTime += storedGameLag;
    tFix = dTime / (1000 / 60) / 2;
    //fFix = deltaTime / (1000 / 60) / 2;
    //storedGameLag = max(0, storedGameLag - 250);
    storedGameLag = 0;
  }

  if (!settings.gamePaused){
    updateAll();
  }
  background(settings.backgroundBrightness);
  push();
  doCamTransform(cameraFocusX, cameraFocusY, 1);
  game.draw();
  if (lighting !== 1){
    push();
    scale(lightMapDownsample);
    image(lightMap, (cameraFocusX - windowWidth / 2) / lightMapDownsample, (cameraFocusY - windowHeight / 2) / lightMapDownsample);
    pop();
  }
  ui.draw();
  pop();

  drawCinemaBars();

  if (cheatMenuOpen){
    drawCheatMenu();
  }
  drawDebugValueText();

  //background(0);
  //drawPretentiousLogo(windowWidth / 2, windowHeight / 2, 250, frameCount * PI / 180);
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
  dTime *= timeScale;
  tFix = dTime / (1000 / 60) / 2;
  updateAll();
}

function drawDebugValueText(){
  fill(255);
  noStroke();
  textSize(24);
  text(debugValue, 0, 24);
}

function updateAll(){
  gameClock += dTime;
  game.update();
}

function processUrlParams(){
  //separate url into each parameter
  var urlParams = window.location.search.split("?");
  //remove empty first parameter
  urlParams.shift();
  //move area parameter after region parameter so teleports work right
  urlParams.sort((a, b) => {return a.startsWith("area=")});
  for (var i = 0; i < urlParams.length; i++){
    //split each parameter into its key and value
    var pair = urlParams[i].split("=");
    var param = pair[0].toLowerCase();
    var val = pair[1] ? pair[1].toLowerCase() : pair[1];
    //do stuff with each parameter
    switch (param) {
      case "region":
        let region = 0;
        try {
          let nameToSearch = regionCodes[val];
          for (var r in game.regions){
            if (game.regions[r].name.toLowerCase() == nameToSearch){
              region = r;
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
      case "area":
        let area = val - 1;
        game.mainPlayer.area.exit(game.mainPlayer);
        game.mainPlayer.area.attemptUnload(game.mainPlayer);
        game.mainPlayer.goToAreaFromId(area);
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
      case "test":
        testParamFunc(game.mainPlayer);
        break;
      case "30fps":
        settings.fps = 30;
        frameRate(30);
        break;
      default:
        break;
    }
  }
}

function testParamFunc(mp){
  settings.changeCtrlsOnCycle = false;
  mp.upgradePoints = 160;
  mp.speed = gameConsts.maxSpeed;
  mp.maxEnergy = gameConsts.maxEnergy;
  mp.regen = gameConsts.maxRegen;
  for (let i = 0; i < 5; i++){
    mp.ability1.upgrade(mp);
    mp.ability2.upgrade(mp);
  }
  let newPlayer = new Magmax(mp.x + random(-32,32) * settings.randomDummySpawn, mp.y + random(-32, 32) * settings.randomDummySpawn, gameConsts.defaultPlayerSize, `Player 2`, false, game, mp.regionNum, mp.areaNum, []);
  game.addPlayer(newPlayer);
  game.cycleMainPlayer();
  game.mainPlayer.upgradePoints = 160;
  game.mainPlayer.speed = gameConsts.maxSpeed;
  game.mainPlayer.maxEnergy = gameConsts.maxEnergy;
  game.mainPlayer.regen = gameConsts.maxRegen;
  for (let i = 0; i < 5; i++){
    game.mainPlayer.ability1.upgrade(game.mainPlayer);
    game.mainPlayer.ability2.upgrade(game.mainPlayer);
  }
  game.mainPlayer.ctrlSets = [new ArrowSet()];
  game.cycleMainPlayer();
  mp.ctrlSets = [new WASDset()];
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
















function drawPretentiousLogo(x, y, r, cycle){
  //small circle scale (the pretentiousness constant)
  let scs = 1/(sqrt(3));
  let linegap = r * 0.2;
  let arcgap = 0.29;
  push();
  translate(x, y);
  let s = r * 0.01;
  let ang = PI/2;
  stroke(255);
  strokeWeight(6 * s);
  //lines
  for (var i = 0; i < 6; i++){
    strokeCap(ROUND);
    ang += 2*PI/6;
    let p1x = cos(ang) * r;
    let p1y = sin(ang) * r;
    let p2x = cos(ang + 2*PI/6) * r;
    let p2y = sin(ang + 2*PI/6) * r;
    line(p1x, p1y, p2x, p2y);
    strokeCap(ROUND); //make square?
    if (i === 1 || i === 5){
      line(p1x, p1y, 0, 0);
    }
    if (i === 3){
      let ix = cos(ang) * r * scs;
      let iy = sin(ang) * r * scs;
      line(p1x, p1y, ix + cos(ang) * linegap, iy + sin(ang) * linegap);
      line(ix - cos(ang) * linegap, iy - sin(ang) * linegap, 0, 0);
    }
  }
  let mStart = PI/2 + cycle;
  let cStart = PI/2 + 2 * PI/3 + cycle;
  let yStart = PI/2 + 4 * PI/3 + cycle;
  mStart %= 2*PI;
  cStart %= 2*PI;
  yStart %= 2*PI;

  //arcs
  noFill();
  //arc 1
  var start = PI/2 + arcgap;
  var end = PI/2 + 2*PI/3 - arcgap;
  var ufStart = start - arcgap;
  var ufEnd = end + arcgap;
  if (mStart >= start && mStart <= end){ stroke(255, 0, 255); arc(0, 0, r * scs, r * scs, mStart, end); }
  if (cStart >= start && cStart <= end){ stroke(0, 255, 255); arc(0, 0, r * scs, r * scs, cStart, end); }
  if (yStart >= start && yStart <= end){ stroke(255, 255, 0); arc(0, 0, r * scs, r * scs, yStart, end); }

  if (cStart >= start && cStart <= ufEnd){ stroke(255, 0, 255); arc(0, 0, r * scs, r * scs, start, min(cStart, end)); }
  if (yStart >= start && yStart <= ufEnd){ stroke(0, 255, 255); arc(0, 0, r * scs, r * scs, start, min(yStart, end)); }
  if (mStart >= start && mStart <= ufEnd){ stroke(255, 255, 0); arc(0, 0, r * scs, r * scs, start, min(mStart, end)); }

  let lastColor = "";
  if (mStart >= ufStart && mStart <= start){ stroke(255, 0, 255); arc(0, 0, r * scs, r * scs, start, end)}
  if (cStart >= ufStart && cStart <= start){ stroke(0, 255, 255); arc(0, 0, r * scs, r * scs, start, end)}
  if (yStart >= ufStart && yStart <= start){ stroke(255, 255, 0); arc(0, 0, r * scs, r * scs, start, end)}
  //arc(0, 0, r * scs, r * scs, start, end);


  //background(0);
  //arc 2
  var start = PI/2 + 2*PI/3 + arcgap;
  var end = 5 * PI/2 - arcgap;
  var ufStart = start - arcgap;
  var ufEnd = end + arcgap;
  //arc(0, 0, r * scs, r * scs, start, end);
  //cyan -> magenta -> yellow
  //ellipse(r * scs * cos(mStart), r * scs * sin(mStart), 1);
  //ellipse(r * scs * cos(mStart), r * scs * sin(mStart), 1);
  if (yStart >= start && mStart < end){ stroke(0, 255, 255); arc(0, 0, r * scs, r * scs, start, yStart); }
  if (cStart >= start && yStart < end){ stroke(255, 0, 255); arc(0, 0, r * scs, r * scs, start, cStart); }
  if (mStart >= start && cStart < end){ stroke(255, 255, 0); arc(0, 0, r * scs, r * scs, start, mStart); }
  



  strokeCap(ROUND);
}