class MysteryEnemy extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraColor, auraRadius, placeholderType){
    super(x, y, angle, speed, radius, pal.nm.hasOwnProperty(placeholderType) ? pal.nm[placeholderType] : pal.nm.mystery, auraColor, auraRadius);
  }
}

class Normal extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.normal);
  }
}

class Immune extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.immune);
    this.immune = true;
  }
}

class Wall extends Enemy{
  constructor(speed, radius, ind, count, clockwise, zone){
    //speed is set to 0 since the wall is being moved manually
    super(0, 0, 0, speed, radius, pal.nm.wall);
    this.immune = true;
    this.clockwise = clockwise;
    this.normalMovementDisabled = true;

    this.vertWallLength = zone.height - radius * 2;
    this.horizWallLength = zone.width - radius * 2;
    this.perimeter = this.vertWallLength * 2 + this.horizWallLength * 2;

    this.leftBound = zone.x + radius;
    this.rightBound = zone.x - radius + zone.width;
    this.topBound = zone.y + radius;
    this.bottomBound = zone.y - radius + zone.height;

    this.zoneCenterX = zone.x + zone.width / 2;

    this.trackPos = 0 + ind * (this.perimeter / count);
    this.getPosFromTrackPosition();
  }
  behavior(area, players){
    this.trackPos += this.speed * tFix * (this.clockwise ? 1 : -1);
    if (this.trackPos < 0){
      this.trackPos += this.perimeter;
    }
    this.trackPos %= this.perimeter;
    this.getPosFromTrackPosition();
  }
  wallBounce(){
    //disable default behavior (everything is controlled in GPFTP)
  }
  getPosFromTrackPosition(){
     //top 2
     if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength + this.horizWallLength + this.vertWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength - this.horizWallLength - this.vertWallLength;
      this.x = this.leftBound + relPos;
      this.y = this.topBound;
      return;
    }
    //left
    if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength + this.horizWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength - this.horizWallLength;
      this.x = this.leftBound;
      this.y = this.bottomBound - relPos;
      return;
    }
    //bottom
    if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength;
      this.x = this.rightBound - relPos;
      this.y = this.bottomBound;
      return;
    }
    //right
    if (this.trackPos > this.horizWallLength / 2){
      let relPos = this.trackPos - this.horizWallLength / 2;
      this.x = this.rightBound;
      this.y = this.topBound + relPos;
      return;
    }
    //top 1
    this.x = this.zoneCenterX + this.trackPos;
    this.y = this.topBound;
    return;
  }
}

class Slowing extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.slowing, pal.nmaur.slowing, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new SlowingEnemyEffect());
  }
}

class SlowingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("SlowingEnemyEffect"), false, true);
  }
  doEffect(target){
    target.speedMultiplier *= (1 - 0.3 * target.effectVulnerability);
  }
}

class Freezing extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.freezing, pal.nmaur.freezing, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new FreezingEnemyEffect());
  }
}

class FreezingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("FreezingEnemyEffect"), false, true);
  }
  doEffect(target){
    target.speedMultiplier *= (1 - 0.85 * target.effectVulnerability);
  }
}

class Draining extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.draining, pal.nmaur.draining, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new DrainingEnemyEffect());
  }
}

class DrainingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("DrainingEnemyEffect"), false, true);
  }
  doEffect(target){
    let newEnergy = target.energy - 15 * target.effectVulnerability * tFix * (1/30);
    if (newEnergy < 0){
      target.energy = Math.min(target.energy, 0);
    } else {
      target.energy = newEnergy;
    }
  }
}

class Toxic extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.toxic, pal.nmaur.toxic, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.energy = min(player.energy, player.maxEnergy * (1 - 0.3 * player.effectVulnerability));
  }
}

class Enlarging extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.enlarging, pal.nmaur.enlarging, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new EnlargingEnemyEffect());
  }
}

class EnlargingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("EnlargingEnemyEffect"), false, true);
  }
  doEffect(target){
    target.tempRadius += 10 * target.effectVulnerability;
  }
}

class Disabling extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.disabling, pal.nmaur.disabling, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new DisablingEnemyEffect());
  }
}

class DisablingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("DisablingEnemyEffect"), false, true);
  }
  doEffectBeforeAbilities(target){
    if (target.fullEffectImmunity){
      return;
    }
    target.abilitiesDisabled = true;
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    let prms = target.ability1.getActivationParams(target);
    try {if (target.ability1.toggled) {target.ability1.toggled = false; target.ability1.toggleOff(target, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area); }} catch (error) {}
    try {if (target.ability2.toggled) {target.ability2.toggled = false; target.ability2.toggleOff(target, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area); }} catch (error) {}
    try {if (target.ability3.toggled) {target.ability3.toggled = false; target.ability3.toggleOff(target, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area); }} catch (error) {}
  }
}

class Lava extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.lava, pal.nmaur.lava, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new LavaEnemyEffect());
  }
}

class LavaEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("LavaEnemyEffect"), false, true);
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    let newEnergy = target.energy + 15 * target.effectVulnerability * tFix * (1/30);
    if (newEnergy > target.maxEnergy){
      target.energy = 0;
      if (!(target.isMain && settings.invincibilityCheat)){
        target.die();
      }
    } else {
      target.energy = newEnergy;
    }
  }
}

class Dasher extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.dasher);
    this.time_to_prepare = 750;
    this.time_to_dash = 3000;
    this.time_between_dashes = 750;
    this.normal_speed = speed;
    this.base_speed = this.normal_speed / 5;
    this.prepare_speed = this.normal_speed / 5;
    this.dash_speed = this.normal_speed;
    this.time_dashing = 0;
    this.time_preparing = 0;
    this.time_since_last_dash = 0;
    this.velToAngle();
    this.oldAngle = this.angle;
    this.dasher = true;
  }
  compute_speed(){
    this.speed = (this.time_since_last_dash < this.time_between_dashes && this.time_dashing == 0 && this.time_preparing == 0) ? 0 : (this.time_dashing == 0) ? this.prepare_speed : this.base_speed//(this.time_preparing>0) ? this.prepare_speed : this.base_speed
    this.speedToVel();
    this.oldAngle = this.angle;
  }
  wallBounce(){
    this.angle = this.oldAngle;
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.wallBounceEvent();
    this.oldAngle = this.angle;
  }
  behavior(area, players) {
    this.angle = this.oldAngle;
    if(this.time_preparing == 0){
      if(this.time_dashing == 0){
        if(this.time_since_last_dash < this.time_between_dashes){
          this.time_since_last_dash += dTime;
        }
        else{
          this.time_since_last_dash = 0;
          this.time_preparing += dTime;
          this.base_speed = this.prepare_speed;
        }
      }
      else {
        this.time_dashing += dTime;
        if (this.time_dashing > this.time_to_dash){
          this.time_dashing = 0;
          this.base_speed = this.normal_speed;
        } else {
          this.base_speed = this.dash_speed * ( 1 - (this.time_dashing / this.time_to_dash ) );
        }
      }
    } else {
      this.time_preparing += dTime;
      if (this.time_preparing > this.time_to_prepare){
        this.time_preparing = 0;
        this.time_dashing += dTime;
        this.base_speed = this.dash_speed;
      } else {
        this.base_speed = this.prepare_speed * ( 1 - (this.time_preparing / this.time_to_prepare) );
      }
    }
    this.compute_speed();
  }
}

class Homing extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.homing);
    this.targetAngle = angle;
  }
  behavior(area, players) {
    var min = 180;
    var index;
    this.targetAngle = this.angle;
    for (var i in players) {
      let dist = sqrt(sq(this.x - players[i].x) + sq(this.y - players[i].y))
      if (players[i].detectable && dist < min) {
        min = sqrt(sq(this.x - players[i].x) + sq(this.y - players[i].y));
        index = i;
      }
    }
    this.velToAngle();
    if (index != undefined) {
      var dX = players[index].x - this.x
      var dY = players[index].y - this.y
      this.targetAngle = atan2(dY, dX);
    }
    var dif = this.targetAngle - this.angle;
    var angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
    var angleIncrement = 0.04
    if (Math.abs(angleDif) >= angleIncrement) {
      if (angleDif < 0) {
        this.angle -= angleIncrement * tFix
      } else {
        this.angle += angleIncrement * tFix
      }
    }
    this.angleToVel();
  }
}