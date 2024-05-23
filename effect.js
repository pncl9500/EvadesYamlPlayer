class Effect{
  constructor(duration, priority, allowDuplicates = false, refreshable = true){
    this.name = this.constructor.name;
    this.duration = duration;
    this.life = duration;
    this.noDuration = false;
    if (this.duration < 0){
      this.noDuration = true;
    }
    this.priority = priority;
    this.allowDuplicates = allowDuplicates;
    this.refreshable = refreshable;
    this.overrideEnemyImmunity = false;
    this.toRemove = false;
    this.blockable = false;
    this.removedOnDeath = false;
  }
  apply(target){
    if (this.toRemove){
      //return;
    }
    this.doEffect(target);
    if (!this.noDuration){
      this.life -= dTime;
      if (this.life < 0){
        this.toRemove = true;
        return;
      }
    }
  }
  playerEnemyContact(target, contactedEnemy){
    
  }
  applyBeforeAbilities(target){
    this.doEffectBeforeAbilities(target);
  }
  doEffectBeforeAbilities(target){

  }
  doEffect(target){

  }
  removeEffect(){

  }
  gainEffect(){

  }
  removeEffectLate(target){
    
  }
}

function getEntsInRadius(targetArray, x, y, radius){
  let r = [];
  for (let i in targetArray){
    if (circleCircle(targetArray[i], {x: x, y: y, r: radius})){
      r.push(targetArray[i]);
    }
  }
  return r;
}

class MinimumSpeedZoneEffect extends Effect{
  constructor(minSpeed, duration = 0){
    super(duration, getEffectPriority("MinimumSpeedZoneEffect"), false)
    this.minSpeed = minSpeed;
  }
  doEffect(target){
    if (target.speed < 0){
      return;
    }
    target.tempSpeed = Math.max(target.tempSpeed, this.minSpeed);
  }
}

class SafeZoneEffect extends Effect{
  constructor(duration = 0){
    super(duration, getEffectPriority("SafeZoneEffect"), false)
  }
  doEffectBeforeAbilities(target){
    target.invincible = true;
    target.corrosiveBypass = true;
    target.effectVulnerability = 0;
    target.fullEffectImmunity = true;
    target.detectable = false;
  }
}

class DeadEffect extends Effect{
  constructor(duration = 0){
    super(duration, getEffectPriority("DeadEffect"), false)
  }
  doEffect(target){
    target.speedMultiplier = 0;
    target.alphaMultiplier = 0.3;
    target.canRevivePlayers = false;
    target.detectable = false;
    if (settings.infiniteDeathTimer){
      this.life += dTime;
    }
  }
  removeEffect(target){
    if (settings.removeDeadPlayers && !target.isMain){
      target.removeSelf();
      return;
    }
    target.revive();
    if (settings.instantRespawn && target.isMain && this.life <= 0){
      target.x = target.mostRecentSafeZone.x + target.mostRecentSafeZone.width / 2;
      target.y = target.mostRecentSafeZone.y + target.mostRecentSafeZone.height / 2;
    }
  }
}


class CancelMagnetismEffect extends Effect{
  constructor(duration = 0){
    super(duration, getEffectPriority("SafeZoneEffect"), false)
  }
  doEffectBeforeAbilities(target){
    target.magnetism = false;
    target.partialMagnetism = false;
  }
}