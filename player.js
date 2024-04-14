deathTimerDurations = [
  10000,
  15000,
  15000,
  20000,
  20000,
  20000,
  25000,
  25000,
  30000,
  30000,
  60000,
]

class Player extends Entity{
  constructor(x, y, radius, color, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, color, 1, "noOutline")
    this.heroName = "Basic";

    this.ability3 = new Ability();
    this.mainType = "player";
    this.isMain = isMain;
    this.game = game;
    this.regionNum = regionNum;
    this.region = game.regions[regionNum];
    this.areaNum = areaNum;
    this.area = this.region.areas[areaNum];
    this.area.enter(this);
    this.area.attemptLoad(true);
    this.name = name;
    this.speed = gameConsts.startingSpeed;
    this.tempSpeed = this.speed;
    this.regen = gameConsts.startingRegen;
    this.tempRegen = this.regen;
    this.maxEnergy = gameConsts.startingEnergy;
    this.tempMaxEnergy = this.maxEnergy;
    this.energy = this.maxEnergy;
    this.minEnergy = 0;
    this.tempMinEnergy = this.minEnergy;
    this.level = 1;
    this.levelProgress = 0;
    this.levelProgressNeeded = 4;
    this.upgradePoints = 0;
    this.restricted = true;
    this.ctrlSets = ctrlSets;
    this.ctrlVector = {x: 0, y: 0};
    this.effects = [];
    this.onTpZoneLastFrame = false;
    this.shifting = false;
    this.deathEffect = null;
    this.dead = false;
    this.resetAllModifiers();
    this.saves = 0;
    this.timesSaved = 0;
    this.lastDir = 0;
    this.doCheatRevive = false;
    
    this.auras = [];

    this.statEpsilon = 0.01;
  }
  addXp(xp){
    //levelup
    this.levelProgress += xp;
    while (this.levelProgress >= this.levelProgressNeeded){
      this.level++;
      this.upgradePoints++;
      this.levelProgress -= this.levelProgressNeeded;
      this.levelProgressNeeded = this.getRequiredEXP(this.level);
    }
  }
  //what is even happening here
  getRequiredEXP(e){
    var t=[0,0,0,1,2,2,4,5,6,8,10,12,15,16,20,23,25,29,32,37],
    i=(e)=>{return e*(e+1)/2},
    a=e-100,
    s=Math.floor;
    if(e<1)return;
    if(e<=100)return e*4;
    return 400+80*(i(3+s(a/20))-6)+(14*((a%20)))+t[a%20]+4*s(a/20)*(e%20)
  }
  addAura(aura){
    this.auras.push(aura);
  }
  upgradeSpeed(){
    if (this.upgradePoints > 0 && this.speed < gameConsts.maxSpeed){
      this.speed += gameConsts.speedIncrement;
      this.speed = min(this.speed, gameConsts.maxSpeed);
      this.upgradePoints--;
    }
  }
  upgradeEnergy(){
    if (this.upgradePoints > 0 && this.energy < gameConsts.maxEnergy){
      this.maxEnergy += gameConsts.energyIncrement;
      this.maxEnergy = min(this.maxEnergy, gameConsts.maxEnergy);
      this.upgradePoints--;
    }
  }
  upgradeRegen(){
    if (this.upgradePoints > 0 && this.regen < gameConsts.maxRegen){
      this.regen += gameConsts.regenIncrement;
      this.regen = min(this.regen, gameConsts.maxRegen);
      this.upgradePoints--;
    }
  }
  resetAllModifiers(){
    this.tempSpeed = this.speed;
    this.speedMultiplier = 1;
    this.xSpeedMultiplier = 1;
    this.ySpeedMultiplier = 1;
    this.alphaMultiplier = 1;
    this.energyBarColor = {r: settings.energyBarColor[0], g: settings.energyBarColor[1], b: settings.energyBarColor[2], a: settings.energyBarColor[3]};

    this.invincibility = false;
    this.corrosiveBypass = false;
    this.effectVulnerability = 1;
    this.fullEffectImmunity = false;

    this.tempMinEnergy = this.minEnergy;
    this.tempMaxEnergy = this.maxEnergy;
    this.tempRegen = this.regen;

    this.abilitiesDisabled = false;

    this.deathTimerMultiplier = 1;
    this.deathTimerColor = {
      r: 255,
      g: 0,
      b: 0,
      a: 255,
    }

    this.canRevivePlayers = true;
  }
  //design this with the idea that it will be completely overriden in cent's code (if i do a single className === "Cent" i will never forgive myself)
  update(){
    if (keyIsDown(32)){
      this.speed += 0.2;
    }
    this.resetAllModifiers();

    this.setAbilityUsages();

    if (this.doCheatRevive){
      this.revive();
      this.doCheatRevive = false;
    }
    this.applyEffects();

    this.regenEnergy();


    //final pass
    this.ctrlVector = this.getControls();
    if (!(this.ctrlVector.x === 0 && this.ctrlVector.y === 0)){
      this.lastDir = Math.atan2(this.ctrlVector.y, this.ctrlVector.x);
    }
    this.speedMultiplier *= this.shifting ? 0.5 : 1;
    this.xv = this.ctrlVector.x * this.tempSpeed * tFix * this.speedMultiplier * this.xSpeedMultiplier;
    this.yv = this.ctrlVector.y * this.tempSpeed * tFix * this.speedMultiplier * this.ySpeedMultiplier;
    this.x += this.xv;
    this.y += this.yv;
    this.area.restrict(this);
    this.updateAuras();

    this.updateAbilities();

    this.zonesTouched = this.getZonesTouched();

    this.handleZonesTouched();
  }
  regenEnergy(){
    if (this.energy < this.tempMaxEnergy){
      this.energy += this.tempRegen * tFix * (1/30);
      this.energy = min(this.energy, this.tempMaxEnergy)
    }
  }
  setAbilityUsages(){
    for (var i in this.ctrlSets){
      this.ctrlSets[i].getAbKeyStates();
      if (this.ctrlSets[i].ab1KeyTapped){
        this.ability1.attemptUse(this);
      }
      if (this.ctrlSets[i].ab2KeyTapped){
        this.ability2.attemptUse(this);
      }
      if (this.ctrlSets[i].ab3KeyTapped){
        this.ability3.attemptUse(this);
      }
    }
  }
  getControls(){
    this.shifting = false;
    if (keyIsDown(16)){
      this.shifting = true;
    }
    var ctrlVector = {x: 0, y: 0};
    for (var i in this.ctrlSets){
      if (!this.ctrlSets[i].active){
        continue;
      }
      var testCv = this.ctrlSets[i].getCtrlVector();
      if (testCv.x !== null){
        ctrlVector.x = testCv.x;
      }
      if (testCv.y !== null){
        ctrlVector.y = testCv.y;
      }
    }
    return ctrlVector;
  }
  updateAbilities(){
    this.ability1.update(this);
    this.ability2.update(this);
    this.ability3.update(this);
  }
  checkPlayerCollision(area, players){
    for(let i in players){
      if (this !== players[i] && circleCircle(players[i], this)){
        this.playerCollision(players[i]);
      }
    }
  }
  playerCollision(player){
    if (this.canRevivePlayers && player.dead && !this.dead){
      player.revive();
      player.timesSaved++;
      this.saves++;
    }
  }
  revive(){
    if (!this.dead) {return};
    this.deathEffect.toRemove = true;
    this.deathEffect = null;
    this.dead = false;
  }
  die(){
    if (this.dead){
      return;
    }
    this.ability1.tryToggleOffThroughDeath(this);
    this.ability2.tryToggleOffThroughDeath(this);
    this.ability3.tryToggleOffThroughDeath(this);
    this.dead = true;
    let deathTime = (this.region.properties.death_timer ?? deathTimerDurations[Math.min(deathTimerDurations.length - 1, this.areaNum)])
    this.deathTimer = deathTime * this.deathTimerMultiplier;
    this.deathEffect = new DeadEffect(this.deathTimer);
    this.gainEffect(this.deathEffect);
  }
  resetToSpawn(){
    this.x = 176 + random(-64,64);
    this.y = 240 + random(-96,96);
    for (var i in this.game.regions){
      if (this.game.regions[i].name === startingRegionName){
        this.regionNum === i;
        this.region = this.game.regions[i];
      }
    }
    this.area.exit(this);
    this.area.attemptUnload(this);
    this.areaNum = startingAreaNum;
    this.area = this.region.areas[this.areaNum];
    this.area.enter(this);
    this.area.attemptLoad(true);
  }
  drawDeathTimer(time){
    fill(this.deathTimerColor.r, this.deathTimerColor.g, this.deathTimerColor.b, this.deathTimerColor.a);
    noStroke();
    textSize(18);
    textAlign(CENTER);
    text(round(time / 1000), this.x, this.y + 6);
  }
  drawBackExtra(){
    this.drawAuras();
    this.drawName();
    this.drawBar();
    if (this.deathEffect !== null){
      this.drawDeathTimer(this.deathEffect.life);
    }
  }
  updateAuras(){
    for (var i = 0; i < this.auras.length; i++){
      if (this.auras[i].toRemove){
        this.auras[i].toRemove = false;
        this.auras.splice(i, 1);
        i--;
        continue;
      }
      this.auras[i].update();
    }
  }
  drawAuras(){
    for (var i = 0; i < this.auras.length; i++){
      this.auras[i].draw();
    }
  }
  enemyCollision(){
    this.die();
  }
  drawBar(){
    let ebw = settings.energyBarWidth;
    let rCenter = this.x;

    noFill();
    stroke(this.energyBarColor.r, this.energyBarColor.g, this.energyBarColor.b, this.energyBarColor.a);
    strokeWeight(settings.energyBarOutlineWidth);

    rect(rCenter - ebw / 2, this.y - this.radius - 8, ebw, settings.energyBarHeight);

    let filledBarWidth = ebw * constrain(this.energy / this.maxEnergy, 0, 1);

    noStroke();
    fill(this.energyBarColor.r, this.energyBarColor.g, this.energyBarColor.b, this.energyBarColor.a);
    rect(rCenter - ebw / 2, this.y - this.radius - 8, filledBarWidth, settings.energyBarHeight);
  }
  drawName(){
    textAlign(CENTER);
    fill(0);
    textSize(12);
    text(this.name, this.x, this.y - this.radius - 12);
  }
  getZonesTouched(){
    var zt = [];
    for (var i in this.area.zones){
      if (circleRect({x: this.x, y: this.y, radius: this.getRadius()}, this.area.zones[i])){
        zt.push(this.area.zones[i]);
      }
    }
    return zt;
  }
  handleZonesTouched(){
    var onTpZoneThisFrame = false;
    for (var z in this.zonesTouched){
      const zone = this.zonesTouched[z];
      if (zone.properties.hasOwnProperty("minimum_speed")){
        this.gainEffect(new MinimumSpeedZoneEffect(zone.properties.minimum_speed), false);
      }
      switch (zone.type) {
        case "removal":
          this.resetToSpawn();
        case "exit":
        case "teleport":
          if (!this.onTpZoneLastFrame){
            if (zone.type === "exit"){
              this.doExitTranslate(zone); 
            }
            if (zone.type === "teleport"){
              this.doTeleportTranslate(this.area.zones.indexOf(zone)); 
            }
          }
          onTpZoneThisFrame = true;
          this.onTpZoneLastFrame = true;
          break;
        case "safe":
          //check again if the player is completely 100% inside the safe zone, and then apply safe zone effect
          if (circleRect({x: this.x, y: this.y, radius: this.getRadius()}, {x: zone.x + this.getRadius() * 2, y: zone.y + this.getRadius() * 2, width: zone.width - this.getRadius() * 4, height: zone.height - this.getRadius() * 4})){
            this.gainEffect(new SafeZoneEffect(), false);
          }
        default:
          break;
      }
    }
    if (!onTpZoneThisFrame){
      this.onTpZoneLastFrame = false;
    }
  }
  updateAsMain(){
    cameraFocusX = this.x;
    cameraFocusY = this.y;
  }
  doExitTranslate(exitZone){
    //we are going to check if the translated exitZone (basically the rectangle where
    //players might go) is in another area, and then put the player in that area.
    var foundArea = null;
    var foundAreaNum = null;
    var epsilon = tpZoneEpsilon
    while (foundArea === null && epsilon > -1024){
      var translatedExitZone = {
        x: exitZone.x + this.area.x + exitZone.translate.x + epsilon,
        y: exitZone.y + this.area.y + exitZone.translate.y + epsilon,
        width: exitZone.width - epsilon * 2,
        height: exitZone.height - epsilon * 2,
      }
      //for (var a in this.region.areas){
      //going backwards will prioritize earlier areas, which DOES ACTUALLY MATTER at least in cc2h
      //since one teleport zone is meant to go into security gate B, but it overlaps with
      //network connector
      //also in rr40 i think
      for (var a = this.region.areas.length - 1; a >= 0; a--){
        if (a === this.areaNum){
          //this doesnt even work
          continue;
        }
        var area = this.region.areas[a];
        var areaZone = {
          x: area.x,
          y: area.y,
          width: area.bounds.right - area.bounds.left,
          height: area.bounds.bottom - area.bounds.top,
        }
        var areaHasBeenFound = rectRect(translatedExitZone, areaZone);
        if (areaHasBeenFound){
          foundArea = this.region.areas[a];
          foundAreaNum = a;
        }
      }
      epsilon -= 8;
    }
    if ((epsilon !== tpZoneEpsilon - 8) && !(epsilon <= -1024)){
      console.warn("Exit translation did not immediately find valid area. This is normal when user enters some rr teleports, but behavior may be inaccurate.")
    }
    if (epsilon <= -1024){
      console.warn("Exit translation could not find valid area. Search cut to prevent infinite loop. This is not normal and something has gone very wrong.")
    }
    if (foundArea !== null){
      this.area.exit(this);
      this.area.attemptUnload(this);
      this.x += exitZone.translate.x;
      this.y += exitZone.translate.y;
      this.x -= foundArea.x - this.area.x;
      this.y -= foundArea.y - this.area.y;
      this.areaNum = foundAreaNum;
      this.area = foundArea;
      this.area.enter(this);
      this.area.attemptLoad(false);
    }
  }
  goToRegionFromId(id){
    this.regionNum = id;
    this.region = this.game.regions[id];
  }
  goToAreaFromId(id){
    this.areaNum = id;
    this.area = this.region.areas[id];
  }
  doTeleportTranslate(zoneId){
    //we are actually going to override evades convention here because it is very bad!
    const regionName = this.region.name;
    const areaId = this.areaNum;
    const areaSet = "area_" + areaId;
    const zoneSet = "zone_" + zoneId;
    if (regionTeleports[regionName] === undefined){
      //no region teleport assigned, abort
      console.warn("No region teleport found.");
      return;
    }
    if (!regionTeleports[regionName].hasOwnProperty(areaSet)){
      console.warn("Teleport zone does not have a known area.");
      return;
    }
    if (!regionTeleports[regionName][areaSet].hasOwnProperty(zoneSet)){
      console.warn("Teleport zone is not assigned.");
      return;
    }
    const rtSet = regionTeleports[regionName][areaSet][zoneSet];

    //warp to bbh if it doesnt work
    const dest = rtSet.dest ?? "Burning Bunker Hard";
    const areaDest = rtSet.area ?? 0;
    const x = rtSet.x ?? null;
    const y = rtSet.y ?? null;
    for (var i in this.game.regions){
      if (this.game.regions[i].name === dest){
        //found region
        this.area.exit(this);
        this.area.attemptUnload(this);
        this.goToRegionFromId(i);
        this.goToAreaFromId(areaDest);
        this.area.enter(this);
        this.area.attemptLoad(true);
        if (x !== null){
          this.x = x;
          this.x += (this.x < 0) ? this.area.bounds.right : this.area.bounds.left;
        }
        if (y !== null){
          this.y = y;
          this.y += (this.y < 0) ? this.area.bounds.bottom : this.area.bounds.top;
        }
        return;
      }
    }
  }
}
//this is actually helpful somehow
tpZoneEpsilon = 8;