class Jolt extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.jolt, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Jolt";
    this.ability1 = new Spark();
    this.ability2 = new Charge();
    this.storedAbility = new Lightning();

    this.ability1.upgradeWith = this.storedAbility;
    this.storedAbility.upgradeWith = this.ability1;
  }
}

class Charge extends Ability{
  constructor(){
    super(5, 1000, 10, "ab.charge");
    this.ranges = [100, 125, 150, 175, 200];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.storedAbility.cooldownOfPreviousUse = player.ability1.cooldownOfPreviousUse;
    player.storedAbility.currentCooldown = player.ability1.currentCooldown;
    let tempStore = player.storedAbility;
    player.storedAbility = player.ability1;
    player.ability1 = tempStore;
    player.ability1.nextUseBuffed = true;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0) return;
    let speed = 24;
    if (region.properties && region.properties.charge_reduced) speed = 2;
    if (area.properties && area.properties.charge_reduced) speed = 2;
    for (let p in pellets){
      let pel = pellets[p]
      if (dst(pel, player) > this.ranges[this.tier - 1] + pel.radius) continue;
      let angle = atan2(player.y - pel.y, player.x - pel.x);
      pel.x += cos(angle) * speed * tFix;
      pel.y += sin(angle) * speed * tFix;
    }
  }
}

//spark notes (ha ha)
//spark projectiles, at close enough range will bounce between 3 enemies max.
//spark projectiles seem to never retarget enemies they've already affected, but they will target enemies that other spark projectiles have affected.
//spark projectiles seem to have infinite initial TARGETTING range, and then die if they aren't close to any other enemies *after* affecting the initial target.
//as seen in the bb super huge evades room, they do have an actual maximum duration.
//spark projectiles, if there are multiple of them, will not target the same enemy.
//spark projectiles will wiggle around for a little bit after affecting an enemy.

//started 1.19, left 1.27, 8f
//started 2.04, left 2.12, 8f
//for some reason my recording was in 30fps so this really is 8f game time.
//spark projectiles stay on enemies for 240ms (maybe 250?)

//when a spark projectile hits its final enemy, it disappears instantly after affecting
//the enemy,

//two theories for spark projectile homing:
//spark projectiles continuously home into their targets
//spark projectiles continuously look to see if the angle they *are* going at differs too much from the angle
//that they *should* be going. if this angle differs too much, they will redirect to the enemy they are targetting
//i'm not sure which one of these is correct since sometimes it looks like either one is true

//another theory:
//after affecting an enemy, a spark projectile will look at the nearest enemy, and it determines
//whether or not it can reach that enemy before its lifetime runs out. if no, it dies instantly.

//spark projectiles will not even attempt to target immunes.
//if a spark projectile does not have a target, it will just fly in a random direction and bounce off of walls.

//spark projectiles spawned at 1.13
//spark projectiles died at 3.18
//basically 2 seconds

//spark projectile released at 6.25
//spark projectile hit top wall at 7.22
//spark projectile travelled 7 tiles middle -> down
//spark projectile travelled 15 tiles down -> up
//spark projectile travelled 22 tiles, or 704px
//spark projectile travelled for 27 frames
//704px/27f = 29.3333333333 projectile speed (maybe just 29?)
//so its speed is 29 maybe.

//lets say you have an area with 3 enemies and 5 spark projectiles spawn.
//the 2 extra spark projectiles *will* resort to targeting already targeted enemies,
//and not go off in a random direction like they do in burning bunker level 28.

class Spark extends Ability{
  constructor(){
    super(5, 6, 0, "ab.spark");
    this.pelletBased = true;
    this.projectileCounts = [1, 2, 3, 4, 5];
    this.effectDuration = 3000;
    this.effectDurationBuff = 1500;
    this.slow = 0.1;
    this.nextUseBuffed = false;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let targetsSelected = [];
    for (let i = 0; i < this.projectileCounts[this.tier - 1]; i++){
      //pick a target for the projectile.
      let targetSelected = this.pickTarget(targetsSelected, player, enemies);
      targetsSelected.push(targetSelected);

      let dur = this.effectDuration;
      if (this.nextUseBuffed){
        this.nextUseBuffed = false;
        dur += this.effectDurationBuff;
      }
      area.addEnt(new SparkProjectile(player.x, player.y, targetSelected, area, player, dur, this.slow));
    }
  }
  pickTarget(targetsSelected, player, enemies){
    //look at the closest potential valid target.
    let dist = 99999;
    let selectedTarget = undefined;
    for (let i in enemies){
      if (dst(player, enemies[i]) < dist && (!targetsSelected.includes(enemies[i]) || enemies.length <= targetsSelected.length) && (!enemies[i].immune)){
        dist = dst(player, enemies[i]);
        selectedTarget = enemies[i];
      }
    }
    return selectedTarget;
  }
}

class SparkProjectile extends Projectile{
  constructor(x, y, target, area, player, duration, slow){
    let projSpeed = 29;
    super(x, y, target ? atan2(target.y - y, target.x - x) : random(0, 360), projSpeed, 2000, -1, 8, "#eeee00", area, player, z.sparkProjectile, [], "noOutline", 32, true);
    this.target = target;
    this.targetHistory = [this.target];
    //if there is no target, remove behavior
    if (!this.target) this.behavior = () => {};

    this.state = "traveling";
    this.clock = 0;
    this.baseSpeed = projSpeed;

    this.duration = duration;
    this.slow = slow;
  }
  behavior(area, players){
    switch (this.state) {
      case "traveling":
        this.velToAngle();
        this.angle = atan2(this.target.y - this.y, this.target.x - this.x);
        this.angleToVel();
        if (dst(this.target, this) < this.speed){
          this.state = "locked";
          this.clock = 0;
        }
        break;
      case "locked":
        this.x = this.target.x;
        this.y = this.target.y;
        if (this.clock < 70){
          this.x += random(-4, 4);
          this.y += random(-4, 4);
        }
        this.speed = 0;
        this.clock += dTime;
        this.target.gainEffect(new SparkEffect(this.duration - 250, this.slow));
        if (this.clock > 250 || (this.targetHistory.length > 2 && this.clock > 70)){
          this.state = "traveling";
          this.speed = this.baseSpeed;
          //make candidate enemies array
          let enemies = [];
          for (let i = 0; i < area.entities.length; i++){
            let ent = area.entities[i];
            if (this.targetHistory.includes(ent)) continue;
            if (ent.mainType !== "enemy") continue;
            if (ent.immune) continue;
            enemies.push(ent);
          }
          this.target = this.findNewTarget(enemies);
          if (!this.target || this.targetHistory.length > 2){
            this.toRemove = true;
            this.state = "idling";
            return;
          }
          this.targetHistory.push(this.target);
        }
      default:
        break;
    }
  }
  findNewTarget(enemies){
    let dist = this.lifetime * this.baseSpeed * (30/1000);
    let selectedTarget = undefined;
    for (let i in enemies){
      if (dst(this, enemies[i]) < dist){
        dist = dst(this, enemies[i]);
        selectedTarget = enemies[i];
      }
    }
    return selectedTarget;
  }
}

class SparkEffect extends Effect{
  constructor(duration, slow){
    super(duration, getEffectPriority("SparkEffect"), false, true);
    this.slow = slow;
  }
  doEffect(target){
    target.disabled = true;
    target.speedMultiplier *= this.slow;
  }
}

//lightning notes
//lightning projectiles spawned at frame 23
//last lightning projectile movement at 1.06
//lightning projectiles last... 13 frames.
//or 433 ms.... i'll assume that it's meant to be 400, or 12 frames.
//nearly vertical lightning projectile went 320px in this time 320px / 12f = 26.667 pixels / second
//the trail SLOWS ENEMIES
//other than that, lightning projectiles seem to work exactly the same as spark projectiles, with the minor difference
//that they don't linger on enemies for 250ms
//it seems like they have no max chain range and they just die fast
//the last movement step of a lightning projectile doesnt spawn a trail bit

//trail bit spawned at 1.04
//trail bit faded at 2.16
//trails take 42f to fade
//trails take 1400ms to fade
//ok time to do it

class Lightning extends Ability{
  constructor(){
    super(5, 6, 0, "ab.lightning");
    this.pelletBased = true;
    this.projectileCounts = [5, 6, 7, 8, 9];
    this.effectDuration = 5000;
    this.effectDurationBuff = 2500;
    this.slow = 0.1;
    this.trailDuration = 1000;
    this.nextUseBuffed = false;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let targetsSelected = [];
    for (let i = 0; i < this.projectileCounts[this.tier - 1]; i++){
      //pick a target for the projectile.
      let targetSelected = this.pickTarget(targetsSelected, player, enemies);
      targetsSelected.push(targetSelected);

      let dur = this.effectDuration;
      if (this.nextUseBuffed){
        this.nextUseBuffed = false;
        dur += this.effectDurationBuff;
      }
      area.addEnt(new LightningProjectile(player.x, player.y, targetSelected, area, player, dur, this.slow));
    }
  }
  pickTarget(targetsSelected, player, enemies){
    //look at the closest potential valid target.
    let dist = 99999;
    let selectedTarget = undefined;
    for (let i in enemies){
      if (dst(player, enemies[i]) < dist && (!targetsSelected.includes(enemies[i]) || enemies.length <= targetsSelected.length) && (!enemies[i].immune)){
        dist = dst(player, enemies[i]);
        selectedTarget = enemies[i];
      }
    }
    return selectedTarget;
  }
}

class LightningProjectile extends Projectile{
  constructor(x, y, target, area, player, duration, slow){
    let projSpeed = 26.667;
    super(x, y, target ? atan2(target.y - y, target.x - x) : random(0, 360), projSpeed, 400, -1, 8, "#00eeee", area, player, z.lightningProjectile, [], "noOutline", 32, true);
    this.target = target;
    this.targetHistory = [this.target];
    //if there is no target, remove behavior but make it still spawn trail
    if (!this.target) this.behavior = () => {
      this.trailClock += dTime;
      if (this.trailClock > this.trailReleaseInterval){
        this.spawnTrail(area, players);
        this.trailClock %= this.trailReleaseInterval;
      }
    };

    this.state = "traveling";
    this.clock = 0;
    this.baseSpeed = projSpeed;

    this.duration = duration;
    this.slow = slow;

    this.trailClock = 0;
    this.trailReleaseInterval = 33;

    this.trailCancelPeriod = 34;
  }
  behavior(area, players){
    switch (this.state) {
      case "traveling":
        this.velToAngle();
        this.angle = atan2(this.target.y - this.y, this.target.x - this.x);
        this.angleToVel();
        if (dst(this.target, this) < this.speed){
          this.state = "locked";
          this.clock = 0;
        }
        this.trailClock += dTime;
        if (this.trailClock > this.trailReleaseInterval && !(this.lifetime < this.trailCancelPeriod)){
          this.spawnTrail(area, players);
          this.trailClock %= this.trailReleaseInterval;
        }
        break;
      case "locked":
        this.x = this.target.x;
        this.y = this.target.y;
        if (this.clock < 70){
          this.x += random(-4, 4);
          this.y += random(-4, 4);
        }
        this.speed = 0;
        this.clock += dTime;
        this.target.gainEffect(new LightningEffect(this.duration - 250, this.slow));
        if (true){
          this.state = "traveling";
          this.speed = this.baseSpeed;
          //make candidate enemies array
          let enemies = [];
          for (let i = 0; i < area.entities.length; i++){
            let ent = area.entities[i];
            if (this.targetHistory.includes(ent)) continue;
            if (ent.mainType !== "enemy") continue;
            if (ent.immune) continue;
            enemies.push(ent);
          }
          this.target = this.findNewTarget(enemies);
          if (!this.target || this.targetHistory.length > 2){
            this.toRemove = true;
            this.state = "idling";
            return;
          }
          this.targetHistory.push(this.target);
        }
      default:
        break;
    }
  }
  spawnTrail(area, players){
    area.queueEntSpawn(new LightningTrail(this.x, this.y, this.area, this.player, this.duration, this.slow));
  }
  doRemove(area, players){
    this.spawnTrail(area, players);
  }
  findNewTarget(enemies){
    let dist = 99999;
    let selectedTarget = undefined;
    for (let i in enemies){
      if (dst(this, enemies[i]) < dist){
        dist = dst(this, enemies[i]);
        selectedTarget = enemies[i];
      }
    }
    return selectedTarget;
  }
}

class LightningTrail extends Projectile{
  constructor(x, y, area, player, duration, slow){
    super(x, y, 0, 0, 1400, -1, 8, "#00eeee", area, player, z.lightningProjectile, [], "noOutline", 0, true);
    this.maxLifetime = 1400;
    this.clock = 0;

    this.duration = duration;
    this.slow = slow;
  }
  behavior(area, players){
    this.clock += dTime;
    let t = this.clock/this.maxLifetime;
    this.alphaMultiplier = 1 - 1 * t;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.gainEffect(new LightningEffect(this.duration, this.slow));
  }
}

class LightningEffect extends Effect{
  constructor(duration, slow){
    super(duration, getEffectPriority("LightningEffect"), false, true);
    this.slow = slow;
  }
  doEffect(target){
    target.speedMultiplier *= this.slow;
  }
}