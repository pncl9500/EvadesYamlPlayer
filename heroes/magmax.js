class Magmax extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.magmax, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Magmax";
    this.ability1 = new Flow();
    this.ability2 = new Harden();
  }
}

class Flow extends ContinuousToggleAbility{
  constructor(){
    super(5, 0, 2, "ab.flow");
    this.speeds = [2, 3, 4, 5, 6];
    this.effect = new FlowEffect(0, this.speeds[this.tier - 1]);
  }
  upgradeBehavior(player){
    this.effect.speedGain = this.speeds[this.tier - 1];
  }
  behavior(player){
    if (this.toggled){
      player.gainEffect(this.effect)
    }
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    player.toggleOffOtherAbility(this);
  }
}

class Harden extends ContinuousToggleAbility{
  constructor(){
    super(5, [1250, 1000, 750, 500, 250], 12, "ab.harden");
  }
  behavior(player){
    if (this.toggled){
      player.gainEffect(new HardenEffect(0))
    }
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    player.toggleOffOtherAbility(this);
  }
}

class HardenEffect extends Effect{
  constructor(duration = 0){
    super(duration, getEffectPriority("HardenEffect"), false);
  }
  doEffect(target){
    target.ignoreBullets = true;
    target.invincible = true;
    target.speedMultiplier = 0;
    target.tempSpeed = 0;
    target.tempColor = {r: 172, g: 85, b: 46};
  }
}

class FlowEffect extends Effect{
  constructor(duration = 0, speedGain){
    super(duration, getEffectPriority("FlowEffect"), false);
    this.speedGain = speedGain;
  }
  doEffect(target){
    target.tempSpeed += this.speedGain;
    target.tempColor = {r: 236, g: 94, b: 44};
  }
}