class Jotunn extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.jotunn, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Jötunn";
    this.ability1 = new Decay();
    this.ability2 = new BlankAbility();
  }
}

class Decay extends Ability{
  constructor(){
    super(5, 0, 0, "ab.decay");
    this.radius = 170;
    this.slowEffect = [1, 0.9, 0.8, 0.7, 0.6];
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0){
      return;
    }
    for (var i in enemies){
      if (circleCircle({x: player.x, y: player.y, r: this.radius}, enemies[i])){
        enemies[i].gainEffect(new DecayEffect(this.slowEffect[this.tier - 1]));
      }
    }
  }
}

class DecayEffect extends Effect{
  constructor(speedMul, duration = 0){
    super(duration, getEffectPriority("DecayEffect"), true);
    this.speedMul = speedMul;
  }
  doEffect(target){
    target.speedMultiplier *= this.speedMul;
    target.tempColor.r = target.tempColor.r * 0.7;
    target.tempColor.g = target.tempColor.g * 0.72;
    target.tempColor.b = target.tempColor.b * 1.15;
  }
}