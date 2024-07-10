//1 crumble: -5 radius
//2 crumble: -7 radius
//3 crumble: -8 radius

class Boldrock extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.boldrock, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Boldrock";
    this.ability1 = new Crumble(this);
    this.ability2 = new Earthquake(this);
    this.crumbleStage = 0;
  }
  die(){
    if (!settings.rechargeCooldownOnDeath){
      this.crumbleStage = 0;
      this.ability1.reduc = 0;
    }
    super.die();
  }
}

class Crumble extends Ability{
  constructor(parent){
    super(5, [9, 8, 7, 6, 5], 0, "ab.crumble");
    this.pelletBased = true;
    this.parent = parent;
    this.reduc = 0;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    this.parent.crumbleStage++;
    if (this.parent.crumbleStage >= 3) this.parent.crumbleStage = 3;
    this.reduc = 0;
    if (this.parent.crumbleStage >= 1) this.reduc += 5;
    if (this.parent.crumbleStage >= 2) this.reduc += 2;
    if (this.parent.crumbleStage >= 3) this.reduc += 1;

    let ang = Math.random() * 2 * PI;
    for (let i = 0; i < 5; i++){
      let off = i * 2 * PI / 5;
      area.addEnt(new CrumbleProjectile(this.parent, ang + off))
    }
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new CrumbleReduc(this.reduc));
  }
}

class CrumbleReduc extends Effect{
  constructor(reduc){
    super(0, getEffectPriority("CrumbleReduc"), false, true);
    this.reduc = reduc;
  }
  doEffect(target){
    let mul = (15 - this.reduc) / 15;
    target.tempRadius *= mul;
  }
}

class CrumbleProjectile extends Projectile{
  constructor(parent, angle){
    let reduced;
    reduced = ((parent.region.properties && parent.region.properties.crumble_reduced) || (parent.area.properties && parent.area.properties.crumble_reduced));
    super(parent.x, parent.y, angle, 18, reduced ? 500 : 3000, -1, 9, pal.hero.boldrock, parent.area, parent, z.genericProjectile, [], "noOutline", 8, true);
    this.clock = 0;
    this.parent = parent;
  }
  behavior(){
    this.clock += dTime;
    if (this.clock > 101){
      this.speed = 0;
    }
    if (this.lifetime < 500){
      this.alphaMultiplier = this.lifetime / 500;
    }
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    this.parent.gainEffect(new OrbitInvincibilityEffect(1000));
    this.toRemove = true;
  }
}

class Earthquake extends ToggleAbility{
  constructor(parent){
    super(5, 3000, 15, "ab.earthquake");
    this.ranges = [100, 120, 140, 160, 180];
    this.duration = 6000;
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#a1844639", z.genericAura + random() * z.randEpsilon);
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
      if (!affectedEnts[i].hasEffect("EarthquakeEffect")){
        //spawn residue
        area.addEnt(new EarthquakeResidue(affectedEnts[i], player));
      }
      affectedEnts[i].gainEffect(new EarthquakeEffect(this.duration));
    }
  }
}

class EarthquakeEffect extends Effect{
  constructor(duration = 6000){
    super(duration, getEffectPriority("EarthquakeEffect"), false);
    this.speedMul = 0.25;
    this.radiusMul = 0.5;
  }
  doEffect(target){
    target.speedMultiplier *= this.speedMul;
    target.radiusMultiplier *= this.radiusMul; 
  }
  removeEffectLate(target){
    target.gainEffect(new SizeRecoveryEffect(this.radiusMul, 2500));
  }
}

class EarthquakeResidue extends Projectile{
  constructor(enemy, parent){
    super(enemy.x, enemy.y, Math.random() * 2 * PI, 1, 3000, -1, enemy.radius * enemy.radiusMultiplier * 0.4, "#523e2539", parent.area, parent, z.genericProjectile, [], "outline", 8, true);
    this.clock = 0;
    this.parent = parent;
  }
  behavior(){

  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    if (this.parent !== player) return;
    this.toRemove = true;
    this.parent.ability1.currentCooldown -= 2;
    this.parent.ability2.currentCooldown -= 750;
  }
}