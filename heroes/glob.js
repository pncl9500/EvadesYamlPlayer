class Glob extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.glob, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Glob";
    this.ability1 = new RadioactiveGloop(this);
    this.ability2 = new BlankAbility();
    this.gloopActive = false;
    this.projectiles = [];
  }
  lavaDie(){
    if (!this.gloopActive) return super.lavaDie();
    this.projectiles[0].die();
  }
  die(){
    this.cancelGloop();
    super.die();
  }
  doExitTranslate(zone){
    this.cancelGloop();
    super.doExitTranslate(zone);
  }
  doTeleportTranslate(zone){
    this.cancelGloop();
    super.doTeleportTranslate(zone);
  }
  cancelGloop(){
    this.gloopActive = false;
    this.removeEffect("RadioactiveGloopEffect");
    this.projectiles = [];
  }
}

//6 radius
//11 spawn distance
//regens 5s after
class RadioactiveGloop extends Ability{
  constructor(parent){
    super(5, [8000, 7000, 6000, 5000, 4000], 25, "ab.radioactive_gloop");
    this.parent = parent;
    this.projRadius = 6;
    this.projDist = 11;
    this.regenTime = 5000;
    this.nonMainProjectiles = 7;
  }
  useConditionSatisfied(){
    return !this.parent.gloopActive;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new RadioactiveGloopEffect(player))
    this.parent.gloopActive = true;
    for (let i = 0; i < this.nonMainProjectiles; i++){
      player.projectiles.push(new RadioactiveGloopProjectile(parent))
    }
  }
}

class RadioactiveGloopEffect extends Effect{
  constructor(parent){
    super(-1, getEffectPriority("RadioactiveGloopEffect"), false, false);
    debugValue = this.storedType;
    parent.renderType = "none";
  }
  doEffect(target){
    target.invincible = true;
    target.corrosiveBypass = true;
  }
  removeEffect(target){
    this.storedType = parent.renderType;
    target.renderType = this.storedType;
  }
}

class RadioactiveGloopProjectile extends Projectile{
  constructor(parent){
    super(parent.x, parent.y, 0, 0, -1, -1, );  
  }
}