class Tecto extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.tecto, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Tecto";
    this.ability1 = new Impulse();
    this.ability2 = new BlankAbility();
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