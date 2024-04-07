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
        return;
      }
    }
  }
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