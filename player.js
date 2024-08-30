minPlayerMinimapRadius = 32;

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
  constructor(x, y, radius, color, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea = true){
    super(x, y, radius, color, isMain ? z.mainPlayer : z.player, "noOutline")
    this.heroName = "Basic";

    this.baseRadius = radius;
    this.tempRadius = this.baseRadius;
    this.ability3 = new Ability();
    this.mainType = "player";
    this.isMain = isMain;
    this.game = game;
    this.regionNum = regionNum;
    this.region = game.regions[regionNum];
    this.areaNum = areaNum;
    this.area = this.region.areas[areaNum];
    this.visitedAreas = [];
    if (putInArea){
      this.area.enter(this);
      this.area.attemptLoad(true);
    }
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
    this.doRevive = false;
    this.mostRecentSafeZone = this.area.zones[1] ?? this.area.zones[0];
    this.mostRecentSafeX = 0;
    this.mostRecentSafeY = 0;
    
    this.auras = [];
    this.prevMovementX = 0;
    this.prevMovementY = 0;
    this.sx = 0;
    this.sy = 0;
    this.defStepParams();

    this.magnetismDirection = 1;

    this.ab1macro = false;
    this.ab2macro = false;
    this.ab3macro = false;

    this.lastDeathX = this.x;
    this.lastDeathY = this.y;
    
  }
  resetAllModifiers(){
    //players have their light changed by other things, so it resets every frame.
    this.light = 60;
    this.detectable = true;
    this.radiusMultiplier = 1;
    this.tempSpeed = this.speed;
    this.tempRadius = this.baseRadius;
    this.speedMultiplier = 1;
    this.magneticSpeedMultiplier = 1;
    this.alphaMultiplier = 1;
    this.energyBarColor = {r: settings.energyBarColor[0], g: settings.energyBarColor[1], b: settings.energyBarColor[2], a: settings.energyBarColor[3]};

    this.invincible = false;
    this.corrosiveBypass = false;
    this.effectVulnerability = 1;
    this.fullEffectImmunity = false;
    this.ignoreBullets = false;

    this.tempMinEnergy = this.minEnergy;
    this.tempMaxEnergy = this.maxEnergy;
    this.tempRegen = this.regen;

    this.abilitiesDisabled = false;
    this.stepMovement = false;

    this.deathTimerMultiplier = 1;
    this.deathTimerColor = {
      r: 255,
      g: 0,
      b: 0,
      a: 255,
    }

    this.canRevivePlayers = true;
    this.cancelContactDeath = false;

    this.magnetism = false;
    if (this.region.properties !== undefined && this.region.properties.hasOwnProperty("magnetism")){
      this.magnetism = this.region.properties.magnetism;
      this.magnetism && this.getMagnet();
    }
    if (this.area.properties !== undefined && this.area.properties.hasOwnProperty("magnetism")){
      this.magnetism = this.area.properties.magnetism;
      this.magnetism && this.getMagnet();
    }
    this.partialMagnetism = false;
    if (this.region.properties !== undefined && this.region.properties.hasOwnProperty("partial_magnetism")){
      this.partialMagnetism = this.region.properties.partial_magnetism;
      this.partialMagnetism && this.getMagnet();
    }
    if (this.area.properties !== undefined && this.area.properties.hasOwnProperty("partial_magnetism")){
      this.partialMagnetism = this.area.properties.partial_magnetism;
      this.partialMagnetism && this.getMagnet();
    }
  }
  applyEffectsBeforeAbilities(){
    for (var i = 0; i < this.effects.length; i++){
      this.effects[i].applyBeforeAbilities(this);
    }
  }
  lavaDie(){
    this.die();
  }
  behavior(){

  }
  //design this with the idea that it will be completely overriden in cent's code (if i do a single className === "Cent" i will never forgive myself)
  update(){
    this.resetAllModifiers();
    this.ctrlVector = this.getControls();
    this.applyEffectsBeforeAbilities();
    this.setAbilityUsages();
    this.cooldownMultiplier = 1;

    this.behavior();
    if (this.doRevive){
      this.revive();
      this.doRevive = false;
    }
    this.applyEffects();
    this.radius = this.tempRadius * this.radiusMultiplier;

    this.regenEnergy();


    if (!(this.ctrlVector.x === 0 && this.ctrlVector.y === 0)){
      this.lastDir = Math.atan2(this.ctrlVector.y, this.ctrlVector.x);
    }

    let dim = (1 - (this.region.properties.friction ?? defaults.regionProps.friction));
    if (this.speedMultiplier === 0){
      dim = 0;
    }

    let magneticSpeed = this.getMagneticSpeed();
    //final pass
    if (this.stepMovement){
      this.moveWithSteps(dim, magneticSpeed);
    } else {
      this.move(dim, magneticSpeed);
    }
    this.restrictedLastFrame = false;
    this.area.restrict(this);
    
    this.updateAbilities();
    
    this.zonesTouched = this.getZonesTouched();
    
    this.handleZonesTouched();
    this.updateAuras();
  }
  defStepParams(){
    this.canStepMove = true;
    this.stepAccelerating = false;
    this.stepMoving = false;
    this.stepAcceleration = 0.333;
    this.stepDeceleration = 0.666;
    this.stepMaxDistance = 10;
    this.stepDistance = 0;
    this.stepCtrlVector = {x: 0, y: 0};
  }
  //do cent movememnt later this is dumb
  //issues with cent movement:
  //harden + cent movement sucks
  //you move 1px in the perpendicular direction after each step
  moveWithSteps(dim, magneticSpeed = 0){
    //cent movement. we can't just override the standard move function for the Cent class because of lead sniper, which
    //requires all players to be capable of cent movement.
    if (this.canStepMove && !(this.ctrlVector.x === 0 && this.ctrlVector.y === 0)){
      //start step movement.
      this.canStepMove = false;
      this.stepAccelerating = true;
      this.stepMoving = true;
      //test?
      this.stepDistance = 0;
      this.stepCtrlVector = {x: this.ctrlVector.x, y: this.ctrlVector.y};
    }
    this.moveDist = (this.speed) * this.speedMultiplier + (this.tempSpeed - this.speed);
    this.stepMaxDistance = this.moveDist * 2;
    //get acceleraty stuff
    if (this.stepAccelerating){
      if (this.stepDistance < this.stepMaxDistance){
        this.stepDistance += this.moveDist * this.stepAcceleration * tFix;
      } else {
        this.stepDistance = this.stepMaxDistance;
        this.stepAccelerating = false;
      }
    } else {
      if (this.stepDistance > 0){
        this.stepDistance -= this.stepDeceleration * this.moveDist * tFix;
      } else {
        this.stepDistance = 0;
        //this.stepAccelerating = true;
        this.stepMoving = false
        this.canStepMove = true;
      }
    }

    let sx = this.prevMovementX;
    let sy = this.prevMovementY;
    this.sx = sx;
    this.sy = sy;
    sx *= 1-((1-dim) * fFix);
    sy *= 1-((1-dim) * fFix);
    //dubious?
    if (this.ctrlVector.x !== 0){
      sx = 0;
    }
    if (this.ctrlVector.y !== 0){
      sy = 0;
    }

    this.speedMultiplier *= this.shifting ? 0.5 : 1;
    this.xv = this.stepCtrlVector.x * tFix * this.moveDist;
    this.yv = this.stepCtrlVector.y * tFix * this.moveDist;
    this.xv += sx;
    this.yv += sy;
    this.x += this.xv;
    this.y += this.yv;
    this.prevMovementX = this.xv;
    this.prevMovementY = this.yv;
  }
  move(dim, magneticSpeed = 0){
    let sx = this.prevMovementX;
    let sy = this.prevMovementY;
    this.sx = sx;
    this.sy = sy;
    if (this.ctrlVector.x !== 0){
      sx = 0;
    }
    if (this.ctrlVector.y !== 0){
      sy = 0;
    }

    sx *= 1-((1-dim)*fFix);
    sy *= 1-((1-dim)*fFix);

    this.speedMultiplier *= this.shifting ? 0.5 : 1;
    this.xv = this.ctrlVector.x * this.tempSpeed * tFix * this.speedMultiplier;
    this.yv = this.ctrlVector.y * this.tempSpeed * tFix * this.speedMultiplier;
    this.xv += sx;
    this.yv += sy;
    if (this.magnetism) {this.yv -= sy; this.yv = magneticSpeed * tFix * ((this.dead && !(this.area.cancelMagnetismOnDownedPlayers)) ? 1 : this.speedMultiplier) * this.magneticSpeedMultiplier * (this.shifting ? 2 : 1)};
    if (this.partialMagnetism) {this.yv -= sy; this.yv += magneticSpeed * tFix * ((this.dead && !(this.area.cancelMagnetismOnDownedPlayers)) ? 1 : this.speedMultiplier) * this.magneticSpeedMultiplier * (this.shifting ? 2 : 1)};
    let wls = this.area.walls;
    this.x += this.xv;
    let r = (this.tempRadius ?? this.radius) * this.radiusMultiplier;
    let selfRect = {x: this.x - r, y: this.y - r, width: r * 2, height: r * 2};
    // for (let w in wls){
    //   if (rectRect(selfRect, wls[w])){
    //     if (this.xv > 0){
    //       this.x = wls[w].x - r - 1;
    //     } else {
    //       this.x = wls[w].x + wls[w].w + r + 1;
    //     }
    //   }
    // }
    this.y += this.yv;
    // for (let w in wls){
    //   if (rectRect(selfRect, wls[w])){
    //     if (this.yv > 0){
    //       this.y = wls[w].y - r - 1;
    //     } else {
    //       this.y = wls[w].y + wls[w].h + r + 1;
    //     }
    //   }
    // }
    this.prevMovementX = this.xv;
    this.prevMovementY = this.yv;
  }
  addXp(xp){
    //levelup
    this.levelProgress += xp;
    while (this.levelProgress >= this.levelProgressNeeded){
      let maxLevel = 100;
      if (this.region.hasOwnProperty("properties") && this.region.properties.hasOwnProperty("max_level")){
        maxLevel = this.region.properties.max_level;
      }
      if (this.level < maxLevel){
        this.level++;
        this.upgradePoints++;
        this.levelProgress -= this.levelProgressNeeded;
        this.levelProgressNeeded = this.getRequiredEXP(this.level);
      } else {
        this.levelProgress = this.levelProgressNeeded;
        break;
      }
    }
  }
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
  removeAura(aura){
    this.auras.splice(this.auras.indexOf(aura), 1);
  }
  upgradeSpeed(){
    if (this.upgradePoints > 0 && this.speed < gameConsts.maxSpeed){
      this.speed += gameConsts.speedIncrement;
      this.speed = min(this.speed, gameConsts.maxSpeed);
      this.upgradePoints--;
    }
  }
  upgradeEnergy(){
    if (this.upgradePoints > 0 && this.maxEnergy < gameConsts.maxEnergy){
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
  toggleOffOtherAbility(exemptAbility){
    if (this.ability2 !== exemptAbility){
      if (this.ability2.toggled === false){
        return;
      }
      let prms = this.ability2.getActivationParams(this);
      this.ability2.toggled = false;
      this.ability2.startCooldown(this);
      this.ability2.toggleOff(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
      return;
    }
    if (this.ability1 !== exemptAbility){
      if (this.ability1.toggled === false){
        return;
      }
      let prms = this.ability1.getActivationParams(this);
      this.ability1.toggled = false;
      this.ability1.startCooldown(this);
      this.ability1.toggleOff(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
      return;
    }
  }
  regenEnergy(){
    if (this.energy < this.tempMaxEnergy){
      this.energy += this.tempRegen * tFix * (1/30);
      this.energy = min(this.energy, this.tempMaxEnergy)
    }
  }
  setAbilityUsages(){
    //we need to prevent abilities from being used multiple times per frame
    //this will happen if a player is controlled with both arrows and mouse at the same time,
    //as both of those sets use Z/X/C, so it will try to tap Z/X/C twice in one frame.
    let ab1usedThisFrame = false;
    let ab2usedThisFrame = false;
    let ab3usedThisFrame = false;
    for (var i in this.ctrlSets){
      this.ctrlSets[i].getAbKeyStates();
      if ((this.ab1macro || this.ctrlSets[i].ab1KeyTapped) && !ab1usedThisFrame){
        this.ability1.attemptUse(this);
        ab1usedThisFrame = true;
      }
      if ((this.ab2macro || this.ctrlSets[i].ab2KeyTapped) && !ab2usedThisFrame){
        this.ability2.attemptUse(this);
        ab2usedThisFrame = true;
      }
      if ((this.ab3macro || this.ctrlSets[i].ab3KeyTapped) && !ab3usedThisFrame){
        this.ability3.attemptUse(this);
        ab3usedThisFrame = true;
      }
    }
  }
  getControls(){
    this.shifting = false;
    if (keyIsDown(16)){
      this.shifting = true;
    }
    var ctrlVector = {x: 0, y: 0};
    let vecSources = {x: null, y: null};
    this.ctrlSets.sort((a, b) => a.setPriority - b.setPriority);
    for (var i in this.ctrlSets){
      if (!this.ctrlSets[i].active){
        continue;
      }
      var testCv = this.ctrlSets[i].getCtrlVector(this);
      if (testCv.x !== null){
        ctrlVector.x = testCv.x;
        vecSources.x = this.ctrlSets[i].ctrlType;
        if (vecSources.y === "mouse" && this.ctrlSets[i].ctrlType !== "mouse"){
          ctrlVector.y = 0 
          vecSources.y = this.ctrlSets[i].ctrlType;
        }
      }
      if (testCv.y !== null){
        ctrlVector.y = testCv.y;
        vecSources.y = this.ctrlSets[i].ctrlType;
        if (vecSources.x === "mouse" && this.ctrlSets[i].ctrlType !== "mouse"){
          ctrlVector.x = 0 
          vecSources.x = this.ctrlSets[i].ctrlType;
        }
      }
    }
    return ctrlVector;
  }
  rechargePelletBasedAbilities(pelletMultiplier){
    this.ability1.pelletBased && this.ability1.recharge(pelletMultiplier);
    this.ability2.pelletBased && this.ability2.recharge(pelletMultiplier);
    this.ability3.pelletBased && this.ability3.recharge(pelletMultiplier);
  }
  updateAbilities(){
    let prms = this.ability1.getActivationParams(this);
    this.ability1.update(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    this.ability2.update(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    this.ability3.update(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    this.ability1.behavior(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    this.ability2.behavior(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    this.ability3.behavior(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
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
    this.lastDeathX = this.x;
    this.lastDeathY = this.y;
    for (var i = 0; i < this.effects.length; i++){
      if (this.effects[i].removedOnDeath){
        this.effects.splice(i, 1);
        i--;
      }
    }
    this.ability1.tryToggleOffThroughDeath(this);
    this.ability2.tryToggleOffThroughDeath(this);
    this.ability3.tryToggleOffThroughDeath(this);
    this.dead = true;
    let deathTime = (this.region.properties.death_timer ?? deathTimerDurations[Math.min(deathTimerDurations.length - 1, this.areaNum)])
    this.deathTimer = deathTime * this.deathTimerMultiplier;
    this.deathEffect = new DeadEffect(this.deathTimer);
    this.gainEffect(this.deathEffect);
    if (settings.instantRespawn && this.instantRespawnAppropriate() && this.isMain){
      this.x = this.mostRecentSafeZone.x + this.mostRecentSafeZone.width / 2;
      this.y = this.mostRecentSafeZone.y + this.mostRecentSafeZone.height / 2;
      this.revive();
      if (settings.rechargeCooldownOnDeath){
        this.ability1.recharge(100000);
        this.ability2.recharge(100000);
        this.ability3.recharge(100000);
      }
    }
  }
  instantRespawnAppropriate(){
    return true;
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
    if (this.alphaMultiplier !== 0){
      this.drawName();
      this.drawBar();
    }
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
      this.auras[i].drawLight();
      this.auras[i].draw();
    }
  }
  enemyCollision(enemy){
    for (let i in this.effects){      
      this.effects[i].playerEnemyContact(this, enemy);
    }
    if (this.cancelContactDeath){
      return;
    }
    if (enemy.harmless && !(enemy.conditionallyHarmless && enemy.conditionalHarmlessnessHeroTypes.includes(this.heroName))){return;};
    if (this.invincible && (!enemy.corrosive || this.corrosiveBypass)) {return;};
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
        this.gainEffect(new MinimumSpeedZoneEffect(zone.properties.minimum_speed / (settings.useNewUnits ? 30 : 1)), false);
      }
      switch (zone.type) {
        case "removal":
          this.resetToSpawn();
        case "exit":
        case "pseudo_teleport":
        case "teleport":
          //another kludge, player would move slightly when teleporting in magnetic levels if
          //the game didn't temporarily give them this effect
          this.gainEffect(new CancelMagnetismEffect(60));
          if (!this.onTpZoneLastFrame){
            if (zone.type === "exit" || zone.type === "pseudo_teleport"){
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
          if (circleRect({x: this.x, y: this.y, radius: this.getRadius() + 1}, {x: zone.x + this.getRadius() * 2, y: zone.y + this.getRadius() * 2, width: zone.width - this.getRadius() * 4, height: zone.height - this.getRadius() * 4})){
            this.gainEffect(new SafeZoneEffect(), false);
          }
          //check AGAIN if the player's center point is in the safe zone, and then cancel magnetism effects
          if (ptRect(this.x, this.y, zone.x, zone.y, zone.width, zone.height)){
            this.gainEffect(new CancelMagnetismEffect(), false);
          }
          //prevent the player from respawning in safe zones if they are very thin (annoying in research lab)
          if (zone.width === 32 || zone.height === 32){
            break;
          }
          this.mostRecentSafeX = this.x;
          this.mostRecentSafeY = this.y;
          this.mostRecentSafeZone = zone;
          break;
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
    this.region = this.game.regions[id];
    if (this.regionNum !== id) ui.alertBox.setAlertsForRegion(this.region);
    this.regionNum = id;
  }
  goToAreaFromId(id){
    this.areaNum = constrain(id, 0, this.region.areas.length - 1);
    this.area = this.region.areas[this.areaNum];
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
        if (this.areaNum !== 0 || this.x >= 48){
          return;
        }
        let zt = this.getZonesTouched();
        for (let i in zt){
          if (zt[i].type === "teleport"){
            this.x = 64;
          }
        }
        return;
      }
    }
  }
  changeAreaCheat(areaOffset){
    this.area.exit(this);
    this.area.attemptUnload(this);
    this.areaNum += areaOffset;
    this.areaNum = max(min(this.areaNum, this.region.areas.length - 2), 0);
    this.area = this.region.areas[this.areaNum];
    this.area.enter(this);
    this.area.attemptLoad(true);
  }
  moveToAreaStart(){
    for (var i = 0; i < this.area.zones.length; i++){
      if (this.area.zones[i].type === "safe"){
        this.x = this.area.zones[i].x + this.area.zones[i].width * 0.5;
        this.y = this.area.zones[i].y + this.area.zones[i].height * 0.5;
        return;
      }
    }
  }
  moveToAreaEnd(){
    for (var i = this.area.zones.length - 1; i >= 0; i--){
      if (this.area.zones[i].type === "safe"){
        this.x = this.area.zones[i].x + this.area.zones[i].width * 0.5;
        this.y = this.area.zones[i].y + this.area.zones[i].height * 0.5;
        return;
      }
    }
  }
  swapHero(newHeroName){
    if (!Object.keys(heroList).includes(newHeroName)) return;
    let newPlayer = new(heroDict.get(newHeroName))(this.x, this.y, this.baseRadius, this.name, this.isMain, game, this.regionNum, this.areaNum, this.ctrlSets, false);

    for (var i = 0; i < min(this.ability1.tier, newPlayer.ability1.maxTier); i++){
      newPlayer.ability1.upgrade(newPlayer, true);
    }
    for (var i = 0; i < min(this.ability2.tier, newPlayer.ability2.maxTier); i++){
      newPlayer.ability2.upgrade(newPlayer, true);
    }
    try {
      for (var i = 0; i < min(this.ability3.tier, newPlayer.ability3.maxTier); i++){
        newPlayer.ability3.upgrade(newPlayer, true);
      }
    } catch (error) {
      
    }
    // let prms = this.ability1.getActivationParams(this);
    // this.ability1.toggleOff(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    // this.ability2.toggleOff(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    // try {this.ability3.toggleOff(this, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);} catch (error) {}
    newPlayer.energy = this.energy;
    newPlayer.maxEnergy = this.maxEnergy;
    newPlayer.speed = this.speed;
    newPlayer.regen = this.regen;
    newPlayer.upgradePoints = this.upgradePoints;
    newPlayer.level = this.level;
    newPlayer.levelProgress = this.levelProgress;
    newPlayer.levelProgressNeeded = this.levelProgressNeeded;
    newPlayer.saves = this.saves;
    newPlayer.timesSaved = this.timesSaved;
    newPlayer.mostRecentSafeZone = this.mostRecentSafeZone;
    newPlayer.mostRecentSafeX = this.mostRecentSafeX;
    newPlayer.mostRecentSafeY = this.mostRecentSafeY;
    newPlayer.lastDir = this.lastDir;
    newPlayer.magnetismDirection = this.magnetismDirection;
    newPlayer.prevMovementX = this.prevMovementX;
    newPlayer.prevMovementY = this.prevMovementY;
    newPlayer.sx = this.sx;
    newPlayer.sy = this.sy;
    newPlayer.ab1macro = this.ab1macro;
    newPlayer.ab2macro = this.ab2macro;
    newPlayer.ab3macro = this.ab3macro;

    let ind = this.area.players.indexOf(this);
    this.area.players.splice(this.area.players.indexOf(this), 1);
    this.game.players.splice(this.game.players.indexOf(this), 1);

    this.area.players.push(newPlayer);
    this.game.players.push(newPlayer);

    this.game.setMainPlayer(newPlayer);
  }
  removeSelf(){
    this.area.players.splice(this.area.players.indexOf(this), 1);
    this.area.attemptUnload();
    this.game.players.splice(this.game.players.indexOf(this), 1);
  }
  drawOnMap(){
    noStroke();
    let redness = 200 + 55 * sin(frameCount / (settings.fps / 30) * 0.2);
    let map = ui.miniMap;
    if (this.dead){
      strokeWeight(12 / map.storedRatio * map.markerScale);
      stroke(redness, 0, 0)
    }
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, this.dead ? 255 : (this.tempColor.a ?? 255) * this.alphaMultiplier);
    ellipse(this.x, this.y, (max(this.radius, minPlayerMinimapRadius) / map.storedRatio) * map.markerScale);
    if (this.dead){
      fill(redness, 0, 0);
      noStroke();
      textSize(64 / map.storedRatio * map.markerScale);
      textAlign(CENTER, CENTER);
      let off = 80 / map.storedRatio * map.markerScale;
      if (this.y - off < 40 / map.storedRatio * map.markerScale){
        off *= -1;
      }
      text(round(this.deathEffect.life / 1000), this.x - 2, this.y - off);
    }
  }
  getMagneticSpeed(){
    let state = this.partialMagnetism ? "partial" : (this.magnetism ? "magnetism" : "none");
    switch (state) {
      case "none":
        return 0;
      case "partial":
        return this.tempSpeed/2 * this.magnetismDirection;
      case "magnetism":
        return 10 * this.magnetismDirection;
      default:
        break;
    }
  }
  getMagnet(){
    if (this.areaNum === 0){
      //remove magnet if player has magnet and is on area 1
      if (this.ability3.constructor.name.startsWith("Magnetism")){
        this.ability3.remove();
        this.ability3 = new Ability();
      }
      //dont give magnet on area 1
      return;
    }
    if (this.ability3) this.ability3.remove();
    this.ability3 = (this.magnetismDirection === 1) ? new MagnetismDown() : new MagnetismUp();
  }
}
//this is actually helpful somehow
tpZoneEpsilon = 8;

class MagnetismDown extends Ability{
  constructor(){
    super(1, 0, 1, "ab.magnetism_down");
    this.tier = 1;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.magnetismDirection = -1;
  }
}

class MagnetismUp extends Ability{
  constructor(){
    super(1, 0, 1, "ab.magnetism_up");
    this.tier = 1;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.magnetismDirection = 1;
  }
}

class TestEnt extends Entity{
  constructor(x, y, color = 0){
    super(x, y, 8, color === 1 ? "#cc0000" : "#0000cc", 0.5, "noOutline");
    this.clock = 0;
  }
  update(){
    this.clock += dTime;
    if (this.clock > 4000){
      this.toRemove = true;
    }
  }
}