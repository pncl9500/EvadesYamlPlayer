class Rameses extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.rameses, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Rameses";
    this.ability1 = new Bandages();
    this.ability2 = new Latch();
  }
}

class Bandages extends Ability{
  constructor(){
    super(5, [12000, 11000, 10000, 9000, 8000], 50, "ab.bandages");
    this.unbandagingDuration = 900;
    this.slowdown = 0.5;
    this.applyingBandages = false;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    if (player.hasEffect("BandageEffect") || player.hasEffect("UnbandagingEffect")) {
      this.cancelUse(player);
      return;
    }
    this.applyingBandages = true;
    player.gainEffect(new BandagingEffect(this.currentCooldown, this.slowdown));
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.applyingBandages && this.currentCooldown <= 0){
      this.giveBandages(player);
    }
  }
  giveBandages(player){
    player.gainEffect(new BandageEffect(this.unbandagingDuration));
    //remove bandaging effect if recharged early early
    for (let i = 0; i < player.effects.length; i++){
      if (player.effects[i].constructor.name === "BandagingEffect"){
        player.effects.splice(i, 1);
        i--;
      }
    }
    this.applyingBandages = false;
  }
  startCooldown(player){
    this.currentCooldown = (this.cooldowns[this.tier - 1] * (this.pelletBased ? 1 : player.cooldownMultiplier));
    if (player.hasEffect("SafeZoneEffect")){
      this.currentCooldown /= 2;
    }
    this.cooldownOfPreviousUse = this.currentCooldown;
  }
}

class BandagingEffect extends Effect{
  constructor(duration, slowdown){
    super(duration, getEffectPriority("BandagingEffect"), false, false);
    this.slowdown = slowdown;
  }
  doEffect(target){
    target.speedMultiplier *= this.slowdown;
  }
}

class BandageEffect extends Effect{
  constructor(unbandagingDuration){
    super(-1, getEffectPriority("BandagingEffect"), false, false);
    this.unbandagingDuration = unbandagingDuration;
  }
  gainEffect(target){
    this.bandageVisualOutline = new LockedAura(target, target.radius + 3.1, "#aeac97", 0);
    this.bandageVisual = new LockedAura(target, target.radius + 2.5, "#dddac1", 0);
    target.addAura(this.bandageVisualOutline);
    target.addAura(this.bandageVisual);
  }
  doEffect(target){
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    if (contactedEnemy.corrosive){
      target.die();
      return;
    }
    target.gainEffect(new UnbandagingEffect(this.unbandagingDuration, target, this.bandageVisual, this.bandageVisualOutline));
    this.toRemove = true;
  }
}

class UnbandagingEffect extends Effect{
  constructor(duration, player, bandageVisual, bandageVisualOutline){
    super(duration, getEffectPriority("UnbandagingEffect"), false, false);
    this.bandageVisual = bandageVisual;
    this.bandageVisualOutline = bandageVisualOutline;
    this.shrinkSpeed = (bandageVisualOutline.radius - player.radius) / duration;
  }
  doEffect(target){
    target.invincible = true;
    //is this right???
    target.fullEffectImmunity = true;
    target.effectVulnerability = 0;
    this.bandageVisual.radius -= this.shrinkSpeed * dTime;
    this.bandageVisualOutline.radius -= this.shrinkSpeed * dTime;
  }
  removeEffect(target){
    this.bandageVisual.toRemove = true;
    this.bandageVisualOutline.toRemove = true;
  }
}

class Latch extends Ability{
  constructor(){
    super(5, [8000, 7500, 7000, 6500, 6000], 15, "ab.latch");
    this.unbandagingDuration = 900;
  }
  useConditionSatisfied(player){
    return player.hasEffect("BandageEffect");
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let latchProj = new LatchProjectile(player.x, player.y, player.lastDir, area, player);
    area.addEnt(latchProj);
  }
}

class LatchProjectile extends Projectile{
  constructor(x, y, angle, area, player){
    super(x, y, angle, 21, 1800, -1, 24, "#ddddaa", area, player, z.genericProjectile, [], "noOutline", 32, true);
    this.targetAngle = angle;
    //what are the numbers supposed to be here? speed and lifetime are unclear too.
    this.homingRange = 280;
    this.turningSpeed = 0.1;
  }
  drawFrontExtra(){
    noFill();
    strokeWeight(4);
    stroke(40, 100, 50);
    ellipse(this.x, this.y, this.radius - 4 / 2);
  }
  behavior(area, players) {
    this.redirect(area, players);
  }
  redirect(area, players){
    var min = this.homingRange;
    var index;
    this.targetAngle = this.angle;
    for (var i in players) {
      if (players[i] === this.player) continue;
      let dist = sqrt(sq(this.x - players[i].x) + sq(this.y - players[i].y))
      if (dist < min) {
        min = sqrt(sq(this.x - players[i].x) + sq(this.y - players[i].y));
        index = i;
      }
    }
    this.velToAngle();
    if (index != undefined) {
      var dX = players[index].x - this.x
      var dY = players[index].y - this.y
      this.targetAngle = atan2(dY, dX);
    }
    var dif = this.targetAngle - this.angle;
    var angleDif = Math.atan2(Math.sin(dif), Math.cos(dif));
    var angleIncrement = this.turningSpeed;
    if (Math.abs(angleDif) >= angleIncrement) {
      if (angleDif < 0) {
        this.angle -= angleIncrement * tFix
      } else {
        this.angle += angleIncrement * tFix
      }
    }
    this.angleToVel();
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    if (player === this.player) return;
    this.toRemove = true;
    let bandageVisualOutline = new LockedAura(player, player.radius + 3.1, "#aeac97", 0);
    let bandageVisual = new LockedAura(player, player.radius + 2.5, "#dddac1", 0);
    player.addAura(bandageVisualOutline);
    player.addAura(bandageVisual);
    player.gainEffect(new UnbandagingEffect(900, player, bandageVisual, bandageVisualOutline));
    this.player.x = player.x;
    this.player.y = player.y;
  }
}