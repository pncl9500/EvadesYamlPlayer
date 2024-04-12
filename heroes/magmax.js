class Magmax extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.magmax, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Magmax";
    this.ability1 = new Flow();
    this.ability2 = new Harden();
  }
}

class Flow extends Ability{
  constructor(){
    super(5, 0, 2, im.ab.flow);
  }
  update(player){

  }
}

class Harden extends Ability{
  constructor(){
    super(5, [1250, 1000, 750, 500, 250], 12, im.ab.harden);
  }
}