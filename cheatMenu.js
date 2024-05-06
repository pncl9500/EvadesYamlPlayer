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
tooltipPadding = 2;
tooltipHeight = 13;
function drawCheatMenu(){
  tooltipToRender = false;
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
  if (tooltipToRender){
    stroke(0);
    strokeWeight(1);
    fill(255);
    textSize(tooltipHeight - tooltipPadding * 2)
    rect(relMouseX + 10, relMouseY, textWidth(tooltipToRender) + tooltipPadding * 2, tooltipHeight);
    noStroke();
    textAlign(LEFT, TOP);
    fill(0);
    text(tooltipToRender, relMouseX + tooltipPadding + 10, relMouseY + tooltipPadding);
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
  constructor(text, width, height, func, tooltip){
    super(height, width);
    this.text = text;
    this.width = width;
    this.func = func;
    this.tooltip = tooltip;
    this.color = {r: 255, g: 255, b: 255};
    this.hoverColor = {r: 125, g: 125, b: 125};
    this.textColor = {r: 0, g: 0, b: 0};
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return ptRect(relMouseX, relMouseY, 0, offset, this.width, this.height);
  }
  draw(offset){
    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(this.hoverColor.r, this.hoverColor.g, this.hoverColor.b);
      if (mouseReleasedLastFrame){
        this.func();
      }
    }
    rect(0, offset, this.width, this.height);
    textSize(this.height - cheatMenuButtonPadding * 2);
    fill(this.textColor.r, this.textColor.g, this.textColor.b);
    textAlign(LEFT, CENTER);
    text(this.text, cheatMenuButtonPadding, offset + this.height / 2 + 0.5);
    textAlign(LEFT, TOP);
    if (this.tooltip !== undefined && this.hoveredByMouse(relMouseX, relMouseY, offset)){
      tooltipToRender = this.tooltip;
    }
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
  constructor(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip){
    super(height, width);
    this.toggled = toggled;
    this.onFunc = onFunc;
    this.offFunc = offFunc;
    this.toggleBoxPadding = 2;
    this.getStateFunc = getStateFunc;
    this.tooltip = tooltip;
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
    if (this.tooltip !== undefined && this.hoveredByMouse(relMouseX, relMouseY, offset)){
      tooltipToRender = this.tooltip;
    }
  }
}


bigLine = new CheatMenuLine();
function txt(text, height){
  return new CheatMenuText(text, height);
}

function btn(text, width, height, func, tooltip){
  return new CheatMenuButton(text, width, height, func, tooltip);
}

function row(items){
  return new CheatMenuRow(items);
}

function tog(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip){
  return new CheatMenuToggle(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip);
}

let cheatMenuItems = [];
let baseCheatMenuItems = [];
function setCheatMenuItems(){
  let list = [
    txt("Cheat Menu", 36), bigLine,
    txt("Vanilla settings", 20), bigLine,
    row([txt("Show tiles:", 12), 
        tog(11, 11, true, () => {settings.drawTiles = true}, () => {settings.drawTiles = false}, undefined, "Enable grid lines."),]),
    row([txt("Show outlines:", 12), 
        tog(11, 11, true, () => {settings.drawOutlines = true}, () => {settings.drawOutlines = false}, undefined, "Enable enemy outlines."),]),
    txt("Quick Cheats", 20), bigLine,
    row([txt("Change area:", 12), 
        btn("-40", 18, 12, () => {game.mainPlayer.changeAreaCheat(-40); game.mainPlayer.moveToAreaStart()}, "Move back 40 areas."),
        btn("-10", 18, 12, () => {game.mainPlayer.changeAreaCheat(-10); game.mainPlayer.moveToAreaStart()}, "Move back 10 areas."),
        btn("-1", 18, 12, () => {game.mainPlayer.changeAreaCheat(-1); game.mainPlayer.moveToAreaStart()}, "Move back 1 area."),
        btn("+1", 18, 12, () => {game.mainPlayer.changeAreaCheat(1); game.mainPlayer.moveToAreaStart()}, "Move forward 1 area."),
        btn("+10", 18, 12, () => {game.mainPlayer.changeAreaCheat(10); game.mainPlayer.moveToAreaStart()}, "Move forward 10 areas."),
        btn("+40", 18, 12, () => {game.mainPlayer.changeAreaCheat(40); game.mainPlayer.moveToAreaStart()}, "Move forward 40 areas."),
        btn("First", 20, 12, () => {game.mainPlayer.changeAreaCheat(-4000); game.mainPlayer.moveToAreaStart()}, "Move to the first area."),
        btn("Last", 20, 12, () => {game.mainPlayer.changeAreaCheat(4000); game.mainPlayer.moveToAreaStart()}, "Move to the last area."),]),
    row([txt("Change region: ", 12), 
        btn("Open list", 37, 12, () => {queueCheatMenuChange(getRegionSelectorMenu())}, "Teleport to a region."),]),
    row([txt("Move within area:", 12), 
        btn("Start", 22, 12, () => {game.mainPlayer.moveToAreaStart()}, "Move to the start of the current area."),
        btn("End", 22, 12, () => {game.mainPlayer.moveToAreaEnd()}, "Move to the end of the current area."),]),
    row([txt("Stats:", 12), 
        btn("Fully max", 38, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 150; for(var i = 0; i < 5; i++){game.mainPlayer.ability1.upgrade(game.mainPlayer)}; for(var i = 0; i < 5; i++){game.mainPlayer.ability2.upgrade(game.mainPlayer)};}, "Max out all stats and abilities."),
        btn("Max stats only", 56, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 150}, "Only max out stats."),
        btn("Give points only", 62, 12, () => {game.mainPlayer.upgradePoints += 150;}, "Give points without upgrading anything."),]),
    row([txt("Set FPS:", 12), 
        btn("30", 18, 12, () => {frameRate(30)}, "Set the framerate to 30."),
        btn("60", 18, 12, () => {frameRate(60)}, "Set the framerate to 60."),]),
    row([txt("Dummy player control:", 12), 
        btn("Cycle players", 54, 12, () => {game.cycleMainPlayer()}, "Change the main player to the next player."),]),
        //btn("Remove current player", 86, 12, () => {game.removeCurrentPlayer()}),]),
    row([txt("Invincibility:", 12), 
        tog(11, 11, false, () => {settings.invincibilityCheat = true}, () => {settings.invincibilityCheat = false}, () => {return settings.invincibilityCheat;}, "Become truly invincible, bypassing corrosion."),]),
    row([txt("Infinite ability use:", 12), 
        tog(11, 11, false, () => {settings.infiniteAbilityUseCheat = true}, () => {settings.infiniteAbilityUseCheat = false}, () => {return settings.infiniteAbilityUseCheat;}, "Remove all cooldowns and gain infinite energy."),]),
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
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}, "Return to the previous menu."),
    txt("Region List", 20), bigLine,
  ];
  for (let i in game.regions){
    let nb = btn(game.regions[i].name, 180, 12, () => {
      game.mainPlayer.area.exit(game.mainPlayer);
      game.mainPlayer.area.attemptUnload(game.mainPlayer);
      game.mainPlayer.goToRegionFromId(i);
      game.mainPlayer.goToAreaFromId(0);
      game.mainPlayer.area.enter(game.mainPlayer);
      game.mainPlayer.area.attemptLoad(true);
      game.mainPlayer.moveToAreaStart();
    })
    try {
      nb.color.r = game.regions[i].properties.background_color[0];
      nb.color.g = game.regions[i].properties.background_color[1];
      nb.color.b = game.regions[i].properties.background_color[2];
      nb.hoverColor.r = game.regions[i].properties.background_color[0] + 40;
      nb.hoverColor.g = game.regions[i].properties.background_color[1] + 40;
      nb.hoverColor.b = game.regions[i].properties.background_color[2] + 40;
      if (game.regions[i].properties.background_color[0] + game.regions[i].properties.background_color[1] + game.regions[i].properties.background_color[2] < 216){
        nb.textColor.r = 255;
        nb.textColor.g = 255;
        nb.textColor.b = 255;
      }
    } catch (error) {
      //do nothing
    }
    list.push(nb);
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