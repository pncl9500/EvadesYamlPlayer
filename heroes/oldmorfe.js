class OldMorfe extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.morfe, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "OG Morfe";
    this.ability1 = new OldReverse();
    this.ability2 = new OldMinimize();
  }
}

class OldMinimize extends Ability{
  constructor(){
    super(5, 2000, 15, im.ab.minimize);
    this.projectileCounts = [2,3,4,5,6];
    this.fanAngles = [PI/180 * 10, PI/180 * 20, PI/180 * 30, PI/180 * 40, PI/180 * 50];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    let fanAngle = this.fanAngles[this.tier - 1];
    let entitiesAffectedByAbility = [];
    for (var i = 0; i < projCount; i++){
      let ang = player.lastDir - fanAngle / 2 + i * fanAngle / (max(projCount - 1, 1));
      area.addEnt(new OldMinimizeProjectile(player.x, player.y, ang, area, player, entitiesAffectedByAbility));
    }
  }
}

class OldMinimizeProjectile extends Projectile{
  constructor(x, y, angle, area, player, entitiesAffectedByAbility, lifetime = 700){
    super(x, y, angle, 22, lifetime, 0, 10, "ff0000", area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline");
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.gainEffect(new OldMinimizeEffect());
  }
}

class OldMinimizeEffect extends Effect{
  constructor(duration = 4000){
    super(duration, getEffectPriority("MinimizeEffect"), false);
  }
  doEffect(target){
    target.speedMultiplier *= 0.5;
    target.radiusMultiplier *= 0.5; 
  }
}

class OldReverse extends Ability{
  constructor(){
    super(5, 2000, 15, im.ab.reverse);
    this.projectileCounts = [2,3,4,5,6];
    this.fanAngles = [PI/180 * 10, PI/180 * 20, PI/180 * 30, PI/180 * 40, PI/180 * 50];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    let fanAngle = this.fanAngles[this.tier - 1];
    let entitiesAffectedByAbility = [];
    for (var i = 0; i < projCount; i++){
      let ang = player.lastDir - fanAngle / 2 + i * fanAngle / (max(projCount - 1, 1));
      area.addEnt(new OldReverseProjectile(player.x, player.y, ang, area, player, entitiesAffectedByAbility));
    }
  }
}

class OldReverseProjectile extends Projectile{
  constructor(x, y, angle, area, player, entitiesAffectedByAbility, lifetime = 1500){
    super(x, y, angle, 22, lifetime, 0, 10, "00dd00", area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline");
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.velToAngle();
    enemy.angle = this.angle;
    enemy.oldAngle = this.angle;
    enemy.speedToVel();
  }
}