class Lide extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.lide, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Lide";
    this.ability1 = new Distort();
    this.ability2 = new Energize();
  }
}
