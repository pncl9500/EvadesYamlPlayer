class Candy extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.candy, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Candy";
    this.ability1 = new SugarRush();
    this.ability2 = new SweetTooth();
  }
}

class SugarRush extends Ability{
  constructor(){
    super(5, [6000, 5500, 5000, 4500, 4000], 15, "ab.sugar_rush");
    this.duration = 2000;
    this.effectDuration = 2000;
    this.slow = 0.05; //???
    this.aura = new LockedAura({x: 0, y: 0}, 120, "#ff80bd40", z.genericAura + random() * z.randEpsilon);
    this.auraLife = 0;
    this.radius = 400;
    this.baseRadius = 100;
    this.radiusPerSpeed = 5;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    this.auraLife = this.duration;
    this.aura.toRemove = false;
    player.auras.push(this.aura);
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    this.auraLife -= dTime;
    //let moveMag = Math.sqrt(player.ctrlVector.x ** 2 + player.ctrlVector.y ** 2);
    let moveMag = Math.max(Math.abs(player.ctrlVector.x), Math.abs(player.ctrlVector.y))
    let addedRadius = player.tempSpeed * moveMag * this.radiusPerSpeed;
    this.radius = this.baseRadius + addedRadius;
    this.aura.radius = this.radius;
    if (this.auraLife < 0){
      this.aura.toRemove = true;
    } else {
      player.tempColor = {r: 214, g: 110, b: 162};
      for (let i in enemies){
        //dude
        //this.aura.radius = this.radius;
        if (circleCircle({x: player.x, y: player.y, r: this.radius}, enemies[i])){
          enemies[i].gainEffect(new SugarRushEffect(this.slow, this.effectDuration));
        }
      }
    }
  }
}

class SugarRushEffect extends Effect{
  constructor(speedMul, duration = 0){
    super(duration, getEffectPriority("SugarRushEffect"), false, true);
    this.speedMul = speedMul;
  }
  doEffect(target){
    target.speedMultiplier *= this.speedMul;
  }
}

class SweetTooth extends Ability{
  constructor(){
    super(5, 5000, 5, "ab.sweet_tooth");
    this.regenBoosts = [1,2,3,4,5];
    this.speedBoosts = [1,2,3,4,5];
    this.energyBoost = 0.5;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    area.addEnt(new SweetToothItem(player.lastDir, player, this.regenBoosts[this.tier - 1], this.speedBoosts[this.tier - 1], this.energyBoost));
  }
}

class SweetToothItem extends Projectile{
  constructor(angle, parent, regenBoost, speedBoost, energyBoost){
    let lifetime = 30000;
    super(parent.x, parent.y, angle, 0, lifetime, -1, 14, pal.hero.mirage, parent.area, parent, z.genericProjectile, [], "image", 64, false);
    this.image = "pr.sweet_tooth_item"
    this.parent = parent;
    this.regenBoost = regenBoost;
    this.speedBoost = speedBoost;
    this.energyBoost = energyBoost;
    this.renderOnMinimap = false;
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.gainEffect(new SweetToothEffect(this.regenBoost, this.speedBoost));
    player.energy += this.energyBoost * player.maxEnergy;
    player.energy = Math.min(player.energy, player.maxEnergy);
    this.toRemove = true;
  }
}

class SweetToothEffect extends Effect{
  constructor(regenBoost, speedBoost){
    super(15000, getEffectPriority("SweetToothEffect"), false, false);
    this.regenBoost = regenBoost;
    this.speedBoost = speedBoost;
  }
  doEffect(target){
    target.tempRegen += this.regenBoost;
    target.tempSpeed += this.speedBoost;
    target.energyBarColor = {r: 234, g: 67, b: 142};
  }
}