class Nexus extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.nexus, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Morfe";
    this.ability1 = new Barrier();
    this.ability2 = new Stream();
  }
}

class Barrier extends Ability{
  constructor(){
    super(5, 10000, 30, im.ab.barrier);
    this.durations = [2500, 2700, 2900, 3100, 3300];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let barrier = new BarrierProjectile(player.x, player.y, area, player, [], this.durations[this.tier - 1]);
    area.addEnt(barrier);
  }
}

class BarrierProjectile extends Projectile{
  constructor(x, y, area, player, entitiesAffectedByAbility = [], lifetime){
    super(x, y, 0, 0, lifetime, -1, 170, pal.hero.nexus, area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline", 0, false);
    this.ignorePreviousTargets = false;
    this.clock = 0;
    this.maxLifetime = lifetime;
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.gainEffect(new BarrierEffect());
  }
  behavior(area, players){
    this.clock += dTime;
    let t = this.clock/this.maxLifetime;
    this.alphaMultiplier = 0.7 - 0.7 * t;
  }
}

class BarrierEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("BarrierEffect"), false);
  }
  doEffect(target){
    target.invincible = true;
  }
}

class Stream extends Ability{
  constructor(){
    super(5, 2000, 5, im.ab.stream);
    this.duration = 12000;
    this.speedBoosts = [0, 1.25, 2.5, 3.75, 5];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let barrier = new StreamProjectile(player.x, player.y, area, player, [], this.duration, this.speedBoosts[this.tier - 1]);
    area.addEnt(barrier);
  }
}

class StreamProjectile extends Projectile{
  constructor(x, y, area, player, entitiesAffectedByAbility = [], lifetime, speedBoost){
    super(x, y, 0, 0, lifetime, -1, 300, pal.hero.nexus, area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline", 0, false);
    this.ignorePreviousTargets = false;
    this.clock = 0;
    this.player = player;
    this.maxLifetime = lifetime;
    this.speedBoost = speedBoost;
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.gainEffect(new StreamEffect(this.speedBoost, this.player));
  }
  behavior(area, players){
    this.clock += dTime;
    let t = this.clock/this.maxLifetime;
    this.alphaMultiplier = 0.7 - 0.7 * t;
  }
}

class StreamEffect extends Effect{
  constructor(speedBoost, player){
    super(0, getEffectPriority("StreamEffect"), false);
    this.player = player;
    this.speedBoost = speedBoost;
  }
  doEffect(target){
    if (target === this.player){
      target.tempSpeed += this.speedBoost;
    }
    target.tempMinEnergy = -target.maxEnergy;
    if (target.speedMultiplier === 0){
      return;
    }
    target.speedMultiplier = max(target.speedMultiplier, 1);
  }
}
