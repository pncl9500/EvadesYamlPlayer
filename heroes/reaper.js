class Reaper extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.reaper, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Reaper";
    this.ability1 = new BlackHole();
    this.ability2 = new Depart();
  }
}

class Depart extends Ability{
  constructor(){
    super(5, 10000, 30, "ab.depart");
    this.speeds = [9, 9.5, 10, 10.5, 11];
    this.effectLengths = [2700, 2900, 3100, 3300, 3500];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new DepartEffect(this.effectLengths[this.tier - 1], this.speeds[this.tier - 1]));
  }
}

class DepartEffect extends Effect{
  constructor(duration, speed){
    super(duration, getEffectPriority("DepartEffect"));
    this.speed = speed;
  }
  doEffect(target){
    target.tempSpeed = this.speed;
    target.alphaMultiplier = 0;
    target.invincible = true;
    target.effectVulnerability = 0;
    target.fullEffectImmunity = true;
  }
}