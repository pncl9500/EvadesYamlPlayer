class Mirage extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.mirage, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Mirage";
    this.ability1 = new Shift();
    this.ability2 = new Obscure();
  }
}

class Shift extends Ability{
  constructor(){
    super(5, [26000, 23000, 20000, 17000, 14000], 30, "ab.shift");
    this.usableWhileDead = true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.x = player.mostRecentSafeX;
    player.y = player.mostRecentSafeY;
  }
}

class Obscure extends Ability{
  constructor(){
    super(5, [4500, 4000, 3500, 3000, 2500], 15, "ab.obscure");
    this.usableWhileDead = true;
    this.invin = 1000;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    area.addEnt(new ObscureProjectile(player.lastDir, player, this.invin));
  }
}

class ObscureProjectile extends Projectile{
  constructor(angle, parent, invin){
    let speed = 52
    let lifetime = 400;
    super(parent.x, parent.y, angle, speed, lifetime, -1, 15, pal.hero.mirage, parent.area, parent, z.genericProjectile);
    this.parent = parent;
    this.invin = invin;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    this.parent.gainEffect(new ObscureEffect());
    this.parent.x = enemy.x;
    this.parent.y = enemy.y;
    this.toRemove = true;
  }
}

class ObscureEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("GenericInvincibilityEffect"), false, true);
  }
  doEffect(target){
    target.invincible = true;
    target.tempColor = {r: 0, g: 0, b: 75};
  }
}