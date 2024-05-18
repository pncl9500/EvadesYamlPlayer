class Fab extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.fab, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Fab";
    this.ability1 = new Masonry();
    this.ability2 = new Tether();
  }
  instantRespawnAppropriate(){
    return !this.ability2.established;
  }
}

class Masonry extends Ability{
  constructor(){
    super(5, [6500, 6000, 5500, 5000, 4500], 15, im.ab.masonry);
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    for (var i = 0; i < 7; i++){
      let pDir = player.lastDir;
      let maxDev = i === 0 ? 32 : 56;
      let initialDistance = 64;
      let stepDistance = 64;
      area.addEnt(new MasonryBlobSpawner(player.x + cos(pDir) * (initialDistance + stepDistance * i) + random(-maxDev, maxDev), player.y + sin(pDir) * (initialDistance + stepDistance * i) + random(-maxDev, maxDev), i, area))
    }
  }
}


class MasonryBlobSpawner extends Entity{
  constructor(x, y, index, area, player){
    super(x, y, 8, "#0000cc", 0.5, "none");
    this.index = index;
    this.correctPosition(area);
    this.area = area;
    this.clock = 0;
    this.releaseTime = 0 + index * 150 + random(-100, 100);
    this.masonryBlobSize = index === 0 ? random(20, 24) : random(24 + index * 4, 32 + index * 5);
    this.masonryBlobLife = random(3000, 3500);
    this.plauyer = player;
  }
  correctPosition(area){
    (this.x > area.bounds.right) && (this.x -= (this.x - area.bounds.right) * 2);
    (this.x < area.bounds.left) && (this.x -= (this.x - area.bounds.left) * 2);
    (this.y > area.bounds.bottom) && (this.y -= (this.y - area.bounds.bottom) * 2);
    (this.y < area.bounds.top) && (this.y -= (this.y - area.bounds.top) * 2);
  }
  update(){
    this.clock += dTime;
    if (this.clock > this.releaseTime){
      this.area.addEnt(new MasonryBlob(this.x, this.y, this.masonryBlobSize, this.masonryBlobLife, this.area, this.player));
      this.toRemove = true;
    }
  }
}


class MasonryBlob extends Projectile{
  constructor(x, y, maxSize, timeUntilShrink, area, player){
    super(x, y, 0, 0, -1, -1, 2, "#c2ba9f66", area, player, z.genericProjectile, [], "outline", 0, true);
    this.ignorePreviousTargets = false;
    this.clock = 0;
    this.maxSize = maxSize;
    this.renderOnMinimap = false;
    this.growing = true;
    this.timeUntilShrink = timeUntilShrink;
  }
  detectContact(){
    if (this.clock < 200){
      return;
    }
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    this.growing = false;
    enemy.setAngle(atan2(enemy.y - this.y, enemy.x - this.x));
    this.radius -= 18;
    if (this.radius <= 6){
      this.toRemove = true;
    }
    enemy.gainEffect(new MasonryEffect(3000));
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.growing) this.radius += 0.15 * dTime;
    if (this.radius > this.maxSize && this.growing){
      this.growing = false;
      this.radius = this.maxSize;
    }
    if (this.clock > this.timeUntilShrink){
      this.radius -= 0.2 * dTime;
      if (this.radius < 0){
        this.radius = 0;
        this.toRemove = true;
      }
    }
  }
}

class MasonryEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("MasonryEffect"), true);
  }
  doEffect(target){
    target.harmless = true;
    target.alphaMultiplier = 0.4;
    target.speedMultiplier *= 0.85;
  }
}

class Tether extends Ability{
  constructor(){
    super(5, [16000, 14000, 12000, 10000, 8000], 20, im.ab.tether);
    this.rechargingActive = false;
    this.tetherSelf = null;
    this.tetherOther = null;
    this.established = false;

    this.selfIndicator = null;
    this.otherIndicator = null;

    this.maxRange = 1600;
    this.invinDuration = 1000;
    this.reviveCancelDuration = 0;
    this.tetherWaitTime = 4000;

    this.minPullSpeed = 8.5;
    this.pullSpeed = 8.5;
    this.pullAcceleration = 4;
    this.maxPullSpeed = 51;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    if (players.length < 1) {this.cancelUse(player); return} // no tether if only one player
    //search for player to establish tether with
    let nearestPlayerDist = this.maxRange;
    let nearestPlayer = null;
    for (let i in players){
      let distance = dst(player,players[i]);
      if (distance < nearestPlayerDist){
        if (players[i].heroName === "Fab") continue;
        if (players[i].dead) continue;
        nearestPlayerDist = distance;
        nearestPlayer = players[i];
      }
    }
    //no nearest player -> return
    if (!nearestPlayer) {this.cancelUse(player); return}
    this.tetherSelf = player;
    this.tetherOther = nearestPlayer;
    this.startCooldown(player);
    //make tether and start cooldown, but don't progress it
    this.establishTether(this.tetherSelf, this.tetherOther);
    this.rechargingActive = false;
  }
  unestablishTether(){
    this.established = false;
    this.selfIndicator && (this.selfIndicator.toRemove = true);
    this.otherIndicator && (this.otherIndicator.toRemove = true);
  }
  establishTether(self, other){
    this.established = true;
    this.makeEnts(self.area);
  }
  breakTether(){
    this.unestablishTether();
    this.rechargingActive = true;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (!this.established) return;
    if (this.tetherSelf.area !== this.tetherOther.area){
      this.breakTether(false);
      this.cancelUse(player, false);
      return;
    }
    if (dst(this.tetherSelf, this.tetherOther) > this.maxRange){
      this.breakTether();
      this.giveTetherInvin(player);
      return;
    }
    if (!(this.tetherSelf.dead && this.tetherOther.dead)) return;
    let maxWait = min(this.tetherSelf.deathEffect.duration - this.tetherSelf.deathEffect.life, this.tetherOther.deathEffect.duration - this.tetherOther.deathEffect.life);
    let t = maxWait / this.tetherWaitTime;
    t *= t;
    this.selfIndicator.tempColor = {r: floor(map(t, 0, 1, this.selfIndicator.tempColor.r, 0)), g: floor(map(t, 0, 1, this.selfIndicator.tempColor.g, 0)), b:  floor(map(t, 0, 1, this.selfIndicator.tempColor.b, 0))};
    this.otherIndicator.tempColor = {r: floor(map(t, 0, 1, this.otherIndicator.tempColor.r, 0)), g: floor(map(t, 0, 1, this.otherIndicator.tempColor.g, 0)), b:  floor(map(t, 0, 1, this.otherIndicator.tempColor.b, 0))};
    this.selfIndicator.shake = map(t, 0.65, 1, 0, 2, true);
    this.otherIndicator.shake = map(t, 0.65, 1, 0, 2, true);
    if (t > 0.85){
      this.selfIndicator.shake *= 2;
      this.otherIndicator.shake *= 2;
    }
    if (!(this.tetherSelf.deathEffect.life < this.tetherSelf.deathEffect.duration - this.tetherWaitTime)) return;
    if (!(this.tetherOther.deathEffect.life < this.tetherOther.deathEffect.duration - this.tetherWaitTime)) return;
    this.selfIndicator.shake = 0;
    this.otherIndicator.shake = 0;
    this.selfIndicator && (this.selfIndicator.toRemove = true);
    this.otherIndicator && (this.otherIndicator.toRemove = true);

    this.pullSpeed = min(this.maxPullSpeed, this.pullSpeed + this.pullAcceleration * tFix);

    this.pullSelf();
    if (dst(this.tetherSelf, this.tetherOther) <= this.pullSpeed){
      this.tetherSelf.x = this.tetherOther.x;
      this.tetherSelf.y = this.tetherOther.y;
      this.useTether();
      this.pullSpeed = this.minPullSpeed;
    }
  }
  giveTetherInvin(player){
    player.gainEffect(new TetherInvinEffect(this.invinDuration));
    player.gainEffect(new TetherReviveCancelEffect(this.reviveCancelDuration));
  }
  makeEnts(area){
    this.selfIndicator = new TetherIndicatorEnt(this.tetherSelf, this.tetherOther, 48, this.maxRange);
    this.otherIndicator = new TetherIndicatorEnt(this.tetherOther, this.tetherSelf, 48, this.maxRange);
    area.addEnt(this.selfIndicator);
    area.addEnt(this.otherIndicator);
  }
  pullSelf(){
    this.tetherSelf.x += tFix * this.pullSpeed * cos(atan2(this.tetherOther.y - this.tetherSelf.y, this.tetherOther.x - this.tetherSelf.x))
    this.tetherSelf.y += tFix * this.pullSpeed * sin(atan2(this.tetherOther.y - this.tetherSelf.y, this.tetherOther.x - this.tetherSelf.x))
  }
  useTether(){
    this.tetherSelf.doRevive = true;
    this.breakTether();
    this.giveTetherInvin(this.tetherSelf);
  }
}

class TetherIndicatorEnt extends Entity{
  constructor(self, other, reach, maxRange){
    super(self.x + reach * cos(atan2(other.y - self.y, other.x - self.x)), self.y + reach * sin(atan2(other.y - self.y, other.x - self.x)), 8, "#d1b96655", 1, "noOutline");
    this.self = self;
    this.other = other;
    this.reach = reach;
    this.maxRange = maxRange;
    this.shake = 0;
  }
  snap(){
    let dist = dst(this.self, this.other);
    if (dist < this.reach * 2){
      this.x = (this.self.x + this.other.x)/2 + random(-this.shake, this.shake);
      this.y = (this.self.y + this.other.y)/2 + random(-this.shake, this.shake);
      return;
    }
    this.x = this.self.x + this.reach * cos(atan2(this.other.y - this.self.y, this.other.x - this.self.x)) + random(-this.shake, this.shake);
    this.y = this.self.y + this.reach * sin(atan2(this.other.y - this.self.y, this.other.x - this.self.x)) + random(-this.shake, this.shake);
  }
  draw(){
    if (this.toRemove){
      return;
    }
    this.snap();
    let dist = dst(this.self, this.other);
    //this.alphaMultiplier *= map(dist, 96, 128, 0, 1, true);
    this.alphaMultiplier *= map(dist, this.maxRange - 350, this.maxRange, 1, 0, true);
    super.draw();
    this.alphaMultiplier = 1;
  }
}

class TetherInvinEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("TetherInvinEffect"), false, true);
  }
  doEffect(target){
    let t = this.life / this.duration;
    target.invincible = true;
    target.tempColor = {r: floor(map(t, 0, 1, target.tempColor.r, 0)), g: floor(map(t, 0, 1, target.tempColor.g, 0)), b:  floor(map(t, 0, 1, target.tempColor.b, 0))};
  }
}

class TetherReviveCancelEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("TetherReviveCancelEffect"), false, true);
  }
  doEffect(target){
    target.alphaMultiplier = 0.4;
    target.canRevivePlayers = false;
  }
}
