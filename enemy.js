class Enemy extends Entity{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, radius, color, z.enemy + radius * z.enemyRadiusZfactor + random() * z.randEpsilon, "outline");
    
    this.normalMovementDisabled = false;

    this.immune = false;

    this.inherentlyHarmless = false;
    this.baseRadius = radius;
    this.mainType = "enemy";
    this.angle = angle;
    this.speed = speed;
    this.xv = speed;
    this.yv = 0;
    this.restricted = true;
    this.resetState();
    this.angleToVel();
    this.interactAsBullet = false;
    //all enemies have parentZone property

    this.playerContactFunctions = [];
  }
  setAsGhost(){
    this.gainEffect(new IsGhostEffect());
    this.alphaMultiplier = 0.4;
  }
  canGainEffect(effect){
    if (this.immune && !effect.overrideEnemyImmunity){
      return false;
    }
    return true;
  }
  resetState(){
    this.radiusMultiplier = 1;
    this.speedMultiplier = 1;
    this.xSpeedMultiplier = 1;
    this.ySpeedMultiplier = 1;
    this.wallBounceDisabled = false;
    this.harmless = false;
    if (this.inherentlyHarmless){
      this.harmless = true;
    }
    this.conditionallyHarmless = false;
    this.conditionalHarmlessnessHeroTypes = [];
    this.disabled = false;
    this.alphaMultiplier = 1;
  }
  spawnBullet(bullet){
    bullet.parentZone = this.parentZone;
    this.parentZone.parentRegion.areas[this.parentZone.parentAreaNum].addEnt(bullet);
  }
  velToAngle(){
    this.angle = atan2(this.yv, this.xv);
  }
  angleToVel(){
    let mag = sqrt(this.xv * this.xv + this.yv * this.yv);
    this.xv = mag * cos(this.angle);
    this.yv = mag * sin(this.angle);
  }
  speedToVel(){
    this.xv = this.speed;
    this.yv = 0;
    this.angleToVel();
  }
  setAngle(ang){
    if (this.immune){
      return;
    }
    this.velToAngle();
    this.angle = ang;
    this.angleToVel();
  }
  simBehavior(area, players){
    this.behavior(area, players);
  }
  update(area, players, sim = false){
    !sim && this.resetState();
    !sim && this.applyEffects();
    this.radius = this.baseRadius * this.radiusMultiplier;
    sim ? this.simBehavior(area, players) : this.behavior(area, players);
    this.radius = this.baseRadius * this.radiusMultiplier;
    if (!this.normalMovementDisabled){
      this.x += this.xv * tFix * this.speedMultiplier * this.xSpeedMultiplier;
      this.y += this.yv * tFix * this.speedMultiplier * this.ySpeedMultiplier;
    }
    if (!this.wallBounceDisabled){
      this.wallBounce();
    }
  }
  playerCollision(player){
    for (let i in this.playerContactFunctions){
      this.playerContactFunctions[i](player, this);
    }
    this.playerCollisionEvent(player);
    //if (!this.harmless){
    player.enemyCollision(this);
    //}
  }
  playerCollisionEvent(player){

  }
  behavior(area, players){

  }
  wallSnap(){
    if (this.x - this.radius < this.parentZone.x){
      this.x = this.parentZone.x + this.radius;
      let wallX = this.parentZone.x;
      this.wallSnapEvent(wallX, null, wallX + this.radius, null);
    }
    if (this.x + this.radius > this.parentZone.x + this.parentZone.width){
      this.x = this.parentZone.x + this.parentZone.width - this.radius;
      let wallX = this.parentZone.x + this.parentZone.width;
      this.wallSnapEvent(wallX, null, wallX - this.radius, null)
    }
    if (this.y - this.radius < this.parentZone.y){
      this.y = this.parentZone.y + this.radius;
      let wallY = this.parentZone.y;
      this.wallSnapEvent(null, wallY, null, wallY + this.radius);
    }
    if (this.y + this.radius > this.parentZone.y + this.parentZone.height){
      this.y = this.parentZone.y + this.parentZone.height - this.radius;
      let wallY = this.parentZone.y + this.parentZone.height;
      this.wallSnapEvent(null, wallY, null, wallY - this.radius);
    }
  }
  wallSnapEvent(wallX, wallY, tangentPosX, tangentPosY){

  }
  wallBounce(){
    if (this.x - this.radius < this.parentZone.x){
      let jut = (this.parentZone.x - (this.x - this.radius));
      this.x = this.parentZone.x + this.radius + (settings.fixedWallbounces ? jut : 0);
      let wallX = this.parentZone.x;
      this.wallBounceEvent(wallX, null, wallX + this.radius, null); 
      this.angleToVel();
      this.xv *= -1; 
      this.velToAngle();
    }
    if (this.x + this.radius > this.parentZone.x + this.parentZone.width){
      let jut = ((this.parentZone.x + this.parentZone.width) - (this.x + this.radius));
      this.x = this.parentZone.x + this.parentZone.width - this.radius + (settings.fixedWallbounces ? jut : 0);
      let wallX = this.parentZone.x + this.parentZone.width;
      this.wallBounceEvent(wallX, null, wallX - this.radius, null); 
      this.angleToVel();
      this.xv *= -1;
      this.velToAngle();
    }
    if (this.y - this.radius < this.parentZone.y){
      let jut = (this.parentZone.y - (this.y - this.radius));
      this.y = this.parentZone.y + this.radius + (settings.fixedWallbounces ? jut : 0);
      let wallY = this.parentZone.y;
      this.wallBounceEvent(null, wallY, null, wallY + this.radius); 
      this.angleToVel();
      this.yv *= -1; 
      this.velToAngle();
    }
    if (this.y + this.radius > this.parentZone.y + this.parentZone.height){
      let jut = ((this.parentZone.y + this.parentZone.height) - (this.y + this.radius));
      this.y = this.parentZone.y + this.parentZone.height - this.radius + (settings.fixedWallbounces ? jut : 0);
      let wallY = this.parentZone.y + this.parentZone.height;
      this.wallBounceEvent(null, wallY, null, wallY - this.radius); 
      this.angleToVel();
      this.yv *= -1;
      this.velToAngle();
    }
    this.wallBounceOnAssetWalls();
  }
  wallBounceEvent(wallX, wallY, tangentPosX, tangentPosY){

  }
  wallBounceOnAssetWalls(){
    // let wls = this.parentZone.parentRegion.areas[this.parentZone.parentAreaNum].walls;
    // for (let w in wls){
    //   if (lineCircle({x1: w.x + w.w, y1: w.y, x2: w.x + w.w, y2: w.y + w.h}, this)){
    //     let jut = (w.x + w.w - (this.x - this.radius));
    //     this.x = w.x + w.w + this.radius + (settings.fixedWallbounces ? jut : 0);
    //     let wallX = w.x + w.w;
    //     this.wallBounceEvent(wallX, null, wallX + this.radius, null); 
    //     this.angleToVel();
    //     this.xv *= -1; 
    //     this.velToAngle();
    //   }
    // }
  }
}

class Aura extends Entity{
  constructor(x, y, radius, color, z){
    super(x, y, radius, color, z, "noOutline");
  }
}

class LockedAura extends Aura{
  constructor(parent, radius, color, z){
    super(parent.x, parent.y, radius, color, z);
    this.parent = parent;
  }
  update(){
    this.x = this.parent.x;
    this.y = this.parent.y;
  }
}

class AuraEnemy extends Enemy{
  constructor(x, y, angle, speed, radius, color, auraColor, auraSize){
    super(x, y, angle, speed, radius, color)
    this.auraColor = auraColor;
    this.auraSize = auraSize;
    this.affectsDeadPlayers = false;
    this.aura = new LockedAura(this, auraSize, auraColor, this.z + z.auraOffsetFromParent);
  }
  getAura(){
    this.aura.update();
    this.aura.radius = this.auraSize * this.radiusMultiplier;
    if (this.disabled){
      this.aura.radius = 0;
    }
    return this.aura;
  }
  applyAuraEffectToPlayer(area, players, player){

  }
  behavior(area, players){
    for (var i in players){
      if (players[i].dead && !this.affectsDeadPlayers){
        continue;
      }
      if (circleCircle({x: this.x, y: this.y, r: this.auraSize * this.radiusMultiplier}, players[i]) && !this.disabled){
        this.applyAuraEffectToPlayer(area, players, players[i]);
      }
    }
  }
}