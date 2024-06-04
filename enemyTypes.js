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
    this.blockable = true;
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
    this.blockable = true;
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
    this.blockable = true;
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
    this.blockable = true;
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
    this.blockable = true;
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
    this.light = this.auraSize + 60;
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new LavaEnemyEffect());
  }
}

class LavaEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("LavaEnemyEffect"), false, true);
    this.blockable = true;
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
  simBehavior(area, players){

  }
  setAngle(ang){
    this.velToAngle();
    this.angle = ang;
    this.oldAngle = ang;
    this.angleToVel();
  }
  compute_speed(){
    this.speed = (this.time_since_last_dash < this.time_between_dashes && this.time_dashing == 0 && this.time_preparing == 0) ? 0 : (this.time_dashing == 0) ? this.prepare_speed : this.base_speed//(this.time_preparing>0) ? this.prepare_speed : this.base_speed
    this.speedToVel();
    this.oldAngle = this.angle;
  }
  wallBounce(){
    this.angle = this.oldAngle;
    super.wallBounce();
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
  wallBounceEvent(wallX, wallY){
    this.turningSpeed *= -1;
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
      this.baseRadius += (tFix * 0.1) * this.minRadius;
      if (this.baseRadius > this.maxRadius) {
        this.growing = false;
      }
    } else {
      this.baseRadius -= (tFix * 0.1) * this.minRadius;
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
    if (this.clock > this.fireInterval && !this.disabled) {
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
    this.interactAsBullet = true;
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
  wallBounceEvent(wallX, wallY){
    this.toRemove = true;
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
    this.setAsGhost();
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
    this.setAsGhost();
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
    this.setAsGhost();
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
    if (this.disabled) return;
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
    let bullet = new Bullet(this.x, this.y, angle, 10, this.radius / 2, pal.nm.corrosive_sniper, 7000);
    bullet.interactAsBullet = false;
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
    let bullet = new PoisonSniperBullet(this.x, this.y, angle, 16, 10, pal.nmp.poison_sniper);
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
    player.gainEffect(new PoisonSniperEffect(1000, player.effectVulnerability));
    this.toRemove = true;
  }
}

class PoisonSniperEffect extends Effect{
  constructor(duration, vulnAtContactPoint = 1){
    super(duration, getEffectPriority("PoisonSniperEffect"), false, true);
    this.vulnAtContactPoint = vulnAtContactPoint;
  }
  doEffect(target){
    let t = this.life / this.duration;
    target.speedMultiplier *= 1 + (2 * this.vulnAtContactPoint);
    target.tempColor = {r: floor(map(t, 0, 1, target.tempColor.r, 140)), g: floor(map(t, 0, 1, target.tempColor.g, 1)), b:  floor(map(t, 0, 1, target.tempColor.b, 183))};
  }
}

class PoisonGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.poison_ghost)
    this.setAsGhost();
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        player.gainEffect(new PoisonSniperEffect(150));
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
    this.setAsGhost();
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
  wallBounceEvent(wallX, wallY, tangentPosX, tangentPosY){
    this.pauseTimer = this.pauseLength;
    if (tangentPosX != null){
      this.x = tangentPosX;
    }
    if (tangentPosY != null){
      this.y = tangentPosY;
    }
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
    this.playerLastXd = player.ctrlVector.x;
    this.playerLastYd = player.ctrlVector.y;
    this.blockable = true;
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    if (sqrt(sq(this.playerLastXd) + sq(this.playerLastYd)) < 0.4){
      return;
    }
    if (target.restrictedLastFrame){
      let newCtrlVector = {x: this.playerLastXd, y: this.playerLastYd};
      let mag = sqrt(sq(newCtrlVector.x) + sq(newCtrlVector.y));
      newCtrlVector.x /= mag;
      newCtrlVector.y /= mag;
      target.ctrlVector.x += newCtrlVector.x;
      target.ctrlVector.y += newCtrlVector.y;
      target.speedMultiplier *= 2;
      return;
    }
    target.ctrlVector = {x: this.playerLastXd, y: this.playerLastYd};
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
    if (player.fullEffectImmunity || player.dead){
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
    this.setAsGhost();
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
    if (player.fullEffectImmunity || player.dead){
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
    this.setAsGhost();
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

class Wavy extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle ?? 0, speed, radius, pal.nm.wavy);
    this.circleSize = 100;
    this.dir = 1;
    this.switchInterval = 800;
    this.switchTime = 0;
    this.angleIncrement = (this.speed + 6) / this.circleSize;
  }
  behavior(area, players) {
    this.switchTime += dTime;
    if (this.switchTime > this.switchInterval) {
      this.dir *= -1;
      this.switchTime %= this.switchInterval;
    }
    this.velToAngle();
    this.angle += this.angleIncrement * this.dir * tFix;
    this.angleToVel();
  }
  wallBounceEvent(wallX, wallY){
    this.dir *= -1;
  }
}

class Zigzag extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.zigzag);
    this.switchInterval = 500;
    this.switchTime = 500;
    this.switchAdd = false;
    this.turnAngle = Math.PI / 2;
  }
  behavior(area, players) {
    this.switchTime += dTime;
    if (this.switchTime > this.switchInterval){
      this.switchTime %= this.switchInterval;
      if (!this.switchAdd) {
        this.velToAngle();
        this.angle -= this.turnAngle
        this.angleToVel();
        this.switchAdd = true;
      } else {
        this.velToAngle();
        this.angle += this.turnAngle
        this.angleToVel();
        this.switchAdd = false;
      }
    }
  }
}

class Zoning extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.zoning);
    this.switchInterval = 1000;
    this.switchTime = Math.random() * this.switchInterval;
    this.turnAngle = Math.PI / 2
    this.turnAngle *= (Math.floor(Math.random() * 2) * 2) - 1
  }
  behavior(area, players) {
    this.switchTime += dTime;
    if (this.switchTime > this.switchInterval){
      this.switchTime %= this.switchInterval;
      this.velToAngle();
      this.angle += this.turnAngle
      this.angleToVel();
    }
  }
}

class Oscillating extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.oscillating);
    this.switchInterval = 1000;
    this.switchTime = 0;
    this.turnAngle = Math.PI;
  }
  behavior(area, players) {
    this.switchTime += dTime;
    if (this.switchTime > this.switchInterval){
      this.switchTime %= this.switchInterval;
      this.velToAngle();
      this.angle += this.turnAngle
      this.angleToVel();
    }
  }
}

class Spiral extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.spiral);
    this.angleIncrement = 0.15;
    this.angleIncrementChange = 0.004;
    this.angleAdd = false;
    this.dir = 1
  }
  behavior(area, players) {
    if (this.angleIncrement < 0.001) {
      this.angleAdd = true;
    } else if (this.angleIncrement > 0.35) {
      this.angleAdd = false;
    }
    if (this.angleIncrement < 0.05) {
      this.angleIncrementChange = 0.0022;
    } else {
      this.angleIncrementChange = 0.004;
    }
    if (this.angleAdd) {
      this.angleIncrement += this.angleIncrementChange * tFix;
    } else {
      this.angleIncrement -= this.angleIncrementChange * tFix;
    }
    this.velToAngle();
    this.angle += this.angleIncrement * this.dir * tFix;
    this.angleToVel();
  }
  wallBounceEvent(wallX, wallY){
    this.dir *= -1;
  }
}

class Switch extends Enemy{
  constructor(x, y, angle, speed, radius, index, switchInterval){
    super(x, y, angle, speed, radius, pal.nm.switch);
    this.switched = false;
    this.switchInterval = switchInterval;
    this.clock = 0;
    if (index % 2 === 0){
      this.switched = true;
    }
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock > this.switchInterval){
      this.switched = !this.switched;
      this.clock %= this.switchInterval;
    }
    if (this.switched){
      this.harmless = true;
      this.alphaMultiplier = 0.5;
    }
  }
}

class Reducing extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.reducing, pal.nmaur.reducing, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new ReducingEnemyEffect());
  }
}

class ReducingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("ReducingEnemyEffect"), false, true);
    this.blockable = true;
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    if (!target.hasOwnProperty("reduction")){
      target.reduction = 0;
    }
    target.reduction += 1 * target.effectVulnerability * (8/30) * tFix;
    target.tempRadius -= target.reduction;
    if (target.tempRadius <= 0){
      target.tempRadius = 0;
      target.die();
    }
    for (var i = 0; i < target.effects.length; i++){
      if (target.effects[i].constructor.name === "ReducingEnemyPostEffect"){
        target.effects.splice(i, 1);
        i--;
      }
    }
  }
  removeEffectLate(target){
    target.gainEffect(new ReducingEnemyPostEffect());
  }
}

class ReducingEnemyPostEffect extends Effect{
  constructor(){
    super(-1, getEffectPriority("ReducingEnemyPostEffect"), false, false);
  }
  doEffect(target){
    for (let i in target.effects){
      if (!target.effects[i].toRemove && target.effects[i].constructor.name === "ReducingEffect"){
        this.toRemove = true;
      }
    }
    if (!target.hasOwnProperty("reduction")) return;
    target.reduction -= 1 * (8/30) * tFix;
    target.tempRadius -= target.reduction;
    if (target.reduction <= 0){
      this.toRemove = true;
    }
  }
}

class Invin extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.barrier, pal.nmaur.barrier, auraSize)
    this.immune = true;
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new InvinEnemyEffect());
  }
}

class InvinEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("InvinEnemyEffect"), false, true);
    this.blockable = true;
  }
  doEffect(target){
    target.invincible = true;
  }
}

class Blocking extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.blocking, pal.nmaur.blocking, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new BlockingEnemyEffect());
  }
}

class BlockingEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("BlockingEnemyEffect"), false, true);
  }
  doEffect(target){
    if (target.fullEffectImmunity){
      return;
    }
    if (!target.hasOwnProperty("blockedEffects")){
      target.blockedEffects = [];
    }
    for (let i in target.effects){
      if (target.effects[i].blockable){
        let noPush = false;
        for (let j in target.blockedEffects){
          if (target.blockedEffects[j].constructor.name === target.effects[i].constructor.name){
            noPush = true;
            break;
          }
        }
        if (noPush){
          continue;
        }
        target.blockedEffects.push(target.effects[i]);
      }
    }
    for (let i in target.blockedEffects){
      let cancelEffect = false;
      for (let j in target.effects){
        if (target.effects[j].constructor.name === target.blockedEffects[i].constructor.name){
          cancelEffect = true;
        }
      }
      if (cancelEffect){
        continue;
      }
      target.gainEffect(target.blockedEffects[i]);
      target.blockedEffects[i].life = 0;
      target.blockedEffects[i].toRemove = false;
    }
  }
  removeEffectLate(target){
    target.blockedEffects = [];
  }
}

class ForceSniperA extends GenericSniper{
  constructor(x, y, angle, speed, radius, loss){
    super(x, y, angle, speed, radius, pal.nm.force_sniper_a, 3000, 600);
    this.loss = loss;
  } 
  createBullet(angle, target, area){
    let bullet = new ForceSniperABullet(this.x, this.y, angle, 16, this.radius / 2, pal.nm.force_sniper_a, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class ForceSniperABullet extends Bullet{
  constructor(x, y, angle, speed, radius, color, loss){
    super(x, y, angle, speed, radius, color);
    this.loss = loss;
    this.inherentlyHarmless = true;
    this.touchedPlayers = [];
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    if (this.touchedPlayers.includes(player)){
      return;
    }
    this.touchedPlayers.push(player);
    player.ability1.attemptUse(player);
  }
}

class ForceSniperB extends GenericSniper{
  constructor(x, y, angle, speed, radius, loss){
    super(x, y, angle, speed, radius, pal.nm.force_sniper_b, 3000, 600);
    this.loss = loss;
  } 
  createBullet(angle, target, area){
    let bullet = new ForceSniperBBullet(this.x, this.y, angle, 16, this.radius / 2, pal.nm.force_sniper_b, this.loss);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class ForceSniperBBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color, loss){
    super(x, y, angle, speed, radius, color);
    this.loss = loss;
    this.inherentlyHarmless = true;
    this.touchedPlayers = [];
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    if (this.touchedPlayers.includes(player)){
      return;
    }
    this.touchedPlayers.push(player);
    player.ability2.attemptUse(player);
  }
}

class ExperienceDrain extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.experience_drain, pal.nmaur.experience_drain, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new ExperienceDrainEffect());
  }
}

class ExperienceDrainEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("ExperienceDrainEffect"), false, true);
    this.blockable = true;
  }
  doEffect(target){
    target.levelProgress -= 2 * target.effectVulnerability * target.level * dTime / 1000;
    if (target.levelProgress < 0){
      target.levelProgressNeeded += abs(target.levelProgress);
      target.levelProgress = 0;
    }
  }
}

class Grass extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.grass);
    this.effect = new IsGrassEffect();
    this.gainEffect(this.effect);
    this.clock = 0;
    this.clockStarted = false;
  }
  playerCollisionEvent(player){
    if (player.dead){
      return;
    }
    if (!this.harmless){
      let hardBehavior = player.region.name.substring(player.region.name.length - 4) == "Hard";
      if (hardBehavior){
        this.reset();
        return; 
      }
      for (let i in player.area.entities){
        if (player.area.entities[i].constructor.name === "Grass"){
          player.area.entities[i].reset();
        }
      }
    } else {
      this.clockStarted = true;
    }
  }
  reset(){
    this.clockStarted = false;
    this.clock = 0;
    this.effect.harmlessState = true;
    this.effect.alphaState = 0.5;
  }
  behavior(area, players){
    if (!this.clockStarted){return;}
    this.clock += dTime;
    this.effect.alphaState = 0.5 + this.clock / 20 / 100;
    if (this.clock > 1000){
      this.effect.harmlessState = false;
    }
  }
}

class IsGrassEffect extends Effect{
  constructor(){
    super(-1, getEffectPriority("IsGrassEffect"), false, true);
    this.harmlessState = true;
    this.alphaState = 0.5;
  }
  doEffect(target){
    target.harmless = this.harmlessState;
    target.alphaMultiplier = this.alphaState;
  }
}

class Flower extends Enemy{
  constructor(x, y, angle, speed, radius, growthMultiplier){
    super(x, y, angle, speed, radius, pal.nm.flower);
    this.growthMultiplier = growthMultiplier;
    this.children = [];
    this.spawned = false;
  }
  behavior(area, players){
    if (this.spawned){
      return;
    }
    this.spawned = true;
    for (let i = 0; i < 5; i++){
      this.spawnPetal(area, i);
    }
  }
  spawnPetal(area, id){
    let p = new FlowerPetal(this.x, this.y, this.baseRadius, id, this, this.growthMultiplier);
    p.parentZone = this.parentZone;
    area.addEnt(p);
  }
}

class FlowerPetal extends Enemy{
  constructor(x, y, r, id, parent, growthMultiplier){
    super(x, y, 0, 0, r, "#e084e8");
    this.renderType = "noOutline";
    this.restricted = false;
    this.z = parent.z - 0.0001;
    
    this.triggerRadius = 150;
    this.radiusRatio = 1;
    this.growthMultiplier = growthMultiplier;
    this.immune = true;
    this.id = id;
    this.parent = parent;
  }
  wallBounce(){
    //disable default behavior (they don't bounce)
  }
  behavior(area, players){
    //literally what could possibly be the correct value for this?
    //ravel's... definitely isn't right. this is close enough i guess
    const growth = (1 / 20) * this.growthMultiplier * 0.6;
    this.radiusMultiplier *= this.parent.radiusMultiplier;
    switch (this.id) {
      case 0: this.setPosition(1, -0.25); break;
      case 1: this.setPosition(-1, -0.25); break;
      case 2: this.setPosition(0, -1); break;
      case 3: this.setPosition(0.6, 0.9); break;
      case 4: this.setPosition(-0.6, 0.9); break;
      default:
        break;
    }
    this.harmless = this.parent.harmless;
    this.alphaMultiplier = this.parent.alphaMultiplier;
    let playerInRange = false;
    for (var i in players){
      if (!players[i].detectable){
        continue;
      }
      if (dst(players[i], this.parent) < players[i].radius + this.triggerRadius + this.parent.radius){
        playerInRange = true;
      }
    }
    if (playerInRange){
      this.radiusRatio -= growth / 2 * tFix;
    } else {
      this.radiusRatio += growth / 2 * tFix;
    }
    if(this.radiusRatio > 1){
      this.radiusRatio = 1;
    }
    this.radiusMultiplier *= max(this.radiusRatio, 0);
  }
  setPosition(x, y){
    this.x = this.parent.x + x * this.radius * this.radiusMultiplier;
    this.y = this.parent.y + y * this.radius * this.radiusMultiplier;
  }
}

class Seedling extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.seedling);
    this.immune = true;
    this.spawned = false;
    this.child = null;
  }
  behavior(area, players){
    if (this.spawned){
      return;
    }
    this.spawned = true;
    this.createChild(area);
  }
  createChild(area){
    let child = new SeedlingProjectile(this.x, this.y, random(0, 2*PI), this.speed, this.radius, this);
    area.addEnt(child);
    this.child = child;
  }
}

class SeedlingProjectile extends Enemy{
  constructor(x, y, angle, speed, radius, parent){
    super(x, y, angle, speed, radius, pal.nm.seedling);
    this.z = parent.z + 0.0001;
    this.parent = parent;
    this.speed = 5;
    this.speedToVel();
    this.restricted = false;
    this.immune = true;
    this.seedOffsetX = 0;
    this.seedOffsetY = -this.radius * 1.5;
    this.dir = this.speed / 30;
    if (random() < 0.5){
      this.dir *= -1;
    }
  }
  wallBounce(){
    //disable default behavior (they don't bounce)
  }
  behavior(area, players){
    this.x = this.parent.x;
    this.y = this.parent.y;
    this.velToAngle();
    this.angle += this.dir * (dTime / 30);
    this.angleToVel();
    this.seedOffsetX = this.xv * this.radius / 3;
    this.seedOffsetY = this.yv * this.radius / 3;
    this.findNewPosition(this.seedOffsetX,this.seedOffsetY);
  }
  findNewPosition(x,y){
    this.x = this.parent.x + x;
    this.y = this.parent.y + y;
  }
}

class FireTrail extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.fire_trail);
    this.clock = 0;
    this.light = radius + 40;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock >= (1000 * (this.radius * 2 * (1/32)) / this.speed)) {
      this.spawnTrail(area);
      this.clock %= (1000 * (this.radius * 2 * (1/32)) / this.speed);
    }
  }
  spawnTrail(area){
    let trail = new FireTrailProjectile(this.x, this.y, 0, 0, this.radius, this);
    trail.parentZone = this.parentZone;
    area.addEnt(trail);
  }
}

class FireTrailProjectile extends Enemy{
  constructor(x, y, angle, speed, radius, parent){
    super(x, y, angle, speed, radius, pal.nm.fire_trail);
    this.alpha = 1;
    this.clock = 0;
    this.z = parent.z - 0.0001;
    this.light = radius + 40;
  }
  behavior(area, players){
    this.clock += dTime;
    if(this.clock >= 1000){
      this.alpha -= dTime / 500;
      if(this.alpha <= 0){this.alpha = 0.001}
    }
    this.alphaMultiplier = this.alpha;
    if(this.clock >= 1500){
      this.toRemove = true;
    }
  }
}

class WindGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.wind_ghost)
    this.setAsGhost();
    this.gravity = 16;
  }
  behavior(area, players){
    for (var i in players){
      if (players[i].fullEffectImmunity) continue;
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        if (player.dead){          
          if ((player.region.properties && player.region.properties.wind_ghosts_do_not_push_while_downed) || (area.properties && area.properties.wind_ghosts_do_not_push_while_downed)){
            continue;
          }
        }
        while (circleCircle(this, players[i]) && !this.disabled) {
          let dx = player.x - this.x;
          let dy = player.y - this.y;
          let dist = dst(player, this);
          let attractionAmplitude = pow(2, -(dist / (this.radius/2)));
          let angleToPlayer = atan2(dy, dx);
          let moveDist = this.gravity * attractionAmplitude;
          player.x += (moveDist * cos(angleToPlayer)) * tFix;
          player.y += (moveDist * sin(angleToPlayer)) * tFix;
          player.area.restrict(player);
        }
      }
    }
  }
}

class WindSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.wind_sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new WindSniperBullet(this.x, this.y, angle, 16, this.radius / 2, pal.nmp.wind_sniper);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class WindSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, angle, speed, radius, color);
    this.inherentlyHarmless = true;
    this.gravity = 16;
  }
  playerCollisionEvent(player){
    if (player.fullEffectImmunity) return;
    while (circleCircle(this, player) && !this.disabled) {
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let dist = dst(player, this);
      let attractionAmplitude = pow(2, -(dist / (this.radius/2)));
      let angleToPlayer = atan2(dy, dx);
      let moveDist = this.gravity * attractionAmplitude;
      player.x += (moveDist * cos(angleToPlayer)) * tFix;
      player.y += (moveDist * sin(angleToPlayer)) * tFix;
      player.area.restrict(player);
    }
  }
}

class Radar extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.radar, pal.nmaur.radar, auraSize)
    this.releaseTime = 250;
    this.clock = Math.random() * this.releaseTime;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.disabled) return;
    if (this.clock > this.releaseTime) {
      let min = this.auraSize;
      let index;
      for (var i in players) {
        const player = players[i]
        if (abs(player.xv) < 0.1 && abs(player.yv) < 0.1){
          continue;
        }
        if (dst(this, player) < min) {
          min = dst(this, player);
          index = i;
        }
      }
      if (index != undefined && players[index].detectable) {
        let p = players[index];
        var dX = p.x - this.x;
        var dY = p.y - this.y;
        let r = new RadarBullet(this.x, this.y, atan2(dY, dX), this.speed + 5, this.radius / 3, pal.nm.radar, this);
        r.parentZone = this.parentZone;
        area.addEnt(r);
        this.clock = 0;
      }
    }
  }
}

class RadarBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color, parent){
    super(x, y, angle, speed, radius, color);
    this.parent = parent;
  }
  behavior(area, players){
    if (dst(this, this.parent) > this.parent.auraSize){
      this.toRemove = true;
    }
  }
}

class Quicksand extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize, dir, strength){
    super(x, y, angle, speed, radius, pal.nm.quicksand, pal.nmaur.quicksand, auraSize)
    this.dir = dir * (PI/180);
    if (isNaN(this.dir)){
      this.dir = floor(random(0, 2*PI) / (PI/2)) * PI/2;
    }
    this.strength = strength;
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new QuicksandEnemyEffect(this.dir, this.strength));
  }
}

class QuicksandEnemyEffect extends Effect{
  constructor(direction, strength){
    super(0, getEffectPriority("QuicksandEnemyEffect"), false, true);
    this.direction = direction;
    this.strength = strength;
    this.blockable = true;
  }
  doEffect(target){
    target.x += cos(this.direction) * this.strength * tFix * target.effectVulnerability;
    target.y += sin(this.direction) * this.strength * tFix * target.effectVulnerability;
  }
}

class Sand extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.sand);
    this.friction = 1;
  }
  behavior(area, players){
    this.friction += dTime / 1000;
    if(this.friction>3){
      this.friction = 3;
    }
    this.xv = this.speedMultiplier * this.speed * cos(this.angle) * this.friction;
    this.yv = this.speedMultiplier * this.speed * sin(this.angle) * this.friction;
  }
  wallBounceEvent(wallX, wallY){
    this.friction = 0;
  }
}

class SandRock extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.sandrock);
    this.friction = 1;
    this.minFriction = 0.1;
  }
  behavior(area, players){
    this.friction -= dTime / 3000;
    if(this.friction < this.minFriction){
      this.friction = this.minFriction;
    }
    this.xv = this.speedMultiplier * this.speed * cos(this.angle) * this.friction;
    this.yv = this.speedMultiplier * this.speed * sin(this.angle) * this.friction;
  }
  wallBounceEvent(wallX, wallY){
    this.friction = 1;
  }
}

class Crumbling extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.crumbling);
    this.area = null;
    this.staticSpeed = speed;
    this.staticRadius = radius;
    this.clock = 3001;
  }
  behavior(area, players){
    this.clock += dTime;
    this.area = area;
    if (this.clock > 3000 && this.baseRadius !== this.staticRadius){
      this.baseRadius += tFix * this.staticRadius / 2 / 2000 * 30;
      if (this.baseRadius > this.staticRadius){
        this.baseRadius = this.staticRadius;
      }
      this.speed = this.staticSpeed;
      this.speedToVel();
    }
  }
  tryCollision(){
    if (this.clock > 3000){
      let r = new Residue(this.x, this.y, random() * 2 * PI, this.staticSpeed / 3, this.staticRadius / 3);
      r.parentZone = this.parentZone;
      this.area.addEnt(r);
      this.clock = 0;
      this.baseRadius = this.staticRadius / 2;
      this.velToAngle();
      this.speed = this.staticSpeed / 2;
      this.speedToVel();
    }
  }
  wallBounceEvent(wallX, wallY){
    this.tryCollision();
  }
}

class Residue extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.residue);
    this.clock = 0;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock > 3000){
      this.toRemove = true;
    }
  }
}

class MagneticReduction extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.magnetic_reduction, pal.nmaur.magnetic_reduction, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new MagneticReductionEnemyEffect());
  }
}

class MagneticReductionEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("MagneticReductionEnemyEffect"), false, true);
    this.blockable = true;
  }
  doEffect(target){
    if (!(target.magnetism || target.partialMagnetism)) return;
    target.magneticSpeedMultiplier *= (1 - target.effectVulnerability * 0.5);
  }
}

class MagneticNullification extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraSize){
    super(x, y, angle, speed, radius, pal.nm.magnetic_nullification, pal.nmaur.magnetic_nullification, auraSize)
  }
  applyAuraEffectToPlayer(area, players, player){
    player.gainEffect(new MagneticNullificationEnemyEffect());
  }
}

class MagneticNullificationEnemyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("MagneticNullificationEnemyEffect"), false, true);
    this.blockable = true;
  }
  doEffect(target){
    if (!(target.magnetism || target.partialMagnetism)) return;
    target.magneticSpeedMultiplier *= (1 - target.effectVulnerability);
  }
}

class PositiveMagneticSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.positive_magnetic_sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new PositiveMagneticSniperBullet(this.x, this.y, angle, 16, 10, pal.nmp.positive_magnetic_sniper);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class PositiveMagneticSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, angle, speed, radius, color);
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    if (!(player.magnetism || player.partialMagnetism)){
      this.toRemove = true;
      return;
    }
    if (player.fullEffectImmunity){
      this.toRemove = true;
      return;
    }
    player.ability3 = new MagnetismUp();
    player.magnetismDirection = -1;
    this.toRemove = true;
  }
}

class NegativeMagneticSniper extends GenericSniper{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.negative_magnetic_sniper, 3000, 600);
  } 
  createBullet(angle, target, area){
    let bullet = new NegativeMagneticSniperBullet(this.x, this.y, angle, 16, 10, pal.nmp.negative_magnetic_sniper);
    bullet.parentZone = this.parentZone;
    area.addEnt(bullet);
  }
}

class NegativeMagneticSniperBullet extends Bullet{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, angle, speed, radius, color);
    this.inherentlyHarmless = true;
  }
  playerCollisionEvent(player){
    if (player.ignoreBullets){
      return;
    }
    if (!(player.magnetism || player.partialMagnetism)){
      this.toRemove = true;
      return;
    }
    if (player.fullEffectImmunity){
      this.toRemove = true;
      return;
    }
    player.ability3 = new MagnetismDown()
    player.magnetismDirection = 1;
    this.toRemove = true;
  }
}

class PositiveMagneticGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.positive_magnetic_ghost)
    this.setAsGhost();
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        if (player.fullEffectImmunity){
          continue;
        }
        player.ability3 = new MagnetismUp();
        player.magnetismDirection = -1;
      }
    }
  }
}

class NegativeMagneticGhost extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.negative_magnetic_ghost)
    this.setAsGhost();
  }
  behavior(area, players){
    for (var i in players){
      if (circleCircle(this, players[i]) && !this.disabled){
        let player = players[i];
        if (player.fullEffectImmunity){
          continue;
        }
        player.ability3 = new MagnetismDown();
        player.magnetismDirection = 1;
      }
    }
  }
}


class Cactus extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.cactus);
    this.inherentlyHarmless = true;
    this.pushTime = 200;
    this.staticRadius = radius;
  }
  behavior(area, players){
    this.baseRadius += tFix * this.staticRadius / 2 / 2000 * 30;
    if(this.baseRadius > this.staticRadius) this.baseRadius = this.staticRadius;
    for (let i in players){
      if (circleCircle(this, players[i]) && !players[i].invincible) {
        players[i].gainEffect(new CactusKnockbackEffect(this, this.pushTime, this.radius * 8 + 50))
        this.baseRadius = this.staticRadius / 2;
      }
    }
  }
}

class CactusKnockbackEffect extends Effect{
  constructor(enemy, pushTime, enemyRadius){
    super(-1, getEffectPriority("CactusKnockbackEffect"), true, true);
    this.pushTime = pushTime;
    this.enemy = enemy;
    this.enemyRadius = enemyRadius;
  }
  gainEffect(target){
    let dist = dst(target, this.enemy) - target.radius;
    let distRemaining = this.enemyRadius - dist;
    let angle = Math.atan2(this.enemy.y - target.y, this.enemy.x - target.x) - Math.PI;
    let yRemaining = Math.sin(angle) * distRemaining;
    let xRemaining = Math.cos(angle) * distRemaining;
    let ticksUntilFinished = this.pushTime / tFix;
    this.knockbackX = xRemaining / ticksUntilFinished;
    this.knockbackY = yRemaining / ticksUntilFinished;
    this.multiplier = target.effectVulnerability;
    this.knockbackX *= 32;
    this.knockbackY *= 32;
  }
  doEffect(target){
    if (this.pushTime > 0){
      target.x += this.knockbackX * this.multiplier;
      target.y += this.knockbackY * this.multiplier;
      this.pushTime -= dTime;
      if (this.multiplier > 0){
        this.multiplier -= 0.17 * tFix;
      }
      if (this.multiplier < 0) this.multiplier = 0;
    } else if (this.pushTime < 0){
      this.pushTime = 0;
      this.toRemove = true;
    }
  }
}

class Snowman extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.snowman);
    this.hasCollided = false;
    this.collideTime = 0;
    this.crumbleSize = 1;
    this.crumbleSizeShrink = 1;
    this.pauseTime = 1600;
    this.bonusLight = 60;
  }
  wallBounceEvent(wallX, wallY, tangentPosX, tangentPosY){
    if (!this.hasCollided){
      this.hasCollided = true;
      this.crumbleSizeShrink = this.crumbleSize;
      this.speedMultiplier *= 0;
    }
  }
  behavior(area, players){
    if (this.hasCollided){
      this.collideTime += dTime;
      this.speedMultiplier *= 0;
      this.crumbleSize = (this.crumbleSizeShrink - 1) * cos((PI * min(this.collideTime, 600)) / 1200) ** 3 + 1;
    }
    if (this.collideTime >= this.pauseTime && this.hasCollided){
      this.hasCollided = false;
      this.collideTime = 0;
    }
    if (!this.hasCollided){
      if (this.crumbleSize < 3) {
        //this.crumbleSize += (0.05 * dTime) / (1e3 / 30);
        this.crumbleSize += 0.05 * tFix;
      } else {
        this.crumbleSize = 3;
      }
    }
    this.radiusMultiplier *= this.crumbleSize;
    this.light = this.radiusMultiplier * this.radius + this.bonusLight;
  }
}




class Glowy extends Enemy{
  constructor(x, y, angle, speed, radius, color = pal.nm.glowy){
    super(x, y, angle, speed, radius, color);
    this.stateDuration = 500;
    this.brightness = 1;
    this.fading = true;
    this.clock = this.stateDuration;
    this.fadeSpeed = 0.06;
  }
  behavior(area, players){
    this.light = 3 * this.radius * this.brightness;
    if (this.fading && this.clock <= 0){
      this.brightness -= this.fadeSpeed * tFix;
      if (this.brightness <= 0){
        this.brightness = 0;
        this.fading = false;
        this.clock = this.stateDuration;
      }
    } else if (!this.mode && this.clock <= 0){
      this.brightness += this.fadeSpeed * tFix;
      if (this.brightness >= 1){
        this.brigthness = 1;
        this.fading = true;
        this.clock = this.stateDuration;
      }
    }
    if (this.clock > 0){
      this.clock -= dTime;
    }
    this.alphaMultiplier *= this.brightness
  }
}
class Firefly extends Glowy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.firefly);
    this.brightness = Math.random();
  }
}



class Mist extends Enemy{
  constructor(x, y, angle, speed, radius, color = pal.nm.mist){
    super(x, y, angle, speed, radius, color);
    this.brightness = 1;
    this.inProximity = true;
    this.detectionRadius = 200;
    this.fadeSpeed = 0.05;
  }
  playerValid(player){
    return !player.detectable;
  }
  behavior(area, players){
    this.light = 3 * this.radius * this.brightness;
    
    this.inProximity = false;
    for (let i in players){
      if (this.playerValid(players[i])) continue;
      if (dst(players[i], this) < this.detectionRadius + players[i].getRadius()){
        this.inProximity = true;
      }
    }
    
    this.determineFade();
    this.alphaMultiplier *= this.brightness;
  }
  determineFade(){
    if (this.inProximity){
      this.brightness -= this.fadeSpeed * tFix;
      if (this.brightness <= 0) this.brightness = 0;
    } else {
      this.brightness += this.fadeSpeed * tFix;
      if (this.brightness >= 1) this.brightness = 1;
    }
  }
}
class Phantom extends Mist{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.phantom);
    this.brightness = 0;
  }
  determineFade(){
    if (!this.inProximity){
      this.brightness -= this.fadeSpeed * tFix;
      if (this.brightness <= 0) this.brightness = 0;
    } else {
      this.brightness += this.fadeSpeed * tFix;
      if (this.brightness >= 1) this.brightness = 1;
    }
  }
  playerValid(player){
    return !player.detectable && !player.hasEffect("SafeZoneEffect");
  }
}

class FakePumpkin extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, 0, radius, pal.nm.fake_pumpkin);
    this.z = z.fakePumpkin;
    this.renderType = "imageOutline";
    this.image = "ent.pumpkin_off"
    this.inherentlyHarmless = true;
  }
}

class Pumpkin extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.pumpkin);
    this.initialZ = this.z;
    this.z = z.fakePumpkin
    this.renderType = "imageOutline";
    this.image = "ent.pumpkin_off"

    this.staticXv = this.xv;
    this.staticYv = this.yv;
    this.nextAngle = 0;
    this.clock = 0;
    this.nextAngleDetected = false;
    this.staticSpeed = speed;

    this.active = false;
    this.activationRange = 240;

    this.target = null;
  }
  getTarget(players){
    let min = 99999;
    let player;
    for (let i in players){
      if (!players[i].detectable) continue;
      if (dst(this, players[i]) < min){
        player = players[i];
      }
    }
    return player;
  }
  behavior(area, players){
    this.z = this.image === "ent.pumpkin_on" ? this.initialZ : z.fakePumpkin;
    if (!this.active){
      this.speedMultiplier = 0;
      this.light = 0;
      this.harmless = true;
    }
    let min = this.activationRange;
    let index;
    for (let i in players){
      if (!players[i].detectable) continue;
      if (dst(this, players[i]) < min){
        min = dst(this, players[i]);
        index = i;
        this.target = players[i];
      }
    }
    if (index){
      this.image = "ent.pumpkin_on";
      this.active = true;
    }
    if (this.active){
      this.light = this.tempRadius * this.radiusMultiplier + 30;
      this.clock += dTime;
      if (this.clock > 3000){
        this.image = "ent.pumpkin_off";
        this.nextAngleDetected = false;
        this.clock = 0;
        this.active = false;
      }
      if (this.clock < 1000){
        let ang = Math.random();
        this.xv = Math.cos(ang * PI * 2) * 4;
        this.yv = Math.sin(ang * PI * 2) * 4;
      } else {
        if (!this.nextAngleDetected){
          //???
          //do pumpkins always target the original player they were activated by,
          //or do they just go towards the nearest player if their original target
          //is out of range? well, commenting this line of code makes them always
          //target the original player, so that is what will stay in-game until
          //i do more testing to figure out what the vanilla behavior is.
          //this.target = this.getTarget(players);
          if (!this.target) return;
          this.nextAngle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
          this.nextAngleDetected = true;
          this.xv = Math.cos(this.nextAngle) * this.staticSpeed;
          this.yv = Math.sin(this.nextAngle) * this.staticSpeed;
        }
      }
    }
  }
}

class Tree extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.tree);
    this.staticSpeed = speed;
    this.releaseTime = 4000;
    this.clock = Math.random() * 3500;
    this.clock2 = Math.random() * 500;
    this.clock3 = 0;
    this.waiting = true;
    this.shake = false;
    this.currentXv = this.xv;
    this.currentYv = this.yv;
    this.preShakeXv = this.xv;
    this.preShakeYv = this.yv;
  }
  behavior(area, players){
    this.clock += dTime;
    this.clock2 += dTime;
    this.clock3 += dTime;
    if (this.clock > this.releaseTime){
      this.spawnBullets(area);
      this.clock %= this.releaseTime;
      this.xv = this.preShakeXv;
      this.yv = this.preShakeYv;
      this.shake = false;
    }
    if (this.xv !== 0 && this.yv !== 0){
      this.currentXv = this.xv;
      this.currentYv = this.yv;
    }
    if (this.clock2 > 500){
      this.waiting = !this.waiting;
      this.clock2 %= 500;
    }
    if (this.clock > 3500){
      if (!this.shake){
        this.preShakeXv = this.currentXv;
        this.preShakeYv = this.currentYv
      }
      this.shake = true;
      if (this.clock3 > 50){
        this.xv = -this.currentXv;
        this.yv = -this.currentYv;
        this.clock3 = 0;
      }
    } else if (this.waiting){
      this.xv = 0;
      this.yv = 0;
    } else {
      this.xv = this.currentXv;
      this.yv = this.currentYv;
      let deg = (this.clock2 / 5 + 90) * Math.PI / 180;
      this.speedMultiplier = Math.abs(Math.sin(deg));
      if (this.speedMultiplier > 1.5) this.speedMultiplier = 1.5;
    }
    this.xv *= this.speedMultiplier * this.xSpeedMultiplier;
    this.yv *= this.speedMultiplier * this.ySpeedMultiplier;
  }
  spawnBullets(area){
    if (this.disabled) return;
    let count = Math.floor(Math.random() * 6) + 2;
    for (let i = 0; i < count; i++) {
      let tb = new TreeBullet(this.x, this.y, i * Math.PI / (count / 2));
      this.spawnBullet(tb);
    }
  }
}

class TreeBullet extends Bullet{
  constructor(x, y, angle){
    super(x, y, angle, 6, 12, "#035b12", 2000);
    this.dir = 6 / 150;
  }
  behavior(area, players) {
    this.velToAngle();
    this.angle += this.dir * tFix;
    this.angleToVel();
  }
}

class Cycling extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.cycling);
    this.changed = false;
    this.changeInterval = 3000;
    this.clock = 0;
    this.enemyTypes = [
      "normal",
      "homing",
      "slowing",
      "draining",
      "sizing",
      "freezing",
      "disabling",
      "enlarging",
      "immune",
      "corrosive",
      "toxic",
    ]
    this.self;
    this.baseRadius = radius;
    this.baseSpeed = speed;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock > this.changeInterval){
      this.clock %= this.changeInterval;
      this.changed = true;
      try {
        this.self.toRemove = true;
        this.x = this.self.x;
        this.y = this.self.y;
        this.angle = this.self.angle;
      } catch (error) {

      }
      this.angleToVel();
      this.self = getEnemyFromSpawner(this.x, this.y, this.angle, random(this.enemyTypes), {radius: this.baseRadius, speed: this.baseSpeed}, 0, this.parentZone);
      this.self.parentZone = this.parentZone;
      area.addEnt(this.self);
    }
    if (this.changed){

    }
  }
  draw(){
    if (!this.changed){
      super.draw();
    }
  }
}

class Lunging extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.lunging);
    this.baseSpeed = speed;
    this.resetParams();

    this.baseR = this.color.r;
    this.baseG = this.color.g;
    this.baseB = this.color.b;

    //estimated color
    this.heatedR = 240;
    this.heatedG = 10;
    this.heatedB = 0;

    this.t = 0;
  }
  resetParams(){
    this.lungeSpeed = this.baseSpeed;
    this.normalSpeed = 0;
    this.timeToLunge = 1500;
    this.lungeTimer = 0;
    this.maxLungeTime = 2000;
    this.timeDuringLunge = 0;
    this.lungeCooldownMax = 500;
    this.lungeCooldownTimer = 0;
    this.baseSpeed = 0;
    this.computeSpeed();

    this.coolSpeed = 0.03;
    this.heatSpeed = 0.015;

    this.heating = false;
  }
  computeSpeed(){
    this.xv = Math.cos(this.angle) * this.baseSpeed;
    this.yv = Math.sin(this.angle) * this.baseSpeed;
  }
  behavior(area, players){
    this.heating = false;
    this.color = lerpCol({r: this.baseR, g: this.baseG, b: this.baseB}, this.t, this.heatedR, this.heatedG, this.heatedB);
    let closestPlayerIndex = undefined;
    let closestPlayer = undefined;
    let closestDistanceSquared = undefined;
    let min = 250;
    let dx;
    let dy;
    for (let i in players){
      if (players[i].detectable && dst(players[i], this) < min){
        min = dst(players[i], this);
        closestPlayerIndex = i;
        closestPlayer = players[i];
        dx = closestPlayer.x - this.x;
        dy = closestPlayer.y - this.y;
        closestDistanceSquared = dx ** 2 + dy ** 2;
      }
    }
    if (this.timeDuringLunge > 0){
      if (this.timeDuringLunge >= this.maxLungeTime){
        this.timeDuringLunge = 0;
        this.lungeCooldownTimer = 1;
        this.baseSpeed = this.normalSpeed;
        this.computeSpeed();
      } else {
        this.timeDuringLunge += dTime;
        this.baseSpeed = this.lungeSpeed * (1 - this.timeDuringLunge / this.maxLungeTime);
        this.computeSpeed();
      }
    }
    if (this.lungeCooldownTimer > 0){
      if (this.lungeCooldownTimer > this.lungeCooldownMax){
        this.lungeCooldownTimer = 0;
      } else {
        this.lungeCooldownTimer += dTime;
      }
    } else {
      let lungeTimeRatio = this.lungeTimer / this.timeToLunge;
      if (closestPlayer != undefined){
        let targetAngle = Math.atan2(dy, dx) + Math.random() * PI/8 - PI/16;
        if (this.timeDuringLunge === 0){
          this.lungeTimer += dTime;
          this.heating = true;
          this.t += tFix * this.heatSpeed;
          this.t = Math.min(this.t, 1);
          if (this.lungeTimer >= this.timeToLunge){
            this.lungeTimer = 0;
            this.timeDuringLunge = 1;
            this.baseSpeed = this.lungeSpeed;
            this.angle = targetAngle;
            this.computeSpeed();
          }
        }
      } else {
        if (this.lungeTimer > 0){
          this.lungeTimer -= dTime;
        }
        if (this.lungeTimer < 0){
          this.lungeTimer = 0;
        }
      }
      if (lungeTimeRatio > 0.75){
        this.x -= 2 * tFix * (Math.random() < 0.5) ? 1 : -1;
        this.y -= 2 * tFix * (Math.random() < 0.5) ? 1 : -1;
      }
    }
    if (!this.heating){
      this.t -= tFix * this.coolSpeed;
      this.t = Math.max(this.t, 0);
    }
  }
}

class Stalactite extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.stalactite);
    this.onWall = true;
    this.clock = 0;
  }
  behavior(area, players){
    if (this.onWall){
      if (this.clock === 0) this.makeBullet(area);
      this.clock += dTime;
      if (this.clock > 1000){
        this.onWall = false;
        this.clock = 0;
      } else {
        this.speedMultiplier = 0;
      }
    }
  }
  wallBounceEvent(){
    this.onWall = true;
  }
  makeBullet(area){
    this.spawnBullet(new StalactiteProjectile(this.x, this.y, this.radius / 2));
  }
}

class StalactiteProjectile extends Bullet{
  constructor(x, y, radius){
    super(x, y, random() * 2 * PI, 3, radius, "#614c37", 1500);
    this.immune = false;
    this.interactAsBullet = false;
    this.fadeStart = 1000
    this.renderType = "outline";
  }
  behavior(area, players){
    if (this.clock > this.fadeStart){
      this.alphaMultiplier = map(this.clock, this.fadeStart, 1500, 1, 0);
    }
  }
  //override default bullet wallbounce behavior
  wallBounceEvent(wallX, wallY){}
}

// class FrostGiant extends Enemy{
//   constructor(x, y, angle, speed, radius, direction, turn_speed, shot_interval, cone_angle, pause_interval, pause_duration, turn_acceleration, shot_acceleration, pattern, immune, projectile_duration, projectile_radius, projectile_speed){
//     super(x, y, angle, speed, radius, pal.nm.frost_giant);
//     this.direction = direction;
//     this.turn_speed = turn_speed * (PI/180);
//     this.shot_interval = shot_interval;
//     this.cone_angle = cone_angle * (PI/180);
//     this.pause_interval = pause_interval;
//     this.pause_duration = pause_duration;
//     this.turn_acceleration = turn_acceleration * (PI/180);
//     this.shot_acceleration = shot_acceleration;
//     this.pattern = pattern;
//     this.immune = immune;
//     this.projectile_duration = projectile_duration;
//     this.projectile_radius = projectile_radius;
//     this.projectile_speed = projectile_speed;
//   }
// }

// class Charging extends Enemy{
//   constructor(x, y, angle, speed, radius){
//     super(x, y, angle, speed, radius, pal.nm.charging);
//     this.chargingSpeed = 1;
//   }
// }