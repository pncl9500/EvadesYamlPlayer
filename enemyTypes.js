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
    super(0, effectPriorities.SlowingEnemyEffect, false, true);
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
    super(0, effectPriorities.FreezingEnemyEffect, false, true);
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
    super(0, effectPriorities.DrainingEnemyEffect, false, true);
  }
  doEffect(target){
    let newEnergy = target.energy - 15 * target.effectVulnerability * tFix * (1/30);
    console.log(newEnergy)
    if (newEnergy < 0){
      console.log("TO LOWWWWWWW")
      target.energy = Math.min(target.energy, 0);
    } else {
      target.energy = newEnergy;
    }
  }
}