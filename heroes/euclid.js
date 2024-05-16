class Euclid extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.euclid, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Euclid";
    this.ability1 = new Night();
    this.ability2 = new Vengeance();
  }
}