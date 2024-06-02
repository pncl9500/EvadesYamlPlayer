class Toukka extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.toukka, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Toukka";
    this.ability1 = new Parasitize();
    this.ability2 = new Expel();
    this.nests = [];
  }
}

class Expel extends Ability{
  constructor(){
    super(5, [3000,2500,2000,1500,1000], 10, "ab.expel");
  }
  useConditionSatisfied(player){
    return player.nests.length > 0;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    for (let i in player.nests){
      let nest = player.nests[i];
      nest.clock = nest.maxDur;
      for (let i in nest.effects){
        if (nest.effects[i].constructor.name === "ParasitizeEffect"){
          nest.effects[i].targetRadiusMultiplier /= 1.5;
        }
      }
      for (let i in enemies){
        let enemy = enemies[i];
        if (enemy.hasEffect("ParasitizeEffect")) continue;
        if (enemy.immune) continue;
        if (circleCircle(enemy, nest)){
          //knockback enemy
          enemy.gainEffect(new NightEnemyEffect(4000));
          enemy.angle = Math.atan2(enemy.y - nest.y, enemy.x - nest.x);
          enemy.angleToVel();
        }
      }
    }
  }
}

class Parasitize extends Ability{
  constructor(){
    super(5, [7000, 6500, 6000, 5500, 5000], 10, "ab.parasitize");
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let ang = player.lastDir
    let rpr = new ParasitizeProjectile(player.x, player.y, ang, area, player);
    area.addEnt(rpr);
  }
}

class ParasitizeProjectile extends Projectile{
  constructor(x, y, angle, area, player, lifetime = 450){
    super(x, y, angle, 50, lifetime, -1, 18, {r: 117, g: 115, b: 147}, area, player, z.genericProjectile, [], "noOutline");
    this.ignorePreviousTargets = true;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    if (enemy.hasEffect("ParasitizeEffect")) return;
    this.toRemove = true;
    if (enemy.immune) return;
    let ef = new ParasitizeEffect(this.player);
    enemy.gainEffect(ef);
    this.player.gainEffect(new ParasitizeLungeEffect(enemy));
    this.player.nests.push(enemy);
  }
}

class ParasitizeLungeEffect extends Effect{
  constructor(enemy){
    super(-1, getEffectPriority("ParasitizeLungeEffect"), false)
    this.enemy = enemy;
    this.speed = 34;
    this.removedOnDeath = true;
  }
  doEffect(target){
    target.invincible = true;
    target.speedMultiplier = 0;
    let ang = Math.atan2(this.enemy.y - target.y, this.enemy.x - target.x);
    target.x += Math.cos(ang) * this.speed * tFix;
    target.y += Math.sin(ang) * this.speed * tFix;
    if (dst(target, this.enemy) < this.speed * tFix){
      target.x = this.enemy.x;
      target.y = this.enemy.y;
      this.toRemove = true;
      target.gainEffect(new OrbitInvincibilityEffect(1200));
    }
  }
}

class ParasitizeEffect extends Effect{
  constructor(player){
    super(-1, getEffectPriority("ParasitizeEffect"), false);
    this.storedRenderType = null;
    this.player = player;
    this.targetX = player.x;
    this.targetY = player.y;
    this.radiusMultiplier = 1;
    this.targetRadiusMultiplier = 1;

    this.alphaMultiplier = 1;
    this.targetAlphaMultiplier = 0.15;

    this.clock = 0;
    this.maxDur = 7000;
    this.pcf = (player, enemy) => {
      
    }
  }
  gainEffect(target){
    this.storedRenderType = target.renderType;
    target.renderType = "noOutline";
    this.targetRadiusMultiplier = Math.max(Math.min(175 / target.baseRadius, 6), 75 / target.baseRadius);
    this.targetRadiusMultiplier = Math.min(this.targetRadiusMultiplier, target.parentZone.height / 2 / target.baseRadius)
    target.playerContactFunctions.push(this.pcf)
    if (this.targetX < target.parentZone.x){
      this.targetX = target.parentZone.x;
    }
    if (this.targetX > target.parentZone.x + target.parentZone.width){
      this.targetX = target.parentZone.x + target.parentZone.width;
    }
    if (this.targetY < target.parentZone.y){
      this.targetY = target.parentZone.y;
    }
    if (this.targetY > target.parentZone.y + target.parentZone.height){
      this.targetY = target.parentZone.y + target.parentZone.height;
    }
  }
  doEffect(target){
    this.clock += dTime;
    target.alphaMultiplier = Math.min(this.alphaMultiplier, target.alphaMultiplier);
    target.harmless = true;
    target.speedMultiplier *= 0;
    target.radiusMultiplier = this.radiusMultiplier; 
    target.disabled = true;
    
    if (this.clock > this.maxDur)this.targetRadiusMultiplier = 0;
    this.radiusMultiplier += (this.targetRadiusMultiplier - this.radiusMultiplier) * 0.2 * tFix;
    this.alphaMultiplier += (this.targetAlphaMultiplier - this.alphaMultiplier) * 0.5 * tFix;
    if (this.radiusMultiplier < 0.01){
      this.toRemove = true;
    }
    let ents = target.parentZone.parentRegion.areas[target.parentZone.parentAreaNum].entities;
    for (let i = 0; i < ents.length; i++){
      if (ents[i] === target) continue;
      if (ents[i].mainType === "enemy" && circleCircle(target, ents[i])){
        ents[i].gainEffect(new DistortEffect(0.3, 0));
      }
    }
  }
  removeEffectLate(target){
    target.renderType = this.storedRenderType;
    target.gainEffect(new ParasitizePostEffect(3000));
    target.gainEffect(new SizeRecoveryEffect(0, 3000));
    target.playerContactFunctions.splice(target.playerContactFunctions.indexOf(this.pcf));
    this.player.nests.splice(this.player.nests.indexOf(target), 1);
  }
}

class ParasitizePostEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("ParasitizePostEffect"), false, false);
  }
  doEffect(target){
    target.speedMultiplier *= 0.2;
    target.harmless = true;
    target.alphaMultiplier = 0.4;
  }
}