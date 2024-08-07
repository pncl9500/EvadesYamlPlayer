class Irit extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.irit, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Irit";
    this.ability1 = new AstralProjection(this);
    this.ability2 = new Shackle(this);
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
  doTeleportTranslate(teleport){
    if (this.corporeal) return super.doTeleportTranslate(teleport);
  }
  handleZonesTouched(){
    if (this.corporeal) return super.handleZonesTouched();
  }
}

class BlankAbility extends Ability{
  constructor(){
    super(5, 0, 0, null);
  }
}

class Shackle extends ToggleAbility{
  constructor(parent){
    super(5, [10000,9500,9000,8500,8000], 15, "ab.shackle");
    this.ranges = [100, 125, 150, 175, 200];
    this.duration = 2500;
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#2654d139", z.genericAura + random() * z.randEpsilon);
    this.parent = parent;
  }
  upgradeBehavior(player){
    this.aura.radius = this.ranges[this.tier - 1];
  }
  update(){
    this.currentCooldown -= dTime;
    this.aura.update();
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    player.addAura(this.aura);
  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.toRemove = true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let affectedEnts = getEntsInRadius(enemies, player.x, player.y, this.ranges[this.tier - 1]);
    for (var i in affectedEnts){
      affectedEnts[i].gainEffect(new ShacklePassEffect(1000, this.duration, this.parent));
    }
  }
}

class ShacklePassEffect extends Effect{
  constructor(duration, shackleDuration, parent){
    super(duration, getEffectPriority("ShacklePassEffect"), false);
    this.childDuration = shackleDuration
    this.parent = parent;
  }
  doEffect(target){
    target.tempColor = {r: 50, g: 90, b: 150};
    target.speedMultiplier *= 0.75;
  }
  removeEffectLate(target){
    target.gainEffect(new ShackleEffect(this.childDuration, this.parent))
  }
}

class ShackleEffect extends Effect{
  constructor(duration, parent){
    console.log(duration);
    super(duration, getEffectPriority("ShackleEffect"), false);
    this.pcf = (player, enemy) => {
      player.doRevive = true;
    }
    this.parent = parent;
    this.offsetX = 0;
    this.offsetY = 0;
  }
  doEffect(target){
    target.harmless = true;
    target.tempColor = {r: 70, g: 150, b: 210};
    target.alphaMultiplier = 0.4;
    target.speedMultiplier = 0;
    target.disabled = true;
    if (this.parent.area !== target.parentZone.parentRegion.areas[target.parentZone.parentAreaNum]){
      this.toRemove = true;
    } else {
      target.x = this.parent.x + this.offsetX;
      target.y = this.parent.y + this.offsetY;
      target.wallSnap();
    }
  }
  gainEffect(target){
    target.playerContactFunctions.push(this.pcf)
    this.offsetX = target.x - this.parent.x;
    this.offsetY = target.y - this.parent.y;
  }
  removeEffect(target){
    target.playerContactFunctions.splice(target.playerContactFunctions.indexOf(this.pcf));
  }
  removeEffectLate(target){
    target.gainEffect(new GenericHarmlessEffect(1000));
  }
}

class AstralProjection extends Ability{
  constructor(parent){
    super(5, [18000, 16000, 14000, 12000, 10000], 30, "ab.astralprojection");
    this.parent = parent;
  }
  useConditionSatisfied(){
    return false;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0) return;
    if (this.parent.hasEffect("DeadEffect")) return;
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
    if (contactedEnemy.harmless) return;
    if (contactedEnemy.corrosive) return target.die();
    let effectLength = 3300;
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
    super(parent.x, parent.y, 32, parent.color, parent.z, parent.renderType);
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
  removeEffectLate(target){
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