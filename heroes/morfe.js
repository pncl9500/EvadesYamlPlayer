class Morfe extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.morfe, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Morfe";
    this.ability1 = new Reverse();
    this.ability2 = new Minimize();
  }
}

class Reverse extends Ability{
  constructor(){
    super(5, 3000, 10, im.ab.reverse);
    this.projectileCounts = [1,2,3,4,5];
    this.fanAngles = [0, PI/180 * 10, PI/180 * 20, PI/180 * 30, PI/180 * 40];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    let fanAngle = this.fanAngles[this.tier - 1];
    let entitiesAffectedByAbility = [];
    for (var i = 0; i < projCount; i++){
      let ang = player.lastDir - fanAngle / 2 + i * fanAngle / (max(projCount - 1, 1));
      let rpr = new ReverseProjectile(player.x, player.y, ang, area, player, entitiesAffectedByAbility, this);
      area.addEnt(rpr);
    }
  }
}

class Minimize extends Ability{
  constructor(){
    super(5, 1500, 10, im.ab.minimize);
    this.projectileCounts = [2,3,4,5,6];
    this.fanAngles = [PI/180 * 10, PI/180 * 20, PI/180 * 30, PI/180 * 40, PI/180 * 50];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    let fanAngle = this.fanAngles[this.tier - 1];
    let entitiesAffectedByAbility = [];
    for (var i = 0; i < projCount; i++){
      let ang = player.lastDir - fanAngle / 2 + i * fanAngle / (max(projCount - 1, 1));
      area.addEnt(new MinimizeProjectile(player.x, player.y, ang, area, player, entitiesAffectedByAbility));
    }
  }
}

class Projectile extends Entity{
  constructor(x, y, angle, speed, lifetime, bounces, radius, color, area, player, z, entitiesAffectedByAbility = [], renderType = "noOutline", fireOffset = 32){
    super(x, y, radius, color, z, renderType);
    this.angle = angle;
    this.xv = speed * cos(this.angle);
    this.yv = speed * sin(this.angle);
    this.speed = speed;
    this.lifetime = lifetime;
    this.bounces = bounces;
    this.area = area;
    this.bounds = area.bounds;
    this.x += fireOffset * cos(this.angle);
    this.y += fireOffset * sin(this.angle);
    this.entitiesAffectedByAbility = entitiesAffectedByAbility;
    this.wallBounce();
    //bounce count of -1: infinite bounces
  }
  update(){
    if (this.lifetime !== -1){
      this.lifetime -= deltaTime;
      if (this.lifetime < 0){
        this.toRemove = true;
        return;
      }
    }
    this.x += this.speed * cos(this.angle) * tFix;
    this.y += this.speed * sin(this.angle) * tFix;
    this.wallBounce();
    this.detectContact();
  }
  wallBounce(){
    let pb = this.bounces;
    this.x - this.radius < this.area.bounds.left && (this.x = this.area.bounds.left + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle(), this.bounces--, this.wallBounceEvent());
    this.x + this.radius > this.area.bounds.right && (this.x = this.area.bounds.right - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle(), this.bounces--, this.wallBounceEvent());
    this.y - this.radius < this.area.bounds.top && (this.y = this.area.bounds.top + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle(), this.bounces--, this.wallBounceEvent());
    this.y + this.radius > this.area.bounds.bottom && (this.y = this.area.bounds.bottom - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle(), this.bounces--, this.wallBounceEvent());
    if (pb === this.bounces){
      return;
    }
    if (this.bounces === -1){
      this.toRemove = true;
      return;
    }
  }
  wallBounceEvent(){
    
  }
  velToAngle(){
    this.angle = atan2(this.yv, this.xv);
  }
  angleToVel(){
    let mag = sqrt(this.xv * this.xv + this.yv * this.yv);
    this.xv = mag * cos(this.angle);
    this.yv = mag * sin(this.angle);
  }
  detectContact(){
    // this.detectPlayerContact();
    // this.detectEnemyContact();
    // this.detectPelletContact();
  }
  detectPlayerContact(){
    for (var i in this.area.players){
      if (circleCircle(this, this.area.players[i])){
        if (this.entitiesAffectedByAbility.includes(this.area.players[i])){
          continue;
        }
        this.contactEffect(this.area.players[i]);
        this.entitiesAffectedByAbility.push(this.area.players[i]);
      }
    }
  }
  detectEnemyContact(){ 
    for (var i in this.area.entities){
      if (this.area.entities[i].mainType === "enemy" && circleCircle(this, this.area.entities[i])){
        if (this.entitiesAffectedByAbility.includes(this.area.entities[i])){
          continue;
        }
        this.contactEffect(this.area.entities[i]);
        this.entitiesAffectedByAbility.push(this.area.entities[i]);
      }
    }
  }
  detectPelletContact(){
    for (var i in this.area.entities){
      if (this.area.entities[i].mainType === "pellet" && circleCircle(this, this.area.entities[i])){
        if (this.entitiesAffectedByAbility.includes(this.area.entities[i])){
          continue;
        }
        this.contactEffect(this.area.entities[i]);
        this.entitiesAffectedByAbility.push(this.area.entities[i]);
      }
    }
  }
}

class ReverseProjectile extends Projectile{
  constructor(x, y, angle, area, player, entitiesAffectedByAbility, sourceAbility, lifetime = 300){
    super(x, y, angle, 42, lifetime, -1, 22, "00dd00", area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline");
    this.sourceAbility = sourceAbility;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.angleToVel();
    enemy.xv *= -1;
    enemy.yv *= -1;
    enemy.velToAngle();
    let ef = new RevivingEnemyEffect();
    ef.sourceAbility = this.sourceAbility;
    for (var i = 0; i < enemy.effects.length; i++){
      if (enemy.effects[i].constructor.name === "RevivingEnemyEffect" && enemy.effects[i].sourceAbility !== this.sourceAbility){
        enemy.effects[i].toRemove = true;
        return;
      }
    }
    enemy.gainEffect(ef);
  }
}

class MinimizeProjectile extends Projectile{
  constructor(x, y, angle, area, player, entitiesAffectedByAbility, lifetime = 700){
    super(x, y, angle, 22, lifetime, -1, 10, "ff0000", area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline");
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.gainEffect(new MinimizeEffect());
  }
}

class MinimizeEffect extends Effect{
  constructor(duration = 4000){
    super(duration, effectPriorities["MinimizeEffect"], false);
  }
  doEffect(target){
    target.speedMultiplier *= 0.25;
    target.radiusMultiplier *= 0.5; 
  }
}

class RevivingEnemyEffect extends Effect{
  constructor(duration = 4000){
    super(duration, effectPriorities["RevivingEnemyEffect"], false);
    this.pcf = (player) => {
      player.revive();
    }
  }
  doEffect(target){
    target.harmless = true;
    target.tempColor = {r: 0, g: 180, b: 0};
    target.alphaMultiplier = 0.5;
  }
  gainEffect(target){
    target.playerContactFunctions.push(this.pcf)
  }
  removeEffect(target){
    target.playerContactFunctions.splice(target.playerContactFunctions.indexOf(this.pcf));
  }
}