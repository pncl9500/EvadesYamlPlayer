class Nexus extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.nexus, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Nexus";
    this.ability1 = new Barrier();
    this.ability2 = new Stream();
  }
}

class Barrier extends Ability{
  constructor(){
    super(5, 10000, 30, "ab.barrier");
    this.durations = [2500, 2700, 2900, 3100, 3300];
    this.usableWhileDead = true;
  }
  useConditionSatisfied(player){
    if (player.dead){
      if (player.area.players.length > 1){
        return true;
      }
      return false;
    }
    return true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let x = player.x;
    let y = player.y;
    if (player.dead){
      let maxDist = 99999;
      for (var i in players){
        if (players[i].dead){ continue };
        let dist = sqrt(sq(players[i].x - player.x) + sq(players[i].y - player.y));
        if (dist < maxDist){
          maxDist = dist;
          x = players[i].x;
          y = players[i].y;
        }
      }
    }
    let barrier = new BarrierProjectile(x, y, area, player, [], this.durations[this.tier - 1]);
    area.addEnt(barrier);
  }
}

class BarrierProjectile extends Projectile{
  constructor(x, y, area, player, entitiesAffectedByAbility = [], lifetime){
    super(x, y, 0, 0, lifetime, -1, 170, pal.hero.nexus, area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline", 0, false);
    this.ignorePreviousTargets = false;
    this.clock = 0;
    this.maxLifetime = lifetime;
    this.renderOnMinimap = false;
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
    super(5, 2000, 5, "ab.stream");
    this.duration = 8000;
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
    //get angle of player
    let dir = player.lastDir;
    dir = ((round(dir /= PI/2)) + 4) % 4;
    this.x = player.x;
    this.y = player.y - 100;
    this.width = 1400;
    if (dir === 2){
      this.x -= this.width;
    }
    this.height = 200;
    if (dir % 2 === 1){
      this.x = player.x - 100;
      this.y = player.y;
      this.height = 1400;
      this.width = 200;
      if (dir === 3){
        this.y -= this.height;
      }
    }
    this.renderOnMinimap = false;
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.gainEffect(new StreamEffect(this.speedBoost, this.player));
    player.gainEffect(new StreamNegativeEnergyEffect());
  }
  behavior(area, players){
    this.clock += dTime;
    let t = this.clock/this.maxLifetime;
    this.alphaMultiplier = 0.5 - 0.5 * t;
  }
  detectPlayerContact(){
    for (var i in this.area.players){
      if (circleRect(this.area.players[i], this)){
        if (this.entitiesAffectedByAbility.includes(this.area.players[i])){
          continue;
        }
        this.contactEffect(this.area.players[i]);
        if (this.ignorePreviousTargets){
          this.entitiesAffectedByAbility.push(this.area.players[i]);
        }
      }
    }
  }
  draw(){
    noStroke();
    this.drawBackExtra();
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, (this.tempColor.a ?? 255) * this.alphaMultiplier);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
    this.drawFrontExtra();
    this.tempColor.r = this.color.r;
    this.tempColor.g = this.color.g;
    this.tempColor.b = this.color.b;
    this.tempColor.a = this.color.a;
    this.tempRadius = this.radius;
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
    if (target.speedMultiplier === 0){
      return;
    }
    target.speedMultiplier = max(target.speedMultiplier, 1);
  }
}


class StreamNegativeEnergyEffect extends Effect{
  constructor(){
    super(0, getEffectPriority("StreamEffect"), false);
  }
  doEffectBeforeAbilities(target){
    target.tempMinEnergy = -target.maxEnergy;
  }
}
