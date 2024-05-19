class Leporid extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.leporid, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Leporid";
    this.ability1 = new Burrow();
    this.ability2 = new Pit();
  }
}

class Burrow extends Ability{
  constructor(){
    super(5, [6000, 5000, 4000, 3000, 2000], 15, "ab.burrow");
    this.burrows = [];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let burrow = new BurrowProjectile(player.x, player.y, area, player, this.burrows);
    this.burrows.push(burrow);
    area.addEnt(burrow);
    if (this.burrows.length > 2){
      this.burrows[0].shrinking = true;
      this.burrows.shift();
    }
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    //cull burrows in other areas
    for (let i = 0; i < this.burrows.length; i++){
      if (this.burrows[i].area !== player.area){
        this.burrows.splice(i, 1);
        i--;
      }
    }
  }
}

class BurrowProjectile extends Projectile{
  constructor(x, y, area, player, burrows){
    super(x, y, 0, 0, -1, -1, 32, "#331100aa", area, player, z.blackHole, [], "noOutline", 0, true);
    this.burrows = burrows;
    this.shrinking = false;
  }
  detectContact(){
    if (this.shrinking) return;
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.gainEffect(new PreBurrowEffect(this, this.burrows));
  }
  behavior(area, players){
    if (this.area !== this.player.area){
      this.shrinking = true;
    }
    if (this.shrinking){
      this.radius /= pow(1.2, tFix);
      if (this.radius < 0.3){
        this.toRemove = true;
      }
    }
  }
}

class PreBurrowEffect extends Effect{
  constructor(burrow, burrows){
    super(0, getEffectPriority("PreBurrowEffect"), false, true);
    this.burrow = burrow;
    this.burrows = burrows;
  }
  doEffect(target){
    if (!target.hasOwnProperty("burrowProgress")){
      target.burrowProgress = 0;
    }
    target.burrowProgress += 0.04 * tFix;
    target.tempColor = lerpCol(target.tempColor, target.burrowProgress, 51, 17, 0);
    if (target.burrowProgress >= 1){
      let otherBurrow = this.burrows.indexOf(this.burrow) === 0 ? this.burrows[1] : this.burrows[0];
      if (otherBurrow){
        target.gainEffect(new BurrowingEffect(otherBurrow))
      } else {
        target.burrowProgress = 1;
      }
    }
    for (var i = 0; i < target.effects.length; i++){
      if (target.effects[i].constructor.name === "PreBurrowPostEffect"){
        target.effects.splice(i, 1);
        i--;
      }
    }
  }
  removeEffectLate(target){
    target.gainEffect(new PreBurrowPostEffect());
  }
}

class PreBurrowPostEffect extends Effect{
  constructor(){
    super(-1, getEffectPriority("PreBurrowPostEffect"), false, false);
  }
  doEffect(target){
    for (let i in target.effects){
      if (!target.effects[i].toRemove && target.effects[i].constructor.name === "PreBurrowEffect"){
        this.toRemove = true;
      }
    }
    if (!target.hasOwnProperty("burrowProgress")) return;
    target.burrowProgress -= 0.15 * tFix;
    target.tempColor = lerpCol(target.tempColor, target.burrowProgress, 0, 0, 0);
    if (target.burrowProgress <= 0){
      this.toRemove = true;
    }
  }
}

class BurrowingEffect extends Effect{
  constructor(otherBurrow){
    super(-1, getEffectPriority["BurrowingEffect"], false, false);
    this.otherBurrow = otherBurrow;
    this.burrowSpeed = 20;
    this.removedOnDeath = true;
  }
  doEffect(target){
    target.invincible = true;
    target.alphaMultiplier = 0.2;
    target.burrowProgress = 0;
    if (this.otherBurrow.shrinking){
      this.toRemove = true;
    }
    let angle = atan2(this.otherBurrow.y - target.y, this.otherBurrow.x - target.x);
    target.x += cos(angle) * this.burrowSpeed;
    target.y += sin(angle) * this.burrowSpeed;
    if (dst(target, this.otherBurrow) < this.burrowSpeed){
      target.x = this.otherBurrow.x;
      target.y = this.otherBurrow.y;
      //come on man
      this.toRemove = true;
    }
  }
  removeEffect(target){
    if (target.dead) return;
    //target.gainEffect(new OrbitInvincibilityEffect(1000));
  }
}

class PostBurrowInvincibilityEffect extends Effect{
  constructor(){
    super(1000, getEffectPriority["GenericInvincibilityEffect"], false, false);
  }
  doEffect(target){
    target.invincible = true;
    let t = this.life / this.duration;
    target.tempColor = lerpCol(target.tempColor, t, 0, 0, 0);
    for (var i = 0; i < target.effects.length; i++){
      if (target.effects[i].constructor.name === "PreBurrowPostEffect" || target.effects[i].constructor.name === "PreBurrowEffect"){
        target.effects.splice(i, 1);
        i--;
      }
    }
  }
}

class Pit extends Ability{
  constructor(){
    super(5, [21000, 19000, 17000, 15000, 13000], 40, "ab.pit");
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    area.addEnt(new PitProjectile(player.x, player.y, area, player))
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    
  }
}

class PitProjectile extends Projectile{
  constructor(x, y, area, player){
    super(x, y, 0, 0, -1, -1, 0, "#22110066", area, player, z.blackHole, [], "noOutline", 0, false)
    this.state = "growing";
    this.clock = 0;
    this.maxRadius = 180;
  }
  behavior(area, players){
    this.clock += dTime;
    if (this.state === "growing"){
      this.radius += (this.maxRadius - this.radius) * 0.1;
      if (this.clock > 5000){
        this.state = "shrinking";
      }
    }
    if (this.state === "shrinking"){
      this.radius /= pow(1.2, tFix);
      if (this.radius < 0.5){
        this.toRemove = true;
      }
    }
  }
  detectContact(){
    if (this.shrinking) return;
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    if (this.state === "shrinking") return;
    enemy.gainEffect(new PitEffect(this));
  }
}

class PitEffect extends Effect{
  constructor(pit){
    super(0, getEffectPriority("PitEffect"), false, true);
    this.blockable = true;
    this.pit = pit;
    this.pitDrawStrength = 3.5;
  }
  doEffect(target){
    if (!target.hasOwnProperty("pitFactor")){
      target.pitFactor = 0;
    }
    target.speedMultiplier *= 0;
    target.pitFactor += 1.5 * tFix;
    if (target.pitFactor > 50) target.pitFactor = 50;
    target.radiusMultiplier *= (map(target.pitFactor, 0, 50, 1, 0, true));
    if (target.radiusMultiplier <= 0){
      target.radiusMultiplier = 0;
      target.speedMultiplier = 0;
      target.alphaMultiplier = 0;
    }
    let angle = atan2(this.pit.y - target.y, this.pit.x - target.x);
    let dist = dst(this.pit, target);
    let minDrawStrength = this.pitDrawStrength;
    if (dist > target.radius * target.radiusMultiplier + this.pit.radius){
      minDrawStrength = dist - target.radius * target.radiusMultiplier - this.pit.radius;
    }
    target.x += cos(angle) * max(this.pitDrawStrength, minDrawStrength) * tFix;
    target.y += sin(angle) * max(this.pitDrawStrength, minDrawStrength) * tFix;
    for (var i = 0; i < target.effects.length; i++){
      if (target.effects[i].constructor.name === "PitPostEffect"){
        target.effects.splice(i, 1);
        i--;
      }
    }
  }
  removeEffectLate(target){
    target.gainEffect(new PitPostEffect());
    if (target.pitFactor === 50){
      //randomize target position
      target.x = random(target.parentZone.x, target.parentZone.x + target.parentZone.width);
      target.y = random(target.parentZone.y, target.parentZone.y + target.parentZone.height);
    }
  }
}

class PitPostEffect extends Effect{
  constructor(){
    super(-1, getEffectPriority("PitPostEffect"), false, false);
  }
  doEffect(target){
    for (let i in target.effects){
      if (!target.effects[i].toRemove && target.effects[i].constructor.name === "PitEffect"){
        this.toRemove = true;
      }
    }
    if (!target.hasOwnProperty("pitFactor")) return;
    target.speedMultiplier *= 0.3;
    target.pitFactor -= 1 * tFix;
    target.radiusMultiplier *= (map(target.pitFactor, 0, 50, 1, 0, true));
    target.harmless = true;
    target.alphaMultiplier = 0.4;
    if (target.pitFactor <= 0){
      this.toRemove = true;
    }
  }
}