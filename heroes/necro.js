class Necro extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.necro, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Necro";
    this.ability1 = new Resurrection();
    this.ability2 = new Reanimate();
  }
  instantRespawnAppropriate(){
    return this.ability1.currentCooldown > 0;
  }
}

class Resurrection extends Ability{
  constructor(){
    super(1, 75, 0, "ab.resurrection");
    this.pelletBased = true;
    this.usableWhileDead = true;
    this.usableWhileAlive = false;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.revive();
  }
}

class Reanimate extends Ability{
  constructor(){
    super(5, [14000,12000,10000,8000,6000], 30, "ab.reanimate");
    this.projectileCounts = [1,2,3,4,5];
    this.fanAngles = [PI/180 * 0, PI/180 * 20, PI/180 * 20, PI/180 * 20, PI/180 * 20];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    let fanAngle = this.fanAngles[this.tier - 1];
    for (var i = 0; i < projCount; i++){
      let ang = player.lastDir - fanAngle / 2 + i * fanAngle / (max(projCount - 1, 1));
      area.addEnt(new ReanimateProjectile(player.x, player.y, ang, area, player));
    }
  }
}

class ReanimateProjectile extends Projectile{
  constructor(x, y, angle, area, player, entitiesAffectedByAbility = [], lifetime = 1500){
    super(x, y, angle, 26, lifetime, 0, 12, "ff00ff", area, player, z.genericProjectile, entitiesAffectedByAbility, "noOutline");
  }
  detectContact(){
    this.detectPlayerContact();
  }
  contactEffect(player){
    player.doRevive = true;
  }
}