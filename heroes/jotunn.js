class Jotunn extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.jotunn, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Jötunn";
    this.ability1 = new Decay();
    this.ability2 = new Shatter(this.ability1);
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

class Shatter extends Ability{
  constructor(other){
    super(5, [10000, 9000, 8000, 7000, 6000], 30, "ab.shatter");
    this.radius = 170;
    this.other = other;
    this.effectLength = 4000;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    if (this.other.tier === 0){
      return;
    }
    for (var i in enemies){
      if (circleCircle({x: player.x, y: player.y, r: this.radius}, enemies[i])){
        enemies[i].gainEffect(new ShatterEffect(this.effectLength));
      }
    }
  }
}

class ShatterEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("ShatterEffect"), false, false);
    this.prevRenderType = "";
    this.dur = duration;
  }
  doEffect(target){
    target.harmless = true;
    target.alphaMultiplier = 0.4;
    target.shatterTimer -= dTime;
  }
  gainEffect(target){
    this.prevRenderType = target.renderType;
    target.renderType = "shattered";
    target.shatterTimer = this.dur;
    target.maxShatterTimer = this.dur;
  }
  removeEffectLate(target){
    target.renderType = this.prevRenderType;
  }
}