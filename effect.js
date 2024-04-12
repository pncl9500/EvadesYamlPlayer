class Effect{
  constructor(duration, priority, allowDuplicates = false){
    this.duration = duration;
    this.life = duration;
    this.noDuration = false;
    if (this.duration < 0){
      this.noDuration = true;
    }
    this.priority = priority;
    this.allowDuplicates = allowDuplicates;
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
  removeEffect(){

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
    super(duration, 0, false)
    this.minSpeed = minSpeed;
  }
  doEffect(target){
    target.tempSpeed = Math.max(target.tempSpeed, this.minSpeed);
  }
}

class SafeZoneEffect extends Effect{
  constructor(duration = 0){
    super(duration, 0, false)
  }
  doEffect(target){
    target.invincibility = true;
    target.corrosiveBypass = true;
  }
}

class DeadEffect extends Effect{
  constructor(duration = 0){
    super(duration, 1024, false)
  }
  doEffect(target){
    target.speedMultiplier = 0;
    target.tempColor.a = 80;
    target.canRevivePlayers = false;
  }
  removeEffect(target){
    target.revive();
  }
}