class Irit extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.irit, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Irit";
    this.ability1 = new AstralProjection(this);
    this.ability2 = new BlankAbility();
    this.corporeal = true;
  }
  die(){
    super.die();
    this.onTpZoneLastFrame = false;
    this.corporeal = true;
    this.removeEffect("AstralProjectionEffect");
  }
  doExitTranslate(exitZone){
    if (this.corporeal) return super.doExitTranslate(exitZone);
  }
}

class BlankAbility extends Ability{
  constructor(){
    super(5, 0, 0, null);
  }
}

class AstralProjection extends Ability{
  constructor(parent){
    super(5, [16000, 14000, 12000, 10000, 8000], 30, "ab.astralprojection");
    this.parent = parent;
  }
  useConditionSatisfied(){
    return false;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0) return;
    if (!this.parent.corporeal) return;
    if (this.parent.energy - this.parent.tempMinEnergy < this.cost) return;
    player.gainEffect(new AstralProjectionPassiveEffect(this));
  }
}

class AstralProjectionPassiveEffect extends Effect{
  constructor(parentAbility){
    super(0, getEffectPriority("AstralProjectionPassiveEffect"), false, true);
    this.parentAbility = parentAbility;
  }
  doEffect(target){
    if (this.parentAbility.currentCooldown > 0) return;
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    if (this.parentAbility.currentCooldown > 0) return;
    if (contactedEnemy.corrosive) return target.die();
    let effectLength = 3000;
    target.gainEffect(new AstralProjectionEffect(effectLength));
    target.gainEffect(new AstralProjectionPushEffect(1500, target.lastDir + Math.PI));
    target.corporeal = false;
    this.parentAbility.startCooldown(this.parentAbility.parent);
    this.parentAbility.parent.energy -= this.parentAbility.cost;
    target.area.addEnt(new AstralProjectionBody(target, effectLength));
  }
}

class AstralProjectionBody extends Entity{
  constructor(parent, duration){
    super(parent.x, parent.y, parent.baseRadius, parent.color, parent.z, parent.renderType);
    this.parent = parent;
    this.clock = 0;
    this.duration = duration;
  }
  update(){
    this.clock += dTime;
    this.alphaMultiplier = map(this.clock, 0, this.duration, 1, 0);
    if (this.clock > this.duration){
      this.toRemove = true;
    }
    if (circleCircle(this, this.parent) && !this.parent.hasEffect("AstralProjectionPushEffect")){
      this.parent.removeEffect("AstralProjectionEffect");
      this.parent.corporeal = true;
      this.toRemove = true;
    }
  }
}

class AstralProjectionPushEffect extends Effect{
  constructor(duration, angle){
    super(duration, getEffectPriority("AstralProjectionPushEffect"), false, true);
    this.angle = angle;
    this.initialVelocity = 35;
    this.velocity = this.initialVelocity;
  }
  doEffect(target){
    this.velocity -= (this.initialVelocity / this.duration) * dTime;
    target.x += Math.cos(this.angle) * this.velocity * tFix;
    target.y += Math.sin(this.angle) * this.velocity * tFix;
    target.speedMultiplier *= 0.6;
    target.invincible = true;
    let t = this.life / this.duration;
    target.tempColor = lerpCol(target.tempColor, t, 80, 80, 255);
    target.canRevivePlayers = false;
    if (target.restrictedLastFrame && (this.duration - this.life) > 250){
      this.toRemove = true;
    }
  }
}

class AstralProjectionEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("AstralProjectionEffect"), false, true);
  }
  doEffect(target){
    target.alphaMultiplier = 0.4;
    target.tempSpeed = 13;
  }
  removeEffect(target){
    if (!target.corporeal){
      target.corporeal = true;
      target.die();
    }
  }
}

// class AstralProjectionInvincibilityEffect extends Effect{
//   constructor(duration){
//     super(duration, getEffectPriority("GenericInvincibilityEffect"), false, true);
//   }
//   doEffect(target){
//     target.invincible = true;
//     let t = this.life / this.duration;
//     target.tempColor = lerpCol(target.tempColor, t, 80, 80, 255);
//   }
// }