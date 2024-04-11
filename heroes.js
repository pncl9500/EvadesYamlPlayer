class Magmax extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.heroes.magmax, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Magmax";
  }
}