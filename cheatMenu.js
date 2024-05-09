cheatMenuPaddingBetween = 6;
cheatMenuLeftPadding = 6;
cheatMenuTopPadding = 10;
cheatMenuWidth = 500;
cheatMenuHeightScale = 600;
cheatMenuButtonPadding = 2;
cheatMenuRowItemPadding = 4;

function openCheatMenu(){
  if (game.players.length === 0){
    queueCheatMenuChange(getPlayerlessCheatMenuItems());
  } else {
    queueCheatMenuChange(baseCheatMenuItems);
  }
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
    if (width === null){
      textSize(this.height - cheatMenuButtonPadding * 2);
      this.width = textWidth(this.text) + cheatMenuButtonPadding * 2 + 1;
    }
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
      rect(0 + this.toggleBoxPadding, offset + this.toggleBoxPadding, this.width - this.toggleBoxPadding * 2 - 0.40, this.height - this.toggleBoxPadding * 2 - 0.40);
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
    txt("Vanilla settings", 20), bigLine,
        row([txt("Show tiles:", 12), 
            tog(11, 11, true, () => {settings.drawTiles = true}, () => {settings.drawTiles = false}, undefined, "Enable grid lines."),]),
        row([txt("Show outlines:", 12), 
            tog(11, 11, true, () => {settings.drawOutlines = true}, () => {settings.drawOutlines = false}, undefined, "Enable enemy outlines."),]),
    txt("Sandbox settings", 20), bigLine,
        row([txt("Change hero: ", 12), 
            btn("Open list", 37, 12, () => {queueCheatMenuChange(getHeroSelectorMenu())}, "Select a hero."),]),
        row([txt("Instant respawn:", 12), 
            tog(11, 11, true, () => {settings.instantRespawn = true}, () => {settings.instantRespawn = false}, () => {return settings.instantRespawn;}, "Instantly respawn at the most recent safe zone when appropriate."),]),
        row([txt("Recharge cooldown on respawn:", 12), 
            tog(11, 11, true, () => {settings.rechargeCooldownOnDeath = true}, () => {settings.rechargeCooldownOnDeath = false}, () => {return settings.rechargeCooldownOnDeath;}, "Recharge all cooldowns upon respawning."),]),
        row([txt("Background tint:", 12), 
            tog(11, 11, true, () => {settings.regionBackground = true}, () => {settings.regionBackground = false}, () => {return settings.regionBackground;}, "Add a tint to the background based on the area's color."),]),
    txt("Quick Cheats", 20), bigLine,
        row([txt("Change area:", 12), 
            btn("-40", 18, 12, () => {game.mainPlayer.changeAreaCheat(-40); game.mainPlayer.moveToAreaStart()}, "Move back 40 areas."),
            btn("-10", 18, 12, () => {game.mainPlayer.changeAreaCheat(-10); game.mainPlayer.moveToAreaStart()}, "Move back 10 areas."),
            btn("-1", 18, 12, () => {game.mainPlayer.changeAreaCheat(-1); game.mainPlayer.moveToAreaStart()}, "Move back 1 area."),
            btn("+1", 18, 12, () => {game.mainPlayer.changeAreaCheat(1); game.mainPlayer.moveToAreaStart()}, "Move forward 1 area."),
            btn("+10", 18, 12, () => {game.mainPlayer.changeAreaCheat(10); game.mainPlayer.moveToAreaStart()}, "Move forward 10 areas. Hotkey: [R] (only while alive)"),
            btn("+40", 18, 12, () => {game.mainPlayer.changeAreaCheat(40); game.mainPlayer.moveToAreaStart()}, "Move forward 40 areas."),
            btn("First", 20, 12, () => {game.mainPlayer.changeAreaCheat(-4000); game.mainPlayer.moveToAreaStart()}, "Move to the first area."),
            btn("Last", 20, 12, () => {game.mainPlayer.changeAreaCheat(4000); game.mainPlayer.moveToAreaStart()}, "Move to the last area."),]),
        row([txt("Change region: ", 12), 
            btn("Open list", 37, 12, () => {queueCheatMenuChange(getRegionSelectorMenu())}, "Teleport to a region."),]),
        row([txt("Move within area:", 12), 
            btn("Start", 22, 12, () => {game.mainPlayer.moveToAreaStart()}, "Move to the start of the current area. Hotkey: [E]"),
            btn("End", 22, 12, () => {game.mainPlayer.moveToAreaEnd()}, "Move to the end of the current area. Hotkey: [T]"),]),
        row([txt("Stats:", 12), 
            btn("Fully max", 38, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 160; for(var i = 0; i < 5; i++){game.mainPlayer.ability1.upgrade(game.mainPlayer)}; for(var i = 0; i < 5; i++){game.mainPlayer.ability2.upgrade(game.mainPlayer)};}, "Max out all stats and abilities. Hotkey: [F]"),
            btn("Max stats only", 56, 12, () => {game.mainPlayer.speed = gameConsts.maxSpeed; game.mainPlayer.maxEnergy = gameConsts.maxEnergy; game.mainPlayer.regen = gameConsts.maxRegen; game.mainPlayer.upgradePoints += 150}, "Only max out stats."),
            btn("Give points only", 62, 12, () => {game.mainPlayer.upgradePoints += 150;}, "Give points without upgrading anything."),]),
        row([txt("Set FPS:", 12), 
            btn("30", 18, 12, () => {frameRate(30)}, "Set the framerate to 30."),
            btn("60", 18, 12, () => {frameRate(60)}, "Set the framerate to 60."),]),
            //btn("Remove current player", 86, 12, () => {game.removeCurrentPlayer()}),]),
            row([txt("Player control:", 12), 
            btn("Kill", 17, 12, () => {game.mainPlayer.die()}, "Become downed."),
            btn("Revive", 31, 12, () => {game.mainPlayer.doRevive = true}, "Revive yourself. Hotkey: [R] (only while downed)"),]),
            row([txt("Invincibility:", 12), 
            tog(11, 11, false, () => {settings.invincibilityCheat = true}, () => {settings.invincibilityCheat = false}, () => {return settings.invincibilityCheat;}, "Become truly invincible, bypassing corrosion. Hotkey: [V]"),]),
            row([txt("Infinite ability use:", 12), 
            tog(11, 11, false, () => {settings.infiniteAbilityUseCheat = true}, () => {settings.infiniteAbilityUseCheat = false}, () => {return settings.infiniteAbilityUseCheat;}, "Remove all cooldowns and gain infinite energy. Hotkey: [B]"),]),
    txt("Players", 20), bigLine,
        row([txt("Player management:", 12), 
            btn("Create new", null, 12, () => {queueCheatMenuChange(getPlayerCreationMenu())}, "Create a new player."),
            btn("Delete current", null, 12, () => {let m = game.mainPlayer; game.cycleMainPlayer(), m.removeSelf();if (game.players.length === 0){queueCheatMenuChange(getPlayerlessCheatMenuItems());}}, "Delete the main player."),
            btn("Clear players", null, 12, () => {clearDummyPlayers()}, "Delete all players except for the currently controlled one."),
            btn("Cycle players", null, 12, () => {game.cycleMainPlayer()}, "Change the main player to the next player. Hotkey: [Q]"),]),
        row([txt("Edit players:", 12), 
            btn("Open list", 37, 12, () => {queueCheatMenuChange(getPlayerSelectorMenu())}, "Select a player to edit."),]),
        row([txt("Change controls on cycle:", 12), 
            tog(11, 11, true, () => {settings.changeCtrlsOnCycle = true}, () => {settings.changeCtrlsOnCycle = false}, () => {return settings.changeCtrlsOnCycle;}, "Automatically transfer the controls of the current main player to the new main player when cycling main players. Disable if you're editing controls and want to keep your changes consistent."),]),
        row([txt("Remove dead players:", 12), 
            tog(11, 11, false, () => {settings.removeDeadPlayers = true}, () => {settings.removeDeadPlayers = false}, () => {return settings.removeDeadPlayers;}, "Remove players if their death timer reaches zero (does not affect the main player)."),]),
        btn("Restore controls", null, 12, () => {for (let i in defaultControls){game.mainPlayer.ctrlSets.push(defaultControls[i])}}, "Give default controls to the main player. If you can't control anything, press this button."),
    txt("Fun", 20), bigLine,
        row([txt("Enemy speed:", 12), 
            btn("Frozen", null, 12, () => {massChangeEnemySpeed(0)}, "Change the speed of all enemies to 0."),
            btn("Frigid", null, 12, () => {massChangeEnemySpeed(1)}, "Change the speed of all enemies to 1."),
            btn("Slow", null, 12, () => {massChangeEnemySpeed(3)}, "Change the speed of all enemies to 3."),
            btn("Moderate", null, 12, () => {massChangeEnemySpeed(5)}, "Change the speed of all enemies to 5."),
            btn("Speedy", null, 12, () => {massChangeEnemySpeed(9)}, "Change the speed of all enemies to 9."),
            btn("Fast", null, 12, () => {massChangeEnemySpeed(17)}, "Change the speed of all enemies to 17."),
            btn("Subsonic", null, 12, () => {massChangeEnemySpeed(30)}, "Change the speed of all enemies to 30."),
            btn("Supersonic", null, 12, () => {massChangeEnemySpeed(60)}, "Change the speed of all enemies to 60."),
            btn("Hypersonic", null, 12, () => {massChangeEnemySpeed(120)}, "Change the speed of all enemies to 120."),]),
        row([txt("Enemy size:", 12), 
            btn("Microscopic", null, 12, () => {massChangeEnemySize(2)}, "Change the size of most enemies to 2."),
            btn("Tiny", null, 12, () => {massChangeEnemySize(6)}, "Change the size of most enemies to 6."),
            btn("Small", null, 12, () => {massChangeEnemySize(10)}, "Change the size of most enemies to 10."),
            btn("Normal", null, 12, () => {massChangeEnemySize(18)}, "Change the size of most enemies to 18."),
            btn("Sizeable", null, 12, () => {massChangeEnemySize(32)}, "Change the size of most enemies to 32."),
            btn("Big", null, 12, () => {massChangeEnemySize(48)}, "Change the size of most enemies to 48."),
            btn("Huge", null, 12, () => {massChangeEnemySize(90)}, "Change the size of most enemies to 90."),
            btn("Enormous", null, 12, () => {massChangeEnemySize(135)}, "Change the size of most enemies to 135."),
            btn("Titanic", null, 12, () => {massChangeEnemySize(210)}, "Change the size of most enemies to 210."),]),
        row([txt("Player size:", 12), 
            btn("Tiny", null, 12, () => {game.mainPlayer.baseRadius = 3;}, "Become a very small size."),
            btn("Small", null, 12, () => {game.mainPlayer.baseRadius = 8;}, "Become a small size."),
            btn("Normal", null, 12, () => {game.mainPlayer.baseRadius = 16;}, "Become a normal size."),
            btn("Big", null, 12, () => {game.mainPlayer.baseRadius = 32;}, "Become a large size."),
            btn("Huge", null, 12, () => {game.mainPlayer.baseRadius = 64;}, "Become a very large size."),]),
        row([txt("Player speed:", 12), 
            btn("Backwards", null, 12, () => {game.mainPlayer.speed *= -1;}, "Reverse your speed."),
            btn("Base min", null, 12, () => {game.mainPlayer.speed = 5;}, "Become your starting speed."),
            btn("x1/2", null, 12, () => {game.mainPlayer.speed = 8.5;}, "Become half of maximum speed."),
            btn("+0", null, 12, () => {game.mainPlayer.speed = 17;}, "Become your maximum speed."),
            btn("+2", null, 12, () => {game.mainPlayer.speed = 19;}, "Become the speed of a player with factorb's speed buff."),
            btn("+3", null, 12, () => {game.mainPlayer.speed = 20;}, "Become the speed of a factorb with its own speed buff."),
            btn("+5", null, 12, () => {game.mainPlayer.speed = 22;}, "Become the speed of a speed-boosted shade, candy, or nexus."),
            btn("+6", null, 12, () => {game.mainPlayer.speed = 23;}, "Become the speed of a magmax with flow active."),
            btn("x2", null, 12, () => {game.mainPlayer.speed = 34;}, "Become double base maximum speed."),
            btn("x3", null, 12, () => {game.mainPlayer.speed = 51;}, "Become triple base maximum speed."),
            btn("x4", null, 12, () => {game.mainPlayer.speed = 68;}, "Become quadruple base maximum speed."),
            btn("x8", null, 12, () => {game.mainPlayer.speed = 136;}, "Become octuple base maximum speed."),]),
        row([txt("Misc. Enemy modifiers:", 12), 
            btn("Invisible Mode", null, 12, () => {
              for (var i in game.mainPlayer.area.entities){
                if (game.mainPlayer.area.entities[i].mainType === "enemy"){
                  game.mainPlayer.area.entities[i].color.a = 0;
                }
              }
            }, "Make all enemies invisible. Not sure why you would want to do this..."),
            btn("Immune mode", null, 12, () => {for (var i in game.mainPlayer.area.entities){if (game.mainPlayer.area.entities[i].mainType === "enemy"){
              game.mainPlayer.area.entities[i].immune = true;
              game.mainPlayer.area.entities[i].color = {r: 0, g: 0, b: 0};
            }}}, "Make all enemies immune."),
            btn("Ring Mode", null, 12, () => {
              for (var i in game.mainPlayer.area.entities){
                if (game.mainPlayer.area.entities[i].mainType === "enemy"){
                  game.mainPlayer.area.entities[i].renderType = "ring";
                  game.mainPlayer.area.entities[i].corrosive = true;
                  game.mainPlayer.area.entities[i].immune = true;
                }
              }
            }, "Make all enemies look like rings, as well as making them immune and corrosive."),
            btn("Tiny auras", null, 12, () => {
              for (var i in game.mainPlayer.area.entities){
                if (game.mainPlayer.area.entities[i].mainType === "enemy"){
                  game.mainPlayer.area.entities[i].auraSize = min(30, game.mainPlayer.area.entities[i].auraSize);
                }
              }
            }, "Make all enemy auras tiny."),
            btn("Huge auras", null, 12, () => {
              for (var i in game.mainPlayer.area.entities){
                if (game.mainPlayer.area.entities[i].mainType === "enemy"){
                  game.mainPlayer.area.entities[i].auraSize = max(450, game.mainPlayer.area.entities[i].auraSize);
                }
              }
            }, "Make all enemy auras huge."),
            btn("Horizontal mode", null, 12, () => {
              for (var i in game.mainPlayer.area.entities){
                if (game.mainPlayer.area.entities[i].mainType === "enemy"){
                  game.mainPlayer.area.entities[i].angle = random() < 0.5 ? 0 : PI;
                  game.mainPlayer.area.entities[i].angleToVel();
                }
              }
            }, "Make all enemies move horizontally."),
        ]),
      row([ 
      btn("Vertical mode", null, 12, () => {
        for (var i in game.mainPlayer.area.entities){
          if (game.mainPlayer.area.entities[i].mainType === "enemy"){
            game.mainPlayer.area.entities[i].angle = random() < 0.5 ? PI/2 : 3*PI/2;
            game.mainPlayer.area.entities[i].angleToVel();
          }
        }
      }, "Make all enemies move vertically."),
      btn("Orthogonal mode", null, 12, () => {for (var i in game.mainPlayer.area.entities){if (game.mainPlayer.area.entities[i].mainType === "enemy"){
        game.mainPlayer.area.entities[i].angle = floor(random() * 4) * Math.PI/2;
        game.mainPlayer.area.entities[i].angleToVel();
      }}}, "Make all enemies move in an orthogonal direction."),
      btn("45 degree mode", null, 12, () => {for (var i in game.mainPlayer.area.entities){if (game.mainPlayer.area.entities[i].mainType === "enemy"){
        game.mainPlayer.area.entities[i].angle = floor(random() * 4) * Math.PI/2 + Math.PI/4;
        game.mainPlayer.area.entities[i].angleToVel();
      }}}, "Make all enemies move in a diagonal direction 45 degrees off of an orthogonal one."),
      btn("Rainbow mode", null, 12, () => {for (var i in game.mainPlayer.area.entities){if (game.mainPlayer.area.entities[i].mainType === "enemy"){
        game.mainPlayer.area.entities[i].color = {r: random(80, 255), g: random(80, 255), b: random(80, 255)}
        game.mainPlayer.area.entities[i].speed *= random(0.4,2);
        if (random() < 0.08){
          game.mainPlayer.area.entities[i].speed *= random(1,2);
        }
        game.mainPlayer.area.entities[i].speedToVel();
        if (game.mainPlayer.area.entities[i].constructor.name === "Wall"){
          return;
        }
        game.mainPlayer.area.entities[i].baseRadius *= random(0.4,1.6);
        if (random() < 0.3){
          game.mainPlayer.area.entities[i].baseRadius *= random(0.2,2.5);
        }
      }}}, "Make all enemies a random color and randomizes their properties."),
    ]),
    
  ]
  baseCheatMenuItems = list;
  return list;
}

function massChangeEnemySpeed(speed){
  let player = game.mainPlayer;
  for (var i in player.area.entities){
    if (player.area.entities[i].mainType === "enemy"){
      player.area.entities[i].speed = speed;
      player.area.entities[i].speedToVel();
      //for dasher...
      player.area.entities[i].normal_speed = speed;
      player.area.entities[i].base_speed = speed / 5;
      player.area.entities[i].prepare_speed = speed / 5;
      player.area.entities[i].dash_speed = speed;
    }
  }
}

function massChangeEnemySize(size){
  let player = game.mainPlayer;
  for (var i in player.area.entities){
    if (player.area.entities[i].mainType === "enemy" && player.area.entities[i].constructor.name !== "Wall"){
      player.area.entities[i].baseRadius = size;
    }
  }
}

let newCheatMenu = undefined;
function queueCheatMenuChange(list){
  newCheatMenu = list;
}

function clearDummyPlayers(exception = game.mainPlayer){
  for (var i = 0; i < game.players.length; i++){
    if (game.players[i] !== exception){
      game.players[i].removeSelf();
      i--;
    }
  }
  game.cycleMainPlayer();
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

function getHeroSelectorMenu(playerToChange = game.mainPlayer, backMenuDestination = baseCheatMenuItems){
  let bmd = backMenuDestination;
  list = [
    btn("Go back", 38, 12, () => {if (typeof bmd === "function"){bmd = bmd()}queueCheatMenuChange(bmd)}, "Return to the previous menu."),
    txt("Hero List", 20), bigLine,
  ];
  for (const [key, value] of Object.entries(heroList)){
    let n = new(heroDict.get(key))(-99999, -99999, 0, "", false, game, 0, 0, []);
    n.toRemove = true;
    let nb = btn(n.heroName, 180, 12, () => {
      playerToChange.swapHero(key);
    })
    try {
      nb.color = hexToRgb(pal.hero[key]);
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
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

function getPlayerCreationMenu(){
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}, "Return to the previous menu."),
    row([txt("Random Variation:", 12), 
      tog(11, 11, true, () => {settings.randomDummySpawn = true}, () => {settings.randomDummySpawn = false}, () => {return settings.randomDummySpawn;}, "If enabled, dummy players will be spawned with a random positional variation."),]),
    txt("Hero List", 20), bigLine,
  ];
  for (const [key, value] of Object.entries(heroList)){
    let n = new(heroDict.get(key))(-99999, -99999, 0, "", false, game, 0, 0, []);
    n.toRemove = true;
    let nb = btn(n.heroName, 180, 12, () => {
      let dummyNum = max(1, game.players.length);
      let newPlayer = new(heroDict.get(key))(game.mainPlayer.x + random(-32,32) * settings.randomDummySpawn, game.mainPlayer.y + random(-32, 32) * settings.randomDummySpawn, 16, `Dummy player ${dummyNum}`, false, game, game.mainPlayer.regionNum, game.mainPlayer.areaNum, []);
      game.addPlayer(newPlayer);
    })
    try {
      nb.color = hexToRgb(pal.hero[key]);
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
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

function getPlayerSelectorMenu(){
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(baseCheatMenuItems)}, "Return to the previous menu."),
    txt("Player List", 20), bigLine,
  ];
  for (let i in game.players){
    let nb = btn(game.players[i].name, 180, 12, () => {
      queueCheatMenuChange(getPlayerEditMenu(game.players[i]));
    })
    try {
      nb.color = game.players[i].color;
      nb.hoverColor.r = nb.color.r + 40;
      nb.hoverColor.g = nb.color.g + 40;
      nb.hoverColor.b = nb.color.b + 40;
      if (nb.color.r + nb.color.g + nb.color.b < 216){
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

function getPlayerEditMenu(player){
  var editedPlayer = player;
  let pname = editedPlayer.name;
  list = [
    btn("Go back", 38, 12, () => {queueCheatMenuChange(getPlayerSelectorMenu())}, "Return to the previous menu."),
    txt("Editing " + pname, 20), bigLine,
    row([txt("Player management:", 12), 
        btn("Set as main", null, 12, () => {let oldSets = game.mainPlayer.ctrlSets; game.mainPlayer.ctrlSets = [], game.setMainPlayer(editedPlayer), editedPlayer.ctrlSets = oldSets}, "Make " + pname + " the main player, letting you control it."),
        btn("Set as main (ignore controls)", null, 12, () => {game.setMainPlayer(editedPlayer);}, "Make " + pname + " the main player without changing any controls."),
        btn("Delete player", null, 12, () => {game.cycleMainPlayer(), editedPlayer.removeSelf();if (game.players.length === 0){queueCheatMenuChange(getPlayerlessCheatMenuItems())} else {queueCheatMenuChange(getPlayerSelectorMenu())}}, "Delete " + pname + "."),
        btn("Clear other players", null, 12, () => {clearDummyPlayers(editedPlayer)}, "Delete all players except for " + pname + "."),]),
    row([txt("Change hero: ", 12), 
        btn("Open list", 37, 12, () => {queueCheatMenuChange(getHeroSelectorMenu(editedPlayer, getPlayerSelectorMenu))}, "Select a hero for " + pname + " to be."),]), 
    row([txt("Controlled by WASD:", 12), 
        tog(11, 11, false, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              return;
            }
          }
          editedPlayer.ctrlSets.push(new WASDset());
        }, () => {
          for (let i = 0; i < editedPlayer.ctrlSets.length; i++){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              editedPlayer.ctrlSets.splice(i, 1);
              i--;
            }
          }
        }, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "WASDset"){
              return true;
            }
          }
          return false;
        }, "Control " + pname + " with WASD for movement and JKL for abilities."),]),
    row([txt("Controlled by arrows:", 12), 
        tog(11, 11, false, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              return;
            }
          }
          editedPlayer.ctrlSets.push(new ArrowSet());
        }, () => {
          for (let i = 0; i < editedPlayer.ctrlSets.length; i++){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              editedPlayer.ctrlSets.splice(i, 1);
              i--;
            }
          }
        }, () => {
          for (let i in editedPlayer.ctrlSets){
            if (editedPlayer.ctrlSets[i].constructor.name === "ArrowSet"){
              return true;
            }
          }
          return false;
        }, "Control " + pname + " with the arrow keys for movement and ZXC for abilities."),]),
  ];
  return list;
}

function getPlayerlessCheatMenuItems(){
  list = [
    txt("Oh no!", 20),
    txt("It appears that you have no body. Wanna fix that?", 12),
    btn("Click here to fix that.", 78, 12, () => {
      game.addPlayer(new Magmax(176 + random(-64,64), 240 + random(-96,96), 16, "Player 1", true, game, startingRegionId, startingAreaNum, [new WASDset, new ArrowSet]));
      game.cycleMainPlayer();
      queueCheatMenuChange(baseCheatMenuItems);
    }, "Fix that."),
    txt("", 3000),
    btn("No thanks, I'll handle it myself", 111, 12, () => {
      queueCheatMenuChange(baseCheatMenuItems);
      mouseScroll = 0;
    }, "Return to the default menu and try to regain a body on your own. Oddities and crashes may occur!"),
  ]
  return list;
}

class CheatInvincibilityEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("CheatInvincibilityEffect"), false, true);
  }
  doEffect(target){
    target.invincible = true;
    target.corrosiveBypass = true;
    let mag = 60;
    let f = 0.1;
    target.tempColor = {r: target.tempColor.r + mag + sin(frameCount * f) * mag, g: target.tempColor.g + mag + sin(frameCount * f) * mag, b: target.tempColor.b + mag + sin(frameCount * f) * mag}
    target.doRevive = true;
  }
}

class CheatInfiniteAbilityEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("CheatInfiniteAbilityEffect"), false, true);
  }
  doEffect(target){
    target.energy = target.maxEnergy;
    target.cooldownMultiplier = 0;
    target.energyBarColor = {r: 200, g: 235, b: 255, a: 255};
  }
}


function ptRect(ptx, pty, rectx, recty, rectw, recth){
  return ptx >= rectx &&
         ptx <= rectx + rectw &&
         pty >= recty &&
         pty <= recty + recth;
}