class Candy extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.candy, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Candy";
    this.ability1 = new BlankAbility();
    this.ability2 = new BlankAbility();
  }
}