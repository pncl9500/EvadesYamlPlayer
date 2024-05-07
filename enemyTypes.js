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

class Corrosive extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.corrosive);
    this.corrosive = true;
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

class Turning extends Enemy{
  constructor(x, y, angle, speed, radius, circleSize){
    super(x, y, angle, speed, radius, pal.nm.turning);
    this.turningSpeed = speed / circleSize;
  }
  behavior(area, players) {
    this.velToAngle();
    this.angle += this.turningSpeed * tFix;
    this.angleToVel();
  }
  wallBounce(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.turningSpeed *= -1, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.turningSpeed *= -1, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.turningSpeed *= -1, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.turningSpeed *= -1, this.velToAngle());
    this.wallBounceEvent();
  }
}

class Sizing extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.sizing);
    this.growing = true;
    this.maxRadius = this.radius * 2.5;
    this.minRadius = this.radius / 2.5;
  }
  behavior(area, players){
    if (this.growing) {
      this.baseRadius += (tFix * 0.08) * this.minRadius;
      if (this.baseRadius > this.maxRadius) {
        this.growing = false;
      }
    } else {
      this.baseRadius -= (tFix * 0.08) * this.minRadius;
      if (this.baseRadius < this.minRadius) {
        this.growing = true;
      }
    }
  }
}

class GenericSniper extends Enemy{
  constructor(x, y, angle, speed, radius, color, fireInterval, range){
    super(x, y, angle, speed, radius, color);
    this.fireInterval = fireInterval;
    this.range = range;
    this.clock = random() * this.fireInterval;
  }
  update(area, players){
    this.resetState();
    this.applyEffects();
    this.radius = this.baseRadius * this.radiusMultiplier;
    this.sniperBehavior(area, players);
    this.behavior(area, players);
    if (!this.normalMovementDisabled){
      this.x += this.xv * tFix * this.speedMultiplier * this.xSpeedMultiplier;
      this.y += this.yv * tFix * this.speedMultiplier * this.ySpeedMultiplier;
    }
    if (!this.wallBounceDisabled){
      this.wallBounce();
    }
  }
  sniperBehavior(area, players){
    this.clock += dTime;
    if (this.clock >= this.fireInterval * (2/3)){
      let min = this.fireInterval * (2/3);
      let max = this.fireInterval;
      let mul = map(this.clock, min, max, 0, 1, true)
      this.tempColor.r *= (1 - mul * 0.3); this.tempColor.r = floor(this.tempColor.r);
      this.tempColor.g *= (1 - mul * 0.3); this.tempColor.g = floor(this.tempColor.g);
      this.tempColor.b *= (1 - mul * 0.3); this.tempColor.b = floor(this.tempColor.b);
    }
    if (this.clock > this.fireInterval) {
      var min = this.range;
      var index;
      for (var i in players) {
        let dist = sqrt(sq(players[i].x - this.x) + sq(players[i].y - this.y))
        if (dist < min && players[i].detectable) {
          min = dist;
          index = i;
        }
      }
      if (index != undefined) {
        var dX = (players[index].x) - this.x;
        var dY = (players[index].y) - this.y;
        this.createBullet(atan2(dY, dX), players[index], area);
        this.clock = 0;
      }
    }
  }
  createBullet(angle, target, area){

  }
  behavior(area, players){
    
  }
}


class Sniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new Bullet(this.x, this.y, angle, 10, this.radius / 2, pal.nm.sniper);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class Bullet extends Enemy{
  constructor(x, y, angle, speed, radius, color, maxLife = 7000){
    super(x, y, angle, speed, radius, color);
    this.renderType = "noOutline";
    this.immune = true;
    this.clock = 0;
    this.maxLife = maxLife;
  }
  playerCollisionEvent(player){

  }
  update(area, players){
    if (this.maxLife >= 0){
      this.clock += dTime;
      if (this.clock > this.maxLife){
        this.toRemove = true;
      }
    }
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
  wallBounce(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.toRemove = true);
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.toRemove = true);
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.toRemove = true);
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.toRemove = true);
    this.wallBounceEvent();
  }
}

class SpeedSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius, loss){
    super(x, y, angle, speed, radius, pal.nm.speed_sniper, 3000, 600);
    this.loss = loss;
  } 
  createBullet(angle, target, area){
    let bullet = new SpeedSniperBullet(this.x, this.y, angle, 16, 10, pal.nm.speed_sniper, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class SpeedSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color, loss){
    super(x, y, angle, speed, radius, color);
    this.loss = loss;
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    player.speed -= this.loss * player.effectVulnerability;
    if (player.speed < gameConsts.startingSpeed){
      player.speed = gameConsts.startingSpeed;
    }
    this.toRemove = true;
  }
}

class RegenSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius, loss){
    super(x, y, angle, speed, radius, pal.nm.regen_sniper, 3000, 600);
    this.loss = loss;
  } 
  createBullet(angle, target, area){
    let bullet = new RegenSniperBullet(this.x, this.y, angle, 16, 10, pal.nm.regen_sniper, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class RegenSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color, loss){
    super(x, y, angle, speed, radius, color);
    this.loss = loss;
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    player.regen -= this.loss * player.effectVulnerability;
    if (player.regen < gameConsts.startingRegen){
      player.regen = gameConsts.startingRegen;
    }
    this.toRemove = true;
  }
}

class IsGhostEffect extends Effect{
  constructor(){
    super(-1, getEffectPriority("IsGhostEffect"), false, false);
  }
  doEffect(target){
    target.harmless = true;
    target.immune = true;
    target.alphaMultiplier = 0.4;
  }
}
class SpeedGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.speed_ghost)
    this.gainEffect(new IsGhostEffect());
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.speed -= 0.1 * player.effectVulnerability * tFix;
        if (player.speed < gameConsts.startingSpeed){
          player.speed = gameConsts.startingSpeed;
        }
      }
    }
  }
}

class RegenGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.regen_ghost)
    this.gainEffect(new IsGhostEffect());
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.regen -= 0.04 * player.effectVulnerability * tFix;
        if (player.regen < gameConsts.startingRegen){
          player.regen = gameConsts.startingRegen;
        }
      }
    }
  }
}

class DisablingGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.disabling_ghost)
    this.gainEffect(new IsGhostEffect());
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.gainEffect(new DisablingEnemyEffect());
      }
    }
  }
}

class RadiatingBullets extends GenericSniper{
  constructor(x, y, angle, speed, radius, releaseTime, releaseInterval){
    super(x, y, angle, speed, radius, pal.nm.radiating_bullets, releaseInterval, null);
    if (releaseTime !== undefined){
      this.clock = releaseTime;
    }
  }
  sniperBehavior(area, players){
    this.clock += dTime;
    if (this.clock >= this.fireInterval * (2/3)){
      let min = this.fireInterval * (2/3);
      let max = this.fireInterval;
      let mul = map(this.clock, min, max, 0, 1, true)
      this.tempColor.r *= (1 - mul * 0.3); this.tempColor.r = floor(this.tempColor.r);
      this.tempColor.g *= (1 - mul * 0.3); this.tempColor.g = floor(this.tempColor.g);
      this.tempColor.b *= (1 - mul * 0.3); this.tempColor.b = floor(this.tempColor.b);
    }
    if (this.clock > this.fireInterval) {
      this.createBullet(area);
      this.clock = 0;
    }
  }
  createBullet(area){
    for (var i = 0; i < 8; i++){
      let bullet = new Bullet(this.x, this.y, i * PI/4, 8, 8, pal.nm.radiating_bullets, 3000);
      bullet.parentZone = this.parentZone;
      area.addEnt(bullet);
    }
  }
}

class CorrosiveSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.corrosive_sniper, 3000, 600);
    this.corrosive = true;
  } 
  createBullet(angle, target, area){
    let bullet = new Bullet(this.x, this.y, angle, 10, this.radius / 2, pal.nm.corrosive_sniper, -1);
    bullet.renderType = "outline";
    bullet.corrosive = true;
    bullet.immune = false;
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class PoisonSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.poison_sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new PoisonSniperBullet(this.x, this.y, angle, 16, 10, pal.nm.poison_sniper, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class PoisonSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, angle, speed, radius, color);
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    player.gainEffect(new PoisonSniperEffect(1000));
    this.toRemove = true;
  }
}

class PoisonSniperEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("PoisonSniperEffect"), false, true);
  }
  doEffect(target){
    let t = this.life / this.duration;
    target.speedMultiplier *= 3 * target.effectVulnerability;
    target.tempColor = {r: floor(map(t, 0, 1, target.tempColor.r, 140)), g: floor(map(t, 0, 1, target.tempColor.g, 1)), b:  floor(map(t, 0, 1, target.tempColor.b, 183))};
  }
}

class PoisonGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.poison_ghost)
    this.gainEffect(new IsGhostEffect());
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.gainEffect(new PoisonSniperEffect(100));
      }
    }
  }
}

class IceSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.ice_sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new IceSniperBullet(this.x, this.y, angle, 16, 10, pal.nmp.ice_sniper, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class IceSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, angle, speed, radius, color);
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    player.gainEffect(new IceSniperEffect(1000 * player.effectVulnerability));
    this.toRemove = true;
  }
}

class IceSniperEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("IceSniperEffect"), false, true);
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    let t = this.life / this.duration;
    target.speedMultiplier = 0;
    target.tempSpeed = 0;
    target.tempColor = {r: floor(map(t, 0, 1, target.tempColor.r, 135)), g: floor(map(t, 0, 1, target.tempColor.g, 235)), b:  floor(map(t, 0, 1, target.tempColor.b, 255))};
  }
}

class IceGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.ice_ghost)
    this.gainEffect(new IsGhostEffect());
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.gainEffect(new IceGhostEffect());
      }
    }
  }
}

class IceGhostEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("IceGhostEffect"), false, true);
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    let t = frameCount % 10 < 5 ? 0.8 : 0.7;
    target.speedMultiplier = 0;
    target.tempSpeed = 0;
    target.tempColor = {r: floor(map(t, 0, 1, target.tempColor.r, 135)), g: floor(map(t, 0, 1, target.tempColor.g, 235)), b:  floor(map(t, 0, 1, target.tempColor.b, 255))};
  }
}

class Liquid extends Enemy{
  constructor(x, y, angle, speed, radius, detectionRadius){
    super(x, y, angle, speed, radius, pal.nm.liquid);
    this.detectionRadius = detectionRadius;
  }
  behavior(area, players){
    for (var i in players) {
      let dist = sqrt(sq(players[i].x - this.x) + sq(players[i].y - this.y))
      if (dist < this.detectionRadius && players[i].detectable) {
        this.speedMultiplier *= 5;
        return;
      }
    }
  }
}

class Icicle extends Enemy{
  constructor(x, y, speed, radius, horizontal){
    super(x, y, horizontal ? random([0, PI]) : random([PI/2, 3*PI/2]), speed, radius, pal.nm.icicle);
    this.pauseLength = 1000;
    this.pauseTimer = 0;
  }
  behavior(area, players){
    this.pauseTimer -= dTime;
    if (this.pauseTimer > 0){
      this.speedMultiplier = 0;
    }
  }
  wallBounce(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.pauseTimer = this.pauseLength, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.pauseTimer = this.pauseLength, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.pauseTimer = this.pauseLength, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.pauseTimer = this.pauseLength, this.velToAngle());
    this.wallBounceEvent();
  }
}

class Slippery extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.slippery, pal.nmaur.slippery, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new SlipperyEnemyEffect(player));
  }
}

class SlipperyEnemyEffect extends Effect{
  constructor(player){
    super(0, getEffectPriority("SlipperyEnemyEffect"), false, true);
    this.playerLastXv = player.xv;
    this.playerLastYv = player.yv;
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    if (sqrt(sq(this.playerLastXv) + sq(this.playerLastYv)) < 0.4){
      return;
    }
    if (target.restrictedLastFrame){
      let newCtrlVector = {x: this.playerLastXv, y: this.playerLastYv};
      let mag = sqrt(sq(newCtrlVector.x) + sq(newCtrlVector.y));
      newCtrlVector.x /= mag;
      newCtrlVector.y /= mag;
      target.ctrlVector.x += newCtrlVector.x;
      target.ctrlVector.y += newCtrlVector.y;

      return;
    }
    target.ctrlVector = {x: this.playerLastXv, y: this.playerLastYv};
    let mag = sqrt(sq(target.ctrlVector.x) + sq(target.ctrlVector.y));
    target.ctrlVector.x /= mag;
    target.ctrlVector.y /= mag;
  }
}

class Teleporting extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.teleporting);
    this.clock = 0;
    this.teleportPeriod = 22e3/30;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock >= this.teleportPeriod){
      this.clock = this.clock % this.teleportPeriod;
    } else {
      this.speedMultiplier = 0;
    }
  }
}

class Star extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.star);
    this.clock = 0;
    this.teleportPeriod = 400;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock >= this.teleportPeriod){
      this.speedMultiplier *= 3;
      this.velToAngle();
      this.angle += PI;
      this.angleToVel();
      this.clock = this.clock % this.teleportPeriod;
    } else {
      this.speedMultiplier = 0;
    }
  }
}

class Gravity extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize, gravity){
    super(x, y, angle, speed, radius, pal.nm.gravity, pal.nmaur.gravity, auraSize)
    this.gravity = gravity;
  }
  applyAuraEffectToPlayer(area, players, player){
    if (player.fullEffectImmunity){
      return;
    }
    var dx = player.x - this.x;
    var dy = player.y - this.y;
    var dist = sqrt(sq(dx) + sq(dy));
    var attractionAmplitude = pow(2, -(dist / 100));
    var moveDist = (this.gravity * attractionAmplitude * player.effectVulnerability);
    var angleToPlayer = atan2(dy, dx);
    player.x -= (moveDist * cos(angleToPlayer)) * tFix;
    player.y -= (moveDist * sin(angleToPlayer)) * tFix;
  }
}

class GravityGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.gravity_ghost)
    this.gainEffect(new IsGhostEffect());
    this.gravity = 12;
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        var dx = player.x - this.x;
        var dy = player.y - this.y;
        var dist = sqrt(sq(dx) + sq(dy));
        var attractionAmplitude = pow(2, -(dist / 100));
        var moveDist = (this.gravity * attractionAmplitude * player.effectVulnerability);
        var angleToPlayer = atan2(dy, dx);
        player.x -= (moveDist * cos(angleToPlayer)) * tFix;
        player.y -= (moveDist * sin(angleToPlayer)) * tFix;
      }
    }
  }
}

class Repelling extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize, repulsion){
    super(x, y, angle, speed, radius, pal.nm.repelling, pal.nmaur.repelling, auraSize)
    this.repulsion = repulsion;
  }
  applyAuraEffectToPlayer(area, players, player){
    if (player.fullEffectImmunity){
      return;
    }
    var dx = player.x - this.x;
    var dy = player.y - this.y;
    var dist = sqrt(sq(dx) + sq(dy));
    var attractionAmplitude = pow(2, -(dist / 100));
    var moveDist = (this.repulsion * attractionAmplitude * player.effectVulnerability);
    var angleToPlayer = atan2(dy, dx);
    player.x += (moveDist * cos(angleToPlayer)) * tFix;
    player.y += (moveDist * sin(angleToPlayer)) * tFix;
  }
}

class RepellingGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.repelling_ghost)
    this.gainEffect(new IsGhostEffect());
    this.repulsion = 12;
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        var dx = player.x - this.x;
        var dy = player.y - this.y;
        var dist = sqrt(sq(dx) + sq(dy));
        var attractionAmplitude = pow(2, -(dist / 100));
        var moveDist = (this.repulsion * attractionAmplitude * player.effectVulnerability);
        var angleToPlayer = atan2(dy, dx);
        player.x += (moveDist * cos(angleToPlayer)) * tFix;
        player.y += (moveDist * sin(angleToPlayer)) * tFix;
      }
    }
  }
}