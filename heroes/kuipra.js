class Kuipra extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.kuipra, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Kuipra";
    this.ability1 = new Tailwind();
    this.ability2 = new Energize();
  }
}

class Tailwind extends Ability{
  constructor(){
    super(5, 0, 0, "ab.energize");
    this.projectiles = [];
    this.rates = [8500, 7000, 5500, 4000, 2500];
    this.timer = 0;
    this.projectileCount = 0;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier <= 0) {return}
    this.timer += dTime;
    if (this.timer > this.rates[this.tier - 1]) {
      this.timer = 0;
    }
  }
}