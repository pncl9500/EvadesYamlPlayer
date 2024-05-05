cheatMenuPaddingBetween = 6;
cheatMenuLeftPadding = 6;
cheatMenuTopPadding = 10;
cheatMenuWidth = 500;
cheatMenuHeightScale = 720;
cheatMenuButtonPadding = 2;
cheatMenuRowItemPadding = 4;

function openCheatMenu(){
  queueCheatMenuChange(baseCheatMenuItems);
  cheatMenuOpen = true;
  mouseScroll = 0;
}

function closeCheatMenu(){
  cheatMenuOpen = false;
}

var relMouseX = 0;
var relMouseY = 0;
var mouseReleasedLastFrame = false;
function mouseReleased(){
  mouseReleasedLastFrame = true;
}
let mouseScroll = 0;
let maxMouseScroll = 0;
function mouseWheel(event) {
  mouseScroll -= event.delta;
}
function drawCheatMenu(){
  relMouseX = mouseX;
  relMouseY = mouseY;
  
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, windowWidth, windowHeight);

  push();
  fill(0, 0, 0, 160);
  scale(windowHeight / cheatMenuHeightScale);
  relMouseX /= windowHeight / cheatMenuHeightScale;
  relMouseY /= windowHeight / cheatMenuHeightScale;
  rect(0, 0, cheatMenuWidth, cheatMenuHeightScale);

  textAlign(LEFT, TOP);
  translate(cheatMenuLeftPadding, cheatMenuTopPadding);
  relMouseX -= cheatMenuLeftPadding;
  relMouseY -= cheatMenuTopPadding;
  let offset = 0;
  if (mouseScroll > 0){
    mouseScroll = 0;
  }
  if (mouseScroll < maxMouseScroll){
    mouseScroll = maxMouseScroll;
  }
  for (var i in cheatMenuItems){
    cheatMenuItems[i].draw(offset + mouseScroll);
    cheatMenuItems[i].behavior(offset + mouseScroll);
    offset += cheatMenuItems[i].height;
    //relMouseY += cheatMenuItems[i].height;
    offset += cheatMenuPaddingBetween;
    //relMouseY += cheatMenuPaddingBetween;
    maxMouseScroll = -offset;
  }

  pop();
  mouseReleasedLastFrame = false;

  if (newCheatMenu !== undefined){
    cheatMenuItems = newCheatMenu;
    newCheatMenu = undefined;
  }
}

class CheatMenuItem{
  constructor(height, width){
    this.height = height;
    this.width = width;
  }
  draw(offset){

  }
  behavior(offset){

  }
}

class CheatMenuText extends CheatMenuItem{
  constructor(text, height){
    super(height, 0);
    textSize(height);
    this.width = textWidth(text);
    this.text = text;
  }
  draw(offset){
    noStroke();
    textSize(this.height);
    fill(255);
    text(this.text, 0, offset);
  }
}

class CheatMenuLine extends CheatMenuItem{
  constructor(){
    super(2, cheatMenuWidth - cheatMenuLeftPadding * 2);
  }
  draw(offset){
    stroke(255);
    strokeWeight(2);
    line(0, offset, cheatMenuWidth - cheatMenuLeftPadding * 2, offset);
  }
}

class CheatMenuButton extends CheatMenuItem{
  constructor(text, width, height, func){
    super(height, width);
    this.text = text;
    this.width = width;
    this.func = func;
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return ptRect(relMouseX, relMouseY, 0, offset, this.width, this.height);
  }
  draw(offset){
    noStroke();
    fill(255);
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(125);
      if (mouseReleasedLastFrame){
        this.func();
      }
    }
    rect(0, offset, this.width, this.height);
    textSize(this.height - cheatMenuButtonPadding * 2);
    fill(0);
    textAlign(LEFT, CENTER);
    text(this.text, cheatMenuButtonPadding, offset + this.height / 2 + 0.5);
    textAlign(LEFT, TOP);
  }
}

class CheatMenuRow extends CheatMenuItem{
  constructor(items){
    super(0);
    this.items = items;
    let greatestHeight = 0;
    let width = 0;
    for (var i in items){
      if (items[i].height > greatestHeight){
        greatestHeight = items[i].height;
        width += items[i].width;
        width += cheatMenuRowItemPadding;
      }
    }
    this.height = greatestHeight;
  }
  draw(offset){
    push();
    let initialRelMouseX = relMouseX;
    for (var i in this.items){
      this.items[i].draw(offset);
      this.items[i].behavior();
      translate(this.items[i].width + cheatMenuRowItemPadding, 0)
      relMouseX -= this.items[i].width + cheatMenuRowItemPadding;
    }
    relMouseX = initialRelMouseX;
    pop();
  }
}

class CheatMenuToggle extends CheatMenuItem{
  constructor(width, height, toggled, onFunc, offFunc, getStateFunc){
    super(height, width);
    this.toggled = toggled;
    this.onFunc = onFunc;
    this.offFunc = offFunc;
    this.toggleBoxPadding = 2;
    this.getStateFunc = getStateFunc;
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return ptRect(relMouseX, relMouseY, 0, offset, this.width, this.height);
  }
  draw(offset){
    if (this.getStateFunc !== undefined){
      this.toggled = this.getStateFunc();
    }
    stroke(255);
    strokeWeight(1);
    noFill();
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(255, 100);
      if (mouseReleasedLastFrame){
        if (this.toggled){
          this.toggled = false;
          this.offFunc();
        } else {
          this.toggled = true;
          this.onFunc();
        }
      }
    }
    rect(0, offset, this.width, this.height);
    if (this.toggled){
      fill(255);
      noStroke();
      rect(0 + this.toggleBoxPadding, offset + this.toggleBoxPadding, this.width - this.toggleBoxPadding * 2, this.height - this.toggleBoxPadding * 2);
    }
  }
}


bigLine = new CheatMenuLine();
function txt(text, height){
  return new CheatMenuText(text, height);
}

function btn(text, width, height, func){
  return new CheatMenuButton(text, width, height, func);
}

function row(items){
  return new CheatMenuRow(items);
}

function tog(width, height, toggled, onFunc, offFunc, getStateFunc){
  return new CheatMenuToggle(width, height, toggled, onFunc, offFunc, getStateFunc);
}

let cheatMenuItems = [];
let baseCheatMenuItems = [];
function setCheatMenuItems(){
  let list = [
    txt("Cheat Menu", 36), bigLine,
    txt("Vanilla settings", 20), bigLine,
    row([txt("Show tiles:", 12), 
        tog(11, 11, true, () => {settings.drawTiles = true}, () => {settings.drawTiles = false}),]),
    row([txt("Show outlines:", 12), 
        tog(11, 11, true, () => {settings.drawOutlines = true}, () => {settings.drawOutlines = false}),]),
    txt("Quick Cheats", 20), bigLine,
    row([txt("Change area:", 12), 
        btn("-40", 18, 12, () => {game.mainPlayer.changeAreaCheat(-40); game.mainPlayer.moveToAreaStart()}),
        btn("-10", 18, 12, () => {game.mainPlayer.changeAreaCheat(-10); game.mainPlayer.moveToAreaStart()}),
        btn("-1", 18, 12, () => {game.mainPlayer.changeAreaCheat(-1); game.mainPlayer.moveToAreaStart()}),
        btn("+1", 18, 12, () => {game.mainPlayer.changeAreaCheat(1); game.mainPlayer.moveToAreaStart()}),
        btn("+10", 18, 12, () => {game.mainPlayer.changeAreaCheat(10); game.mainPlayer.moveToAreaStart()}),
        btn("+40", 18, 12, () => {game.mainPlayer.changeAreaCheat(40); game.mainPlayer.moveToAreaStart()}),
        btn("First", 20, 12, () => {game.mainPlayer.changeAreaCheat(-4000); game.mainPlayer.moveToAreaStart()}),
        btn("Last", 20, 12, () => {game.mainPlayer.changeAreaCheat(4000); game.mainPlayer.moveToAreaStart()}),]),
    row([txt("Change region: ", 12), 
        btn("Open list", 37, 12, () => {queueCheatMenuChange(getRegionSelectorMenu())}),]),
    row([txt("Move within area:", 12), 
        btn("Start", 22, 12, () => {game.mainPlayer.moveToAreaStart()}),
        btn("End", 22, 12, () => {game.mainPlayer.moveToAreaEnd()}),]),
    row([txt("Stats:", 12), 
        btn("Fully max", 38, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 150; for(var i = 0; i < 5; i++){game.mainPlayer.ability1.upgrade(game.mainPlayer)}; for(var i = 0; i < 5; i++){game.mainPlayer.ability2.upgrade(game.mainPlayer)};}),
        btn("Max stats only", 56, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 150}),
        btn("Give points only", 62, 12, () => {game.mainPlayer.upgradePoints += 150;}),]),
    row([txt("Set FPS:", 12), 
        btn("30", 18, 12, () => {frameRate(30)}),
        btn("60", 18, 12, () => {frameRate(60)}),]),
    row([txt("Dummy player control:", 12), 
        btn("Cycle players", 54, 12, () => {game.cycleMainPlayer()}),]),
        //btn("Remove current player", 86, 12, () => {game.removeCurrentPlayer()}),]),
    row([txt("Invincibility:", 12), 
        tog(11, 11, false, () => {settings.invincibilityCheat = true}, () => {settings.invincibilityCheat = false}, () => {return settings.invincibilityCheat;}),]),
    row([txt("Infinite ability use:", 12), 
        tog(11, 11, false, () => {settings.infiniteAbilityUseCheat = true}, () => {settings.infiniteAbilityUseCheat = false}, () => {return settings.infiniteAbilityUseCheat;}),]),
  ]
  baseCheatMenuItems = list;
  return list;
}

let newCheatMenu = undefined;
function queueCheatMenuChange(list){
  newCheatMenu = list;
}

function getRegionSelectorMenu(){
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}),
    txt("Region List", 20), bigLine,
  ];
  for (let i in game.regions){
    list.push(btn(game.regions[i].name, 180, 12, () => {
      game.mainPlayer.area.exit(game.mainPlayer);
      game.mainPlayer.area.attemptUnload(game.mainPlayer);
      game.mainPlayer.goToRegionFromId(i);
      game.mainPlayer.goToAreaFromId(0);
      game.mainPlayer.area.enter(game.mainPlayer);
      game.mainPlayer.area.attemptLoad(true);
      game.mainPlayer.moveToAreaStart();
    }));
  }
  return list;
}

class CheatInvincibilityEffect extends Effect{
  constructor(){
    super(0, effectPriorities["CheatInvincibilityEffect"], false, true);
  }
  doEffect(target){
    target.invincible = true;
    target.corrosiveBypass = true;
    let mag = 60;
    let f = 0.1;
    target.tempColor = {r: target.tempColor.r + mag + sin(frameCount * f) * mag, g: target.tempColor.g + mag + sin(frameCount * f) * mag, b: target.tempColor.b + mag + sin(frameCount * f) * mag}
    target.doCheatRevive = true;
  }
}

class CheatInfiniteAbilityEffect extends Effect{
  constructor(){
    super(0, effectPriorities["CheatInfiniteAbilityEffect"], false, true);
  }
  doEffect(target){
    target.energy = target.maxEnergy;
    target.cooldownMultiplier = 0;
    target.energyBarColor = {r: 200, g: 235, b: 255};
  }
}


function ptRect(ptx, pty, rectx, recty, rectw, recth){
  return ptx >= rectx &&
         ptx <= rectx + rectw &&
         pty >= recty &&
         pty <= recty + recth;
}