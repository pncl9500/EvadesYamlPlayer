class Nov extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.nov, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Nov";
    this.ability1 = new Eclipse();
    this.ability2 = new Remain();
    this.pelletsOnDeath = 0;
    this.storedPellets = 0;
    this.maxStoredPellets = 0;
    this.remainSpeedMultiplier = 0;
    this.remainActive = false;
    this.remainPool = {};
  }
  rechargePelletBasedAbilities(pelletMultiplier){
    super.rechargePelletBasedAbilities(pelletMultiplier);
    if (this.dead) return;
    this.storedPellets += pelletMultiplier;
    this.storedPellets = min(this.maxStoredPellets, this.storedPellets);
  }
  die(){
    if (this.dead) return;
    if (this.storedPellets > 0){
      this.remainPool = new RemainPool(this.x, this.y, this.remainSpeedMultiplier, this.radius + this.storedPellets * 5, this.area, this);
      this.area.addEnt(this.remainPool);
    }
    this.pelletsOnDeath = this.storedPellets;
    this.storedPellets = 0;
    super.die();
  }
  revive(){
    this.remainPool.toRemove = true;
    super.revive();
  }
  instantRespawnAppropriate(){
    //when is instant respawn appropriate?
    //if nov has no pellets
    if (this.pelletsOnDeath === 0) return true;
    return false;
  }
  behavior(){
    let toRevive = true;
    let potentialRevivalEntityTypes = [
      "RemainPool",
      "EclipseProjectile",
    ]
    for (let i in this.area.entities){
      if (potentialRevivalEntityTypes.includes(this.area.entities[i].constructor.name)){
        toRevive = false;
      }
    }
    if (settings.instantRespawn && this.deathEffect && toRevive){
      this.x = this.mostRecentSafeZone.x + this.mostRecentSafeZone.width / 2;
      this.y = this.mostRecentSafeZone.y + this.mostRecentSafeZone.height / 2;
      this.revive();
    }
  }
}

class RemainPool extends Projectile{
  constructor(x, y, mult, radius, area, player){
    super(x, y, 0, 0, -1, -1, radius, "#00000020", area, player, z.genericProjectile, [], "noOutline", 0, false);
    this.mult = mult;
    this.renderOnMinimap = false;
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    if (!this.player.remainActive) return;
    let speedMul = this.player.remainSpeedMultiplier;
    player.gainEffect(new RemainEffect(speedMul));
  }
}

class Eclipse extends Ability{
  constructor(){
    super(5, 3500, 20, "ab.eclipse");
    this.pelletLimits = [3, 6, 9, 12, 15];
    this.aura = new LockedAura({x: 0, y: 0}, 0, "#00000020", z.genericAura + random() * z.randEpsilon);
    this.usableWhileDead = true;
  }
  useConditionSatisfied(player){
    return player.storedPellets > 0 || (player.dead && player.pelletsOnDeath > 0);
  }
  upgradeBehavior(player){
    if (!player.dead) this.aura.parent = player;
    if (!player.auras.includes(this.aura)){
      player.addAura(this.aura);
    }
    player.maxStoredPellets = this.pelletLimits[this.tier - 1]
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier < 1) return;
    this.aura.radius = player.baseRadius + player.storedPellets * 5;
    if (player.storedPellets === 0) return;
    for (let i in players){
      console.log(this.aura);
      this.aura.tempRadius = this.aura.radius;
      if (players[i].dead && circleCircle(this.aura, players[i])){
        players[i].gainEffect(new RemainEffect(player.remainSpeedMultiplier));
      }
    }
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let ang = player.lastDir;
    let pelletCount = player.dead ? player.pelletsOnDeath : player.storedPellets;
    let projectileSpeed = 30 - pelletCount * 1.5;
    let projectileRadius = player.baseRadius + pelletCount * 5;    
    let projectileLifetime = (1000 / projectileSpeed) * 30;
    let x = player.dead ? player.lastDeathX : player.x;
    let y = player.dead ? player.lastDeathY : player.y;
    player.remainPool.toRemove = true;
    player.remainPool.renderType = "none";
    let offset = player.dead ? 0 : projectileSpeed;
    area.addEnt(new EclipseProjectile(x, y, ang, area, player, projectileSpeed, projectileRadius, projectileLifetime, offset));
    player.storedPellets = 0;
  }
}

class EclipseProjectile extends Projectile{
  constructor(x, y, angle, area, player, speed, radius, lifetime, offset){
    super(x, y, angle, speed, -1, -1, radius, "#00000020", area, player, z.genericProjectile, [], "noOutline", offset, false);
    this.clock = 0;
    this.maxDur = lifetime;
    this.shrinking = false;
    this.renderOnMinimap = false;
  }
  detectContact(){
    this.detectEnemyContact();
    this.detectPlayerContact();
  }
  contactEffect(entity){
    if (entity.mainType === "player") return this.contactPlayer(entity);
    if (this.shrinking) return;
    entity.gainEffect(new EclipseEffect());
    if (entity.immune) return;
    // let angle = Math.atan2(entity.y - this.y, entity.x - this.x);
    // //let dist = this.radius + entity.radius;
    // // let xDest = Math.cos(angle) * dist + this.x;
    // // let yDest = Math.sin(angle) * dist + this.y;
    // // entity.x += (xDest - entity.x) * 1 * tFix;
    // // entity.y += (yDest - entity.y) * 1 * tFix;
    // let pushSpeed = max(1, 7 - entity.radius / 6);
    // entity.x += Math.cos(angle) * pushSpeed * tFix;
    // entity.y += Math.sin(angle) * pushSpeed * tFix;
    // entity.wallSnap();
  }
  contactPlayer(player){
    if (!this.player.remainActive) return;
    let speedMul = this.player.remainSpeedMultiplier;
    player.gainEffect(new RemainEffect(speedMul));
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.clock > this.maxDur){
      this.speed /= 2;
      this.shrinking = true;
    }
    if (this.shrinking){
      this.radius += (0 - this.radius) * 0.2 * tFix;
      if (this.radius <= 0.05){
        this.toRemove = true;
      }
    }
  }
}

class EclipseEffect extends Effect{
  constructor(){
    super(4000, getEffectPriority("EclipseEffect"), false, true);
  }
  doEffect(target){
    target.speedMultiplier *= 0.1;
    target.radiusMultiplier *= 0.5;
  }
  removeEffectLate(target){
    target.gainEffect(new SpeedRecoveryEffect(0.1, 3000))
    target.gainEffect(new SizeRecoveryEffect(0.5, 3000))
  }
}

class Remain extends Ability{
  constructor(){
    super(5, 0, 0, "ab.remain");
    this.moveSpeeds = [2, 3, 4, 5, 6];
  }
  upgradeBehavior(player){
    player.remainActive = true;
    player.remainSpeedMultiplier = this.moveSpeeds[this.tier - 1]
  }
}

class RemainEffect extends Effect{
  constructor(speed){
    super(0, getEffectPriority("RemainEffect"), 3000, false, true);
    this.speed = speed;
  }
  doEffect(target){
    if (!target.dead) return;
    target.speedMultiplier = 1;
    target.tempSpeed = this.speed;
    let toRevive = false;
    for (let i in target.zonesTouched){
      if (target.zonesTouched[i].type === "safe"){
        toRevive = true;
      }
    }
    if (toRevive){
      target.doRevive = true;
      target.gainEffect(new RemainFlashEffect(900));
    }
  }
}

class RemainFlashEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("GenericInvincibilityEffect"), false, false);
  }
  doEffect(target){
    target.invincible = true;
    let t = this.life / this.duration;
    target.tempColor = lerpCol(target.tempColor, t, 173, 218, 224);
  }
}