class Mirage extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.mirage, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Mirage";
    this.ability1 = new Shift();
    this.ability2 = new BlankAbility();
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