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
  }
  apply(target){
    this.doEffect(target);
    if (!this.noDuration){
      this.life -= dTime;
      if (this.life < 0){
        this.toRemove = true;
        this.removeEffect(target);
        return;
      }
    }
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
    target.tempColor.a = 80;
    target.canRevivePlayers = false;
    target.detectable = false;
  }
  removeEffect(target){
    target.revive();
    if (settings.instantRespawn){
      target.x = target.mostRecentSafeZone.x + target.mostRecentSafeZone.width / 2;
      target.y = target.mostRecentSafeZone.y + target.mostRecentSafeZone.height / 2;
    }
  }
}