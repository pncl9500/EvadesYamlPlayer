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


let cheatMenuItems = [];
let baseCheatMenuItems = [];
function setCheatMenuItems(){
  let list = [
    txt("Vanilla settings", 20), bigLine(),
        row([txt("Enable mouse:", 12), 
            tog(11, 11, true, () => {settings.mouseEnabled = true; settings.mouseToggled = false}, () => {settings.mouseEnabled = false}, undefined, "Enable mouse movement."),]),
        row([txt("Toggle mouse:", 12), 
            tog(11, 11, true, () => {settings.toggleMouse = true; settings.mouseToggled = false}, () => {settings.toggleMouse = false}, undefined, "Activate mouse movement only when the mouse is held down. No effect if mouse movement is disabled."),]),
        row([txt("Show tiles:", 12), 
            tog(11, 11, true, () => {settings.drawTiles = true}, () => {settings.drawTiles = false}, undefined, "Enable grid lines."),]),
        row([txt("Show outlines:", 12), 
            tog(11, 11, true, () => {settings.drawOutlines = true}, () => {settings.drawOutlines = false}, undefined, "Enable enemy outlines."),]),
        row([txt("Show hero card:", 12), 
            tog(11, 11, true, () => {ui.heroCard.hidden = false}, () => {ui.heroCard.hidden = true}, () => {return !ui.heroCard.hidden}, "Enable the hero card. Hotkey: [H]"),]),
        row([txt("Show minimap:", 12), 
            tog(11, 11, true, () => {ui.miniMap.hidden = false}, () => {ui.miniMap.hidden = true}, () => {return !ui.miniMap.hidden}, "Enable the minimap. Hotkey: [M]"),]),
        row([txt("Show timer:", 12), 
            tog(11, 11, false, () => {ui.timer.hidden = false}, () => {ui.timer.hidden = true}, () => {return !ui.timer.hidden}, "Enable the timer."),]),
        row([txt("Dark mode:", 12), 
            tog(11, 11, false, () => {
              settings.darkMode = true;
              let tempZoneColors = settings.zoneBaseColors;
              settings.zoneBaseColors = settings.zoneBaseColorsDark;
              settings.zoneBaseColorsDark = tempZoneColors;
              settings.gridColor = [255,255,250,40];
              settings.backgroundBrightness = 5;
            }, () => {
              settings.darkMode = false;
              let tempZoneColors = settings.zoneBaseColors;
              settings.zoneBaseColors = settings.zoneBaseColorsDark;
              settings.zoneBaseColorsDark = tempZoneColors;
              settings.gridColor = [0,0,20,40];
              settings.backgroundBrightness = 51;
            }, () => {
              return settings.darkMode;
            }, "Enable dark mode."),]),
    txt("Sandbox settings", 20), bigLine(),
        row([txt("Change hero: ", 12), 
            btn("Open list", 37, 12, () => {queueCheatMenuChange(getHeroSelectorMenu())}, "Select a hero."),]),
        row([txt("Instant respawn:", 12), 
            tog(11, 11, true, () => {settings.instantRespawn = true}, () => {settings.instantRespawn = false}, () => {return settings.instantRespawn;}, "Instantly respawn at the most recent safe zone when appropriate."),]),
        row([txt("Recharge cooldown on respawn:", 12), 
            tog(11, 11, true, () => {settings.rechargeCooldownOnDeath = true}, () => {settings.rechargeCooldownOnDeath = false}, () => {return settings.rechargeCooldownOnDeath;}, "Recharge all cooldowns upon respawning."),]),
        row([txt("Background tint:", 12), 
            tog(11, 11, true, () => {settings.regionBackground = true}, () => {settings.regionBackground = false}, () => {return settings.regionBackground;}, "Add a tint to the background based on the area's color."),]),
        row([txt("Infinite death timers:", 12), 
            tog(11, 11, false, () => {settings.infiniteDeathTimer = true}, () => {settings.infiniteDeathTimer = false}, () => {return settings.infiniteDeathTimer;}, "Prevent death timers from ticking down."),]),
        row([txt("Set FPS:", 12), 
            btn("30", 18, 12, () => {frameRate(30); settings.fps = 30}, "Set the framerate to 30."),
            btn("60", 18, 12, () => {frameRate(60); settings.fps = 60}, "Set the framerate to 60."),]),
        row([txt("Quality:", 12), 
            btn("Low", null, 12, () => {pixelDensity(basePixelDensity / 4)}, "Make the game have less pixels."),
            btn("Medium", null, 12, () => {pixelDensity(basePixelDensity / 2)}, "Make the game have a medium amount of pixels."),
            btn("High", null, 12, () => {pixelDensity(basePixelDensity)}, "Make the game have more pixels. This is the default setting."),]),
        row([txt("Show area header:", 12), 
            tog(11, 11, true, () => {ui.areaHeader.hidden = false}, () => {ui.areaHeader.hidden = true}, () => {return !ui.areaHeader.hidden}, "Enable the area header."),]),
        row([txt("Transparent pellets:", 12), 
            tog(11, 11, false, () => {settings.pelletOpacity = 0.15}, () => {settings.pelletOpacity = 1}, undefined, "Make pellets render as transparent."),]),
        row([txt("Fixed mouse angle:", 12), 
            tog(11, 11, true, () => {settings.mouseAngleFix = true}, () => {settings.mouseAngleFix = false}, undefined, "Fix mouse movement so the player's angle points directly towards the mouse at all times. NOT accurate to vanilla evades."),]),
        row([txt("Fixed wallbounces:", 12), 
            tog(11, 11, true, () => {settings.fixedWallbounces = true}, () => {settings.fixedWallbounces = false}, undefined, "Make enemy wallbounces behave independently from the framerate. Unknown if it is accurate to vanilla evades, and it may look weird with high enemy speeds."),]),
    txt("Quick Cheats", 20), bigLine(),
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
            //btn("Remove current player", 86, 12, () => {game.removeCurrentPlayer()}),]),
        row([txt("Player control:", 12), 
            btn("Kill", 17, 12, () => {game.mainPlayer.die()}, "Become downed."),
            btn("Revive", 31, 12, () => {game.mainPlayer.doRevive = true}, "Revive yourself. Hotkey: [R] (only while downed)"),]),
            row([txt("Invincibility:", 12), 
            tog(11, 11, false, () => {settings.invincibilityCheat = true}, () => {settings.invincibilityCheat = false}, () => {return settings.invincibilityCheat;}, "Become truly invincible, bypassing corrosion. Hotkey: [V]"),]),
            row([txt("Infinite ability use:", 12), 
            tog(11, 11, false, () => {settings.infiniteAbilityUseCheat = true}, () => {settings.infiniteAbilityUseCheat = false}, () => {return settings.infiniteAbilityUseCheat;}, "Remove all cooldowns and gain infinite energy. Hotkey: [B]"),]),
            row([txt("Time scale:", 12), 
              sld(0, 3, 120, (to) => {timeScale = to}, () => {return timeScale}, 0),
              pdd(3, 0),
              btn("Default", null, 12, () => {timeScale = 1}, "Reset time scale to its default value (1)."),]),
    txt("Players", 20), bigLine(),
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
        row([txt("Main player relative mouse movement:", 12), 
            tog(11, 11, false, () => {settings.mainRelativeMouseControl = true}, () => {settings.mainRelativeMouseControl = false}, () => {return settings.mainRelativeMouseControl;}, "Move mouse-controlled dummy players relative to the main player instead of the dummy player."),]),
        btn("Restore controls", null, 12, () => {for (let i in defaultControls){game.mainPlayer.ctrlSets.push(defaultControls[i])}}, "Give default controls to the main player. If you can't control anything, press this button."),
    txt("TASing", 20), bigLine(),
      txt("TASing tools are not in a functional state yet. You are not currently be able to make a TAS.", 8), 
        row([txt("TAS mode:", 12), 
            tog(11, 11, false, () => {settings.tasMode = true}, () => {settings.tasMode = false}, () => {return settings.tasMode;}, "Equally space every frame in time, making the game deterministic."),]),
        row([txt("Pause game:", 12), 
            tog(11, 11, false, () => {settings.gamePaused = true}, () => {settings.gamePaused = false}, () => {return settings.gamePaused;}, "Pause the game and prevent entities from updating. Pressing [P] or clicking the button below will cause a frame to occur."),]),
        btn("Skip frame", null, 12, () => {skipFrame()}, "Cause a frame to happen. Hotkey: [P] (only when paused)"),
    txt("Fun", 20), bigLine(),
      txt("Certain settings (particularly rainbow mode when used multiple times) may cause flashing light effects.", 8), 
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
            btn("Normal", null, 12, () => {game.mainPlayer.baseRadius = 15;}, "Become a normal size."),
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
      row([txt("Area settings:", 12), 
            btn("Spawn enemies again", null, 12, () => {
              for (let i in game.mainPlayer.area.zones){
                game.mainPlayer.area.zones[i].initSpawners();
              }
            }, "Respawn all enemies in the area without removing the first spawn."),
            btn("Spawn pellets again", null, 12, () => {
              game.mainPlayer.area.spawnBaseEnts(true);
            }, "Respawn all pellets in the area without removing the first spawn."),
            btn("Remove all", null, 12, () => {
              game.mainPlayer.area.entities = [];
            }, "Remove everything from the area."),
            btn("Remove wall", null, 12, () => {
              for (let i = 0; i < game.mainPlayer.area.entities.length; i++){
                if (game.mainPlayer.area.entities[i].constructor.name === "Wall"){
                  game.mainPlayer.area.entities.splice(i, 1);
                  i--;
                }
              };
            }, "Remove every wall enemy from the area."),]),
      row([txt("Wobbly mode:", 12), 
        tog(11, 11, false, () => {settings.wobblyMode = true}, () => {settings.wobblyMode = false; timeScale = 1}, undefined, "Make the game wobbly. Overrides time scale setting."),]),
      row([txt("Wobble speed:", 12), 
        sld(0.5, 3, 120, (to) => {settings.wobbleFrequency = to}, () => {return settings.wobbleFrequency}, 0),
        pdd(3, 0),
        btn("Default", null, 12, () => {settings.wobbleFrequency = 1}, "Reset wobble speed to its default value (1)."),]),
      row([txt("Square mode:", 12), 
        tog(11, 11, false, () => {settings.squareMode = true}, () => {settings.squareMode = false}, undefined, "Make everything into a square. Some hitboxes may stay circular."),]),
      row([txt("Mirror map:", 12), 
        tog(11, 11, false, () => {settings.mirrorMap = true}, () => {settings.mirrorMap = false}, undefined, "Make the minimap accurately render the entire area."),]),
      row([txt("Agar mode:", 12), 
        tog(11, 11, false, () => {settings.agarMode = true}, () => {settings.agarMode = false}, undefined, "Become larger whenever you collect a pellet."),]),
      row([txt("Freaky mode:", 12), 
        tog(11, 11, false, () => {}, () => {}, undefined, "Make the game freaky."),]),
    txt("Credits", 20), bigLine(),
        btn("Show credits", null, 12, () => {queueCheatMenuChange(getCreditsMenu())}, "View the credits."),
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
  mouseScroll = 0;
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



function getPlayerlessCheatMenuItems(){
  list = [
    txt("Oh no!", 20),
    txt("It appears that you have no body. Wanna fix that?", 12),
    btn("Click here to fix that.", 78, 12, () => {
      game.addPlayer(new Magmax(176 + random(-64,64), 240 + random(-96,96), gameConsts.defaultPlayerSize, "Player 1", true, game, startingRegionId, startingAreaNum, [new WASDset(), new ArrowSet(), new MouseSet()]));
      game.cycleMainPlayer();
      queueCheatMenuChange(baseCheatMenuItems);
    }, "Fix that."),
    txt("", 3000),
    btn("Relax, I'll handle it.", null, 12, () => {
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