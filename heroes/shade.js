class Shade extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.shade, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Shade";
    this.ability1 = new Night();
    this.ability2 = new Vengeance();
  }
}

class Night extends Ability{
  constructor(){
    super(5, 7000, 30, im.ab.night);
    this.speedBoosts = [0, 1.25, 2.5, 3.75, 5];
    this.effectLength = 7000;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new NightEffect(this.effectLength, this.speedBoosts[this.tier - 1]));
  }
}

class NightEffect extends Effect{
  constructor(duration, speedGain){
    super(duration, getEffectPriority("NightEffect"), false);
    this.speedGain = speedGain;
    this.effectDurationOnEnemy = 2000;
    this.cancellingEffects = [
      "NightEnemyEffect",
      "IsGrassEffect"
    ]
  }
  doEffect(target){
    target.tempSpeed += this.speedGain;
    target.alphaMultiplier = min(0.65, target.alphaMultiplier);
    target.detectable = false;
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    let enemyHasCancellingEffect = false;
    for (let i in this.cancellingEffects){
      if (contactedEnemy.hasEffect(this.cancellingEffects[i])){
        enemyHasCancellingEffect = true;
      }
    }
    if (contactedEnemy.harmless && !enemyHasCancellingEffect){
      return;
    }
    this.toRemove = true;
    contactedEnemy.gainEffect(new NightEnemyEffect(this.effectDurationOnEnemy));
    if (contactedEnemy.harmless){return;};
    if (target.invincible && (!contactedEnemy.corrosive || target.corrosiveBypass)) {
      return;
    }
    if (contactedEnemy.immune){
      target.die();
    }
  }
}

class NightEnemyEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("NightEnemyEffect"), false);
  }
  doEffect(target){
    target.harmless = true;
    target.alphaMultiplier = 0.4;
  }
}

class Vengeance extends Ability{
  constructor(){
    super(5, [3000, 2500, 2000, 1500, 1000], 5, im.ab.vengeance);
    this.projectileRadii = [20, 25, 30, 35, 40];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let ang = player.lastDir;
    let rpr = new VengeanceProjectile(player.x, player.y, ang, area, player, this.projectileRadii[this.tier - 1]);
    area.addEnt(rpr);
  }
}


class VengeanceProjectile extends Projectile{
  constructor(x, y, angle, area, player, radius){
    super(x, y, angle, 58, -1, -1, radius, "880022", area, player, z.genericProjectile, [], "image");
    this.image = im.ab.vengeance_projectile
    this.returning = false;
    this.clock = 0;
    this.acceleration = 4;
    this.player = player;
    this.ignorePreviousTargets = false;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    if (this.returning){
      enemy.gainEffect(new VengeanceFreezeEffect());
      for (let i = 0; i < enemy.effects.length; i++){
        if (enemy.effects[i].constructor.name === "VengeanceSlowEffect"){
          enemy.effects.splice(i, 1);
        }
      }
    } else {
      enemy.gainEffect(new VengeanceSlowEffect());
      for (let i = 0; i < enemy.effects.length; i++){
        if (enemy.effects[i].constructor.name === "VengeanceFreezeEffect"){
          enemy.effects.splice(i, 1);
        }
      }
    }
  }
  speedToVel(){
    this.xv = this.speed;
    this.yv = 0;
    this.angleToVel();
  }
  behavior(area, players){
    this.clock += dTime;
    //if the player moves outside the area we must remove the projectile
    if (this.area !== this.player.area){this.toRemove = true; return}

    if (this.returning){
      //point towards parent player
      this.velToAngle();
      this.angle = atan2(this.player.y - this.y, this.player.x - this.x);
      this.angleToVel();
      if (circleCircle(this, this.player)){
        this.toRemove = true;
      }
    }
    this.computeSpeed();
  }
  computeSpeed(){
    if (this.returning && this.speed < 70){
      this.speed += this.acceleration * tFix;
    } else if (!this.returning){
      this.speed -= this.acceleration * tFix;
      if (this.speed < 0){
        this.returning = true;
      }
    }
  }
}

















class VengeanceSlowEffect extends Effect{
  constructor(duration = 6000){
    super(duration, getEffectPriority("VengeanceSlowEffect"), false, true);
  }
  doEffect(target){
    target.speedMultiplier *= 0.25;
  }
}

class VengeanceFreezeEffect extends Effect{
  constructor(duration = 6000){
    super(duration, getEffectPriority("VengeanceFreezeEffect"), false, false);
  }
  doEffect(target){
    target.speedMultiplier *= 0;
  }
}