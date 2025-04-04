class Lide extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.lide, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Lide";
    this.ability1 = new Stick();
    this.ability2 = new Energize();
  }
}

class Stick extends Ability{
  constructor(){
    super(5, [9000,8000,7000,6000,5000], 30, "ab.stick");
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (player.energy < this.cost) {return; }
    if (this.tier === 0) { return; }
    if (this.currentCooldown > 0) { return; }
    this.effect = new StickEffectPlayer(0, this, player);
    player.gainEffect(this.effect)
  }
}

class StickEffectPlayer extends Effect{
  constructor(duration, ability, player){
    super(duration, getEffectPriority("StickEffectPlayer"), false);
    this.ability = ability
    this.player = player
  }
  doEffect(target){
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    if (contactedEnemy.harmless){
      return;
    }
    this.toRemove = true;
    contactedEnemy.gainEffect(new StickEffectEnemy());
    if (contactedEnemy.harmless){return;};
    this.ability.startCooldown(this.player)
    this.player.energy -= this.ability.cost;
    if (target.invincible && (!contactedEnemy.corrosive || target.corrosiveBypass)) {
      return;
    }
    if (contactedEnemy.immune){
      target.die();
    }
  }
}

class StickEffectEnemy extends Effect{
  constructor(){
    super(-1, getEffectPriority("StickEffectEnemy"), false);
    this.pcf = (player, enemy) => {
      player.gainEffect(new StuckEffect(this))
    }
  }
  doEffect(target){
    target.harmless = true;
    target.alphaMultiplier = 0.8;
    target.speedMultiplier *= 0;
    target.tempRadius *= 1.1;
    target.tempColor = {r: 26, g: 22, b: 0};
  }
  removeEffectLate(target){
    target.gainEffect(new GenericHarmlessEffect(1500));
    target.gainEffect(new SpeedRecoveryEffect(0, 4000));
  }
  gainEffect(target){
    target.playerContactFunctions.push(this.pcf)
  }
  removeEffect(target){
    target.playerContactFunctions.splice(target.playerContactFunctions.indexOf(this.pcf));
  }
}

class StuckEffect extends Effect{
  constructor(parentEffect){
    super(1, getEffectPriority("StuckEffect"), false);
    this.parentEffect = parentEffect;
  }
  doEffect(target){
    target.speedMultiplier *= 0.2;
  }
  removeEffectLate(target){
    this.parentEffect.life = 0;
    this.parentEffect.noDuration = false;
  }
}

