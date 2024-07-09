class Tecto extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.tecto, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Tecto";
    this.ability1 = new Impulse();
    this.ability2 = new Misery();
    this.ability1.upgradeWith = this.ability2;
  }
  die(){
    super.die();
    if (this.ability2.entity){
      this.ability2.entity.toRemove = true;
    }
  }
}

class Impulse extends Ability{
  constructor(){
    super(5, [2000, 1800, 1600, 1400, 1200], 10, "ab.impulse");
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let fakeEnemy = new Enemy(player.x - Math.cos(player.lastDir), player.y - Math.sin(player.lastDir), 0, 0, 32, "#000000")
    player.gainEffect(new CactusKnockbackEffect(fakeEnemy, 250, 100, true));
    player.gainEffect(new ImpulseEffect(250));
  }
}

class ImpulseEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("AstralProjectionPassiveEffect"), false, true);
  }
  doEffect(target){
    target.tempColor = {r: 120, g: 0, b: 0};
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    if (contactedEnemy.hasEffect("ShatterEffect")) return;
    this.toRemove = true;
    let fakeEnemy = new Enemy(target.x + Math.cos(target.lastDir), target.y + Math.sin(target.lastDir), 0, 0, 32, "#000000")
    target.gainEffect(new CactusKnockbackEffect(fakeEnemy, 1500, 3600, true));
    contactedEnemy.gainEffect(new ShatterEffect(3000));
    target.gainEffect(new ShatterEffect(750));
    target.gainEffect(new OrbitInvincibilityEffect(750));
  }
}

class Misery extends Ability{
  constructor(){
    super(1, 0, 0, "ab.misery");
    this.canBeUpgradedManually = false;
    this.entity = null;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (player.dead) return;
    if (this.tier === 0) return;
    if (miscEnts.includes(this.entity)) return;
    this.entity = new MiseryEntity(player);
    area.addEnt(this.entity);
  }
}

class MiseryEntity extends Entity{
  constructor(parent){
    super(parent.x, parent.y, parent.radius, "#000000", z.miseryEntity, "shattered");
    this.parent = parent;
    this.area = parent.area;
    this.startX = parent.x;
    this.startY = parent.y;
    this.renderType = "shattered";

    this.startTime = 850;

    this.shatterTimer = this.startTime;
    this.maxShatterTimer = this.startTime;

    this.clock = 0;
    this.speed = 0;
    this.maxSpeed = parent.speed * 1.2;
  }
  update(){
    if (this.area != this.parent.area){
      this.toRemove = true;
      return;
    }
    this.clock += dTime;
    if (this.clock < this.startTime) {
      this.shatterTimer -= dTime
    } else {
      this.shatterTimer = 0;
      this.renderType = "noOutline";
    }
    this.behavior();
  }
  draw(){
    push();
    translate(random(-3, 3), random(-3, 3));
    super.draw();
    pop();
  }
  behavior(){
    if (this.clock > this.startTime){
      this.chase();
      this.speed += this.maxSpeed * 0.07 * tFix;
      if (this.parent.hasEffect("SafeZoneEffect")){
        this.speed -= this.maxSpeed * 0.13 * tFix;
      }
      if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
      if (this.speed < 0) this.speed = 0;
    }
    }
  chase(){
    let ang = Math.atan2(this.parent.y - this.y, this.parent.x - this.x);
    let dist = dst(this.parent, this);
    let speedMultiplier = Math.max(1, (dist - 400) / 50);
    this.x += this.speed * sqcos(ang) * tFix * speedMultiplier;
    this.y += this.speed * sqsin(ang) * tFix * speedMultiplier;
    speedMultiplier *= this.parent.speedMultiplier;
    if (circleCircle(this, this.parent)){
      if (this.parent.hasEffect("SafeZoneEffect")) return;
      this.toRemove = true;
      if (this.parent.invincible && this.parent.corrosiveBypass) return;
      this.parent.die();
    }
  }
}