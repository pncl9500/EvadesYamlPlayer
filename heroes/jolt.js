class Jolt extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.jolt, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Jolt";
    this.ability1 = new Vengeance();
    this.ability2 = new Charge();
    this.storedAbility = new Stomp();

    this.ability1.upgradeWith = this.storedAbility;
    this.storedAbility.upgradeWith = this.ability1;
  }
}

class Charge extends Ability{
  constructor(){
    super(5, 1000, 10, "ab.charge");
    this.ranges = [100, 125, 150, 175, 200];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.storedAbility.cooldownOfPreviousUse = player.ability1.cooldownOfPreviousUse;
    player.storedAbility.currentCooldown = player.ability1.currentCooldown;
    let tempStore = player.storedAbility;
    player.storedAbility = player.ability1;
    player.ability1 = tempStore;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0) return;
    let speed = 32;
    if (area.properties && area.properties.charge_reduced) speed = 4;
    for (let p in pellets){
      let pel = pellets[p]
      if (dst(pel, player) > this.ranges[this.tier - 1] + pel.radius) continue;
      let angle = atan2(player.y - pel.y, player.x - pel.x);
      pel.x += cos(angle) * speed * tFix;
      pel.y += sin(angle) * speed * tFix;
    }
  }
}