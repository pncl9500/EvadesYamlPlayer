class Aurora extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.aurora, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Aurora";
    this.ability1 = new Distort();
    this.ability2 = new Energize();
  }
}

class Distort extends ContinuousToggleAbility{
  constructor(){
    super(5, 0, 7, im.ab.distort);
    this.ranges = [180, 210, 240, 270, 300];
    this.slowEffect = [0.7, 0.65, 0.6, 0.55, 0.5];
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#ff000030", z.genericAura + random() * z.randEpsilon);
  }
  upgradeBehavior(player){
    this.aura.radius = this.ranges[this.tier - 1];
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (!this.toggled){
      return;
    }
    for (var i in enemies){
      if (circleCircle(this.aura, enemies[i])){
        enemies[i].gainEffect(new DistortEffect(this.slowEffect[this.tier - 1]));
      }
    }
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    player.addAura(this.aura);
  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.toRemove = true;
  }
}

class DistortEffect extends Effect{
  constructor(speedMul, duration = 0){
    super(duration, getEffectPriority("DistortEffect"), true);
    this.speedMul = speedMul;
  }
  doEffect(target){
    target.speedMultiplier *= this.speedMul;
  }
}

class Energize extends Ability{
  constructor(){
    super(5, 0, 0, im.ab.energize);
    this.regenBoosts = [2, 2.25, 2.5, 2.75, 3];
    this.cooldownReduction = 0.9;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0){
      return;
    }
    for (var i in players){
      players[i].gainEffect(new EnergizeEffect(this.regenBoosts[this.tier - 1], this.cooldownReduction));
    }
  }
}

class EnergizeEffect extends Effect{
  constructor(regenBoost, cooldownReduction, duration = 0){
    super(duration, getEffectPriority("EnergizeEffect"), true);
    this.regenBoost = regenBoost;
    this.cooldownReduction = cooldownReduction;
  }
  doEffect(target){
    target.tempRegen += this.regenBoost;
    target.energyBarColor = {r: 255, g: 255, b: 0};
    target.cooldownMultiplier = max(target.cooldownMultiplier * this.cooldownReduction, this.cooldownReduction);
  }
}