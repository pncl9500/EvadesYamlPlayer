class Enemy extends Entity{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, radius, color, radius - z.enemyRadiusZfactor + random() * z.randEpsilon, "outline");
    
    this.normalMovementDisabled = false;

    this.immune = false;

    this.baseRadius = radius;
    this.mainType = "enemy";
    this.angle = angle;
    this.speed = speed;
    this.xv = speed;
    this.yv = 0;
    this.restricted = true;
    this.resetState();
    this.angleToVel();
    //all enemies have parentZone property

    this.playerContactFunctions = [];
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
    this.alphaMultiplier = 1;
  }
  velToAngle(){
    this.angle = atan2(this.yv, this.xv);
  }
  angleToVel(){
    let mag = sqrt(this.xv * this.xv + this.yv * this.yv);
    this.xv = mag * cos(this.angle);
    this.yv = mag * sin(this.angle);
  }
  update(area, players){
    this.resetState();
    this.applyEffects();
    this.radius = this.baseRadius * this.radiusMultiplier;
    this.behavior(area, players);
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
    if (!this.harmless){
      player.enemyCollision(this);
    }
  }
  behavior(area, players){

  }
  wallBounce(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.wallBounceEvent();
  }
  wallBounceEvent(){

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
    this.aura = new LockedAura(this, auraSize, auraColor, 200 + auraSize);
  }
  getAura(){
    this.aura.update();
    this.aura.radius = this.auraSize * this.radiusMultiplier;
    return this.aura;
  }
  applyAuraEffectToPlayer(area, players, player){

  }
  behavior(area, players){
    for (var i in players){
      if (players[i].dead && !this.affectsDeadPlayers){
        continue;
      }
      if (circleCircle(this.aura, players[i])){
        this.applyAuraEffectToPlayer(area, players, players[i]);
      }
    }
  }
}