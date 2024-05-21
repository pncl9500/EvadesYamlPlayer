let minEntityMinimapRadius = 26;

function initUI(){
  return new UI;
}
class UI{
  constructor(){
    this.heroCard = new HeroCard();
    this.miniMap = new MiniMap();
    this.areaHeader = new AreaHeader();
    this.timer = new Timer();
    this.alertBox = new AlertBox();
    this.uiPanels = [];
    this.uiPanels.push(this.heroCard);
    this.uiPanels.push(this.miniMap);
    this.uiPanels.push(this.areaHeader);
    this.uiPanels.push(this.timer);
    this.uiPanels.push(this.alertBox);
  }
  draw(){
    for (var i in this.uiPanels){
      push();
      this.uiPanels[i].transform();
      if (!this.uiPanels[i].hidden){
        this.uiPanels[i].draw();
      }
      pop();
    }
  }
}

class UIpanel{
  constructor(xside, yside){
    this.xside = xside;
    this.yside = yside;
    this.hidden = false;
    this.padding = 10;
  }
  draw(){
    
  }
  transform(){
    translate(cameraFocusX, cameraFocusY);
    translate(gsUnitWidth * this.xside / 2, gsUnitHeight * this.yside / 2);
    translate(this.padding * -this.xside, this.padding * -this.yside)
  }
}

class Chat extends UIpanel{
  constructor(){
    super(-1 ,-1);
  }
  draw(){
    noStroke();
    fill(0, 152);
    rect(0, 0, 300, 175);
  }
}

class HeroCard extends UIpanel{
  constructor(){
    super(0, 1);
    this.width = 512;
    this.height = 84;
    this.padding = 0;
    this.xpBarHeight = 16;
    this.lineDistance = 104;
  }
  draw(){
    let hasThird = !(game.mainPlayer.ability3.constructor.name === "Ability");
    let extraWidth = hasThird ? 74: 0;
    //this sucks and has a lot of magic numbers. fun
    //background
    noStroke();
    fill(0, 200);
    rect(-this.width / 2, -this.height, this.width + extraWidth, this.height);
    //bar
    fill(game.mainPlayer.color.r, game.mainPlayer.color.g, game.mainPlayer.color.b, 110);
    rect(-this.width / 2, -this.height - this.xpBarHeight, this.width + extraWidth, this.xpBarHeight);
    //filled bar 
    fill(game.mainPlayer.color.r, game.mainPlayer.color.g, game.mainPlayer.color.b, 255);
    rect(-this.width / 2, -this.height - this.xpBarHeight, (this.width + extraWidth) * (game.mainPlayer.levelProgress / game.mainPlayer.levelProgressNeeded), this.xpBarHeight);
    //line
    fill(125);
    rect(-this.width / 2 + this.lineDistance - 1, -this.height, 2, this.height);
    //player circle representation thing
    fill(game.mainPlayer.color.r, game.mainPlayer.color.g, game.mainPlayer.color.b);
    ellipse(-this.width / 2 + this.lineDistance / 2 + 2, -this.height + this.height / 2 + 9, 22);
    //hero name text
    textSize(18);
    textAlign(CENTER);
    text(game.mainPlayer.heroName, -this.width / 2 + this.lineDistance / 2 + 2, -this.height + this.height / 2 - 22);
    //level number text
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(game.mainPlayer.level, -this.width / 2 + this.lineDistance / 2 + 2, -this.height + this.height / 2 + 11);
    //points text
    textSize(12);
    if (game.mainPlayer.upgradePoints > 0){
      text("Points:", -this.width / 2 + this.lineDistance + 30, -this.height + 12);
    }
    fill(208, 208, 68);
    for (var i = 0; i < ((game.mainPlayer.upgradePoints > 8) ? 1 : game.mainPlayer.upgradePoints); i++){
      ellipse(-this.width / 2 + this.lineDistance + 58 + i*16, -this.height + 11.7, 5.5)
    }
    if (game.mainPlayer.upgradePoints > 8){
      fill(0);
      textSize(8);
      text(game.mainPlayer.upgradePoints, -this.width / 2 + this.lineDistance + 55.5, -this.height + 12.5, 5.5)
    }
    rectMode(CENTER);
    this.drawStatUpgraderText(-this.width / 2 + this.lineDistance + 40, -this.height + 37, round(game.mainPlayer.speed * 10) / 10, "Speed", "1", true, game.mainPlayer.speed < gameConsts.maxSpeed)
    this.drawStatUpgraderText(-this.width / 2 + this.lineDistance + 40 + 80, -this.height + 37, `${round(game.mainPlayer.energy)} / ${game.mainPlayer.maxEnergy}`, "Energy", "2", true, game.mainPlayer.maxEnergy < gameConsts.maxEnergy)
    this.drawStatUpgraderText(-this.width / 2 + this.lineDistance + 40 + 160, -this.height + 37, round(game.mainPlayer.regen * 10) / 10, "Regen", "3", true, game.mainPlayer.regen < gameConsts.maxRegen)
    this.drawStatUpgraderButton(-this.width / 2 + this.lineDistance + 40 + 240, -this.height + 37, "4", game.mainPlayer.ability1.tier < game.mainPlayer.ability1.maxTier);
    this.drawStatUpgraderButton(-this.width / 2 + this.lineDistance + 40 + 320, -this.height + 37, "5", game.mainPlayer.ability2.tier < game.mainPlayer.ability2.maxTier);
    hasThird && this.drawStatUpgraderButton(-this.width / 2 + this.lineDistance + 40 + 400, -this.height + 37, "6", game.mainPlayer.ability3.tier < game.mainPlayer.ability3.maxTier);
    if (game.mainPlayer.upgradePoints < 1){
      this.drawAbilityUpgradeText(-this.width / 2 + this.lineDistance + 40 + 240, -this.height + 37, "Locked", "[Z] or [J]", game.mainPlayer.ability1.tier === 0);
      this.drawAbilityUpgradeText(-this.width / 2 + this.lineDistance + 40 + 320, -this.height + 37, "Locked", "[X] or [K]", game.mainPlayer.ability2.tier === 0);
      hasThird && this.drawAbilityUpgradeText(-this.width / 2 + this.lineDistance + 40 + 400, -this.height + 37, "Locked", "[C] or [L]", game.mainPlayer.ability3.tier === 0);
    }
    drawImage(game.mainPlayer.ability1.image, -this.width / 2 + this.lineDistance + 40 + 240, -this.height + 37 + 1, 21);
    drawImage(game.mainPlayer.ability2.image, -this.width / 2 + this.lineDistance + 40 + 320, -this.height + 37 + 1, 21);
    hasThird && drawImage(game.mainPlayer.ability3.image, -this.width / 2 + this.lineDistance + 40 + 400, -this.height + 37 + 1, 21);
    //how do we draw the spinny cd mask
    (game.mainPlayer.ability1.currentCooldown > 0 && !game.mainPlayer.abilitiesDisabled && this.drawCooldownMask(game.mainPlayer.ability1.currentCooldown, game.mainPlayer.ability1.cooldownOfPreviousUse, -this.width / 2 + this.lineDistance + 40 + 240 - 21, -this.height + 37 - 21 + 1, 42, 42));
    (game.mainPlayer.ability2.currentCooldown > 0 && !game.mainPlayer.abilitiesDisabled && this.drawCooldownMask(game.mainPlayer.ability2.currentCooldown, game.mainPlayer.ability2.cooldownOfPreviousUse, -this.width / 2 + this.lineDistance + 40 + 320 - 21, -this.height + 37 - 21 + 1, 42, 42));
    hasThird && ((game.mainPlayer.ability3.currentCooldown > 0 && !game.mainPlayer.abilitiesDisabled && this.drawCooldownMask(game.mainPlayer.ability3.currentCooldown, game.mainPlayer.ability3.cooldownOfPreviousUse, -this.width / 2 + this.lineDistance + 40 + 400 - 21, -this.height + 37 - 21 + 1, 42, 42)));
    if (game.mainPlayer.abilitiesDisabled){
      this.drawCooldownMask(1, 1, -this.width / 2 + this.lineDistance + 40 + 240 - 21, -this.height + 37 - 21 + 1, 42, 42);
      this.drawCooldownMask(1, 1, -this.width / 2 + this.lineDistance + 40 + 320 - 21, -this.height + 37 - 21 + 1, 42, 42);
      hasThird && this.drawCooldownMask(1, 1, -this.width / 2 + this.lineDistance + 40 + 400 - 21, -this.height + 37 - 21 + 1, 42, 42);
    }
    if (game.mainPlayer.ability1.tier === 0){
      fill(0, 110);
      rect(-this.width / 2 + this.lineDistance + 40 + 240, -this.height + 37 + 1, 42, 42);
    }
    if (game.mainPlayer.ability2.tier === 0){
      fill(0, 110);
      rect(-this.width / 2 + this.lineDistance + 40 + 320, -this.height + 37 + 1, 42, 42);
    }
    if (hasThird && game.mainPlayer.ability3.tier === 0){
      fill(0, 110);
      rect(-this.width / 2 + this.lineDistance + 40 + 400, -this.height + 37 + 1, 42, 42);
    }
    strokeWeight(1);
    for (var i = 0; i < game.mainPlayer.ability1.maxTier; i++){
      noFill();
      stroke(125);
      if (game.mainPlayer.ability1.tier > i){
        fill(208, 208, 68);
        stroke(208, 208, 68);
      }
      ellipse(-this.width / 2 + this.lineDistance + 40 + 240 - 5 * (game.mainPlayer.ability1.maxTier - 1) + i * 10, -this.height + 37 - 28, 3);
    }
    for (var i = 0; i < game.mainPlayer.ability2.maxTier; i++){
      noFill();
      stroke(125);
      if (game.mainPlayer.ability2.tier > i){
        fill(208, 208, 68);
        stroke(208, 208, 68);
      }
      ellipse(-this.width / 2 + this.lineDistance + 40 + 320 - 5 * (game.mainPlayer.ability2.maxTier - 1) + i * 10, -this.height + 37 - 28, 3);
    }
    if (hasThird){
      for (var i = 0; i < game.mainPlayer.ability3.maxTier; i++){
        noFill();
        stroke(125);
        if (game.mainPlayer.ability3.tier > i){
          fill(208, 208, 68);
          stroke(208, 208, 68);
        }
        ellipse(-this.width / 2 + this.lineDistance + 40 + 400 - 5 * (game.mainPlayer.ability3.maxTier - 1) + i * 10, -this.height + 37 - 28, 3);
      }
    }
    rectMode(CORNER);
  }
  drawStatUpgraderText(x, y, txt1, txt2, num, drawUpgradeNumber, highlightUpgradeNumber){
    fill(255);
    textSize(24);
    text(txt1, x, y);
    textSize(9);
    text(txt2, x, y + 20);
    if (!drawUpgradeNumber){
      return;
    }
    this.drawStatUpgraderButton(x, y, num, highlightUpgradeNumber);
  }
  drawAbilityUpgradeText(x, y, lockedText, keyText, lockedCondition){
    textSize(11);
    fill(255);
    text(lockedCondition ? lockedText : keyText, x, y + 35);
  }
  drawStatUpgraderButton(x, y, num, highlightUpgradeNumber){
    if (game.mainPlayer.upgradePoints < 1){
      return;
    }
    fill(208, 208, 68);
    if (!highlightUpgradeNumber){
      fill(80, 80, 20);
    }
    rect(x, y + 36, 12, 12)
    textSize(11);
    fill(0);
    text(num, x, y + 37);
  }
  drawCooldownMask(ccd, mcd, l, u, w, h){
    let r = l + w;
    let d = u + h;
    let cx = (l + r) / 2
    let cy = (u + d) / 2
    let rat = ccd / mcd;

    fill(0, 150);
    noStroke();

    beginShape(TESS);
    vertex(cx, cy);
    vertex(cx, u);
    if (rat > 1/8){
      vertex(l, u);
    }
    if (rat > 3/8){
      vertex(l, d);
    }
    if (rat > 5/8){
      vertex(r, d);
    }
    if (rat > 7/8){
      vertex(r, u);
    }
    let length = (r - cx);
    let angle = -PI/2 + (1 - rat) * 2*PI;
    let fvpx = cx + length * sqcos(angle);
    let fvpy = cy + length * sqsin(angle);
    vertex(fvpx, fvpy);
    endShape(CLOSE);
  }
}

class MiniMap extends UIpanel{
  constructor(){
    super(-1, 1);
    this.maxWidth = 370;
    this.maxHeight = 100;
    this.padding = 0;

    //dont change these
    this.storedRatio = 1;
    this.markerScale = 0.12;
  }
  draw(){
    noStroke();
    const areaWidth = game.mainPlayer.area.bounds.right;
    const areaHeight = game.mainPlayer.area.bounds.bottom;
    let longestSide = areaWidth >= areaHeight ? "horiz" : "vert";
    let scaledWidth;
    let scaledHeight;
    (longestSide === "horiz") && (scaledWidth = this.maxWidth) && (scaledHeight = this.maxWidth / areaWidth * areaHeight);
    (longestSide === "vert") && (scaledHeight = this.maxHeight) && (scaledWidth = this.maxHeight / areaHeight * areaWidth);
    (scaledHeight > this.maxHeight) && (longestSide = "vert") && (scaledHeight = this.maxHeight) && (scaledWidth *= (this.maxHeight / scaledHeight));
    let ratio = longestSide === "horiz" ? this.maxWidth / areaWidth : this.maxHeight / areaHeight;
    this.storedRatio = ratio;
    push();
    translate(0, -scaledHeight);
    scale(ratio);
    //if region background was on and mirror map was also on, drawing the map would make a new ambient background layer, which we don't want
    //so temporarily turn regionBackground off and then turn it back on after drawing
    let regionBgOn = settings.regionBackground;
    settings.regionBackground = false;
    settings.mirrorMap ? game.mainPlayer.area.draw(game.mainPlayer.region) : game.mainPlayer.area.drawOnMap(game.mainPlayer.region);
    settings.regionBackground = regionBgOn;
    pop();
  }
}

class AreaHeader extends UIpanel{
  constructor(){
    super(0 ,-1);
  }
  draw(){
    noStroke();
    textFont(fnt.tahomaBold);
    textAlign(CENTER, TOP);
    fill(244, 250, 255);
    let c = {r: 66, g: 90, b: 109};
    if (game.mainPlayer.region.properties !== undefined && game.mainPlayer.region.properties.hasOwnProperty("background_color")){
      var colset = game.mainPlayer.region.properties.background_color;
      c = {r: colset[0], g: colset[1], b: colset[2]};
      c.r /= 1.5;
      c.g /= 1.5;
      c.b /= 1.5;
    }
    if (game.mainPlayer.area.properties !== undefined && game.mainPlayer.area.properties.hasOwnProperty("background_color")){
      var colset = game.mainPlayer.area.properties.background_color;
      c = {r: colset[0], g: colset[1], b: colset[2]};
      c.r /= 1.5;
      c.g /= 1.5;
      c.b /= 1.5;
    }
    stroke(c.r, c.g, c.b);
    strokeWeight(5);
    textSize(35);
    let regionName = game.mainPlayer.region.name;
    let areaName = "Area " + (game.mainPlayer.areaNum + 1);
    if (game.mainPlayer.area.isVictory){
      areaName = "Victory!";
    }
    if (game.mainPlayer.areaNum % 10 === 9 && !bosslessRegions.includes(game.mainPlayer.region.name)){
      areaName = "BOSS AREA " + (game.mainPlayer.areaNum + 1);
    }
    let overridingName = game.mainPlayer.area.name;
    if (game.mainPlayer.area.name !== undefined){
      if (!isNaN(parseInt(overridingName))){
        overridingName = "Area " + overridingName;
      }
    }
    let finalAreaName = overridingName ?? areaName;
    if (arealessRegions.includes(game.mainPlayer.region.name)){
      text(regionName, 0, -8);
    } else {
      text(regionName + ": " + finalAreaName, 0, -8);
    }
  }
}

//regions for which areas are not marked as boss areas.
let bosslessRegions = [
  "Peculiar Pyramid",
  "Peculiar Pyramid Hard",
  "Haunted Halls",
  "Ominous Occult",
  "Ominous Occult Hard",
  "Toxic Territory",
  "Toxic Territory Hard",
  "Magnetic Monopole",
  "Magnetic Monopole Hard",
  "Burning Bunker",
  "Burning Bunker Hard",
  "Assorted Alcove",
  "Assorted Alcove Hard",
  "Restless Ridge Hard",
  "Grand Garden",
  "Grand Garden Hard",
  "Mysterious Mansion",
  "Coupled Corridors",
  "Cyber Castle",
  "Cyber Castle Hard",
  "Shifting Sands",
  "Infinite Inferno",
  "Dusty Depths",
]

let arealessRegions = [
  "Research Lab",
  "Stellar Square"
]

class Timer extends UIpanel{
  constructor(){
    super(0 , -1);
    this.hidden = true;
  }
  draw(){
    noStroke();
    textFont(fnt.tahomaBold);
    textAlign(CENTER, TOP);
    fill(244, 250, 255);
    let c = {r: 66, g: 90, b: 109};
    if (game.mainPlayer.region.properties !== undefined && game.mainPlayer.region.properties.hasOwnProperty("background_color")){
      var colset = game.mainPlayer.region.properties.background_color;
      c = {r: colset[0], g: colset[1], b: colset[2]};
      c.r /= 1.5;
      c.g /= 1.5;
      c.b /= 1.5;
    }
    if (game.mainPlayer.area.properties !== undefined && game.mainPlayer.area.properties.hasOwnProperty("background_color")){
      var colset = game.mainPlayer.area.properties.background_color;
      c = {r: colset[0], g: colset[1], b: colset[2]};
      c.r /= 1.5;
      c.g /= 1.5;
      c.b /= 1.5;
    }
    stroke(c.r, c.g, c.b);
    strokeWeight(5);
    textSize(35);

    let minutes = floor((gameClock / 1000) / 60);
    let seconds = floor((gameClock / 1000) % 60);
    text(minutes + "m " + seconds + "s", 0, -8 + 42);
  }
}

class AlertBox extends UIpanel{
  constructor(){
    super(1, 1);
    this.hidden = true;
    this.padding = 0;
    this.width = 310;
    this.height = 157;
    this.alerts = [

    ];
    this.maxAlerts = 13;
    this.textSize = 11.8;
    this.stayingDuration = 4000;
    this.timeUntilVanish = this.stayingDuration;
    this.alpha = 255;
    this.fadeSpeed = 1.5;
  }
  draw(){
    noStroke();
    fill(0, this.alpha * 0.5);
    rect(-this.width, -this.height, this.width, this.height)
    this.drawAlerts();
    this.timeUntilVanish -= deltaTime; //deltaTime instead of dTime is intentional here
    if (this.timeUntilVanish < 0){
      this.alpha -= this.fadeSpeed * deltaTime * (1/16);
      if (this.alpha < 0){
        this.hidden = true;
      }
    }
  }
  drawAlerts(){
    textSize(this.textSize);
    fill(255, this.alpha);
    textAlign(LEFT, TOP);
    for (let i = 0; i < min(this.alerts.length, this.maxAlerts); i++){
      text(this.alerts[i + (max(this.alerts.length - this.maxAlerts, 0))], -this.width + 2, -this.height + i * 12 + 2);
    }
  }
  setAlertsForRegion(region){
    //if region is clean, stop here
    this.alerts = [];
    region.areas[0].scanForUnknownEnemyTypes();
    if (region.unknownEnemyTypes.length === 0 && !outdatedMapNames.includes(region.name) && !unimplementedGimmickMapNames.includes(region.name)) {this.hidden = true; return;}
    this.alpha = 255;
    this.hidden = false;
    if (region.unknownEnemyTypes.length > 10){
      this.alerts.push(region.unknownEnemyTypes.length + " missing enemies in " + region.name);
      this.alerts.push("(too many to list)");
    } else {
      for (let i = 0; i < region.unknownEnemyTypes.length; i++){
        this.alerts.push("Missing enemy in " + region.name + ": " + region.unknownEnemyTypes[i]);
      }
    }
    if (outdatedMapNames.includes(region.name)){ this.alerts.push("Outdated map file: " + region.name); }
    if (infiniteMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": infinite map"); }
    if (wallMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": walls"); }
    if (lightingMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": flashlight/lantern"); }
    if (requirementMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": blocked teleports"); }
    if (allImmuneMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": all enemies immune"); }
    if (stellarSquareMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": is stellar square"); }
    if (levelRemovalMaps.includes(region.name)){ this.alerts.push("Missing mechanic in " + region.name + ": level removal"); }

    this.timeUntilVanish = this.stayingDuration;
  }
}

