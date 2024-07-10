//1 crumble: -5 radius
//2 crumble: -7 radius
//3 crumble: -8 radius

class Boldrock extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.boldrock, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Boldrock";
    this.ability1 = new Crumble(this);
    this.ability2 = new BlankAbility();
    this.crumbleStage = 0;
  }
  die(){
    this.crumbleStage = 0;
    this.ability1.reduc = 0;
    super.die();
  }
}

class Crumble extends Ability{
  constructor(parent){
    super(5, [9, 8, 7, 6, 5], 0, "ab.crumble");
    this.pelletBased = true;
    this.parent = parent;
    this.reduc = 0;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    this.parent.crumbleStage++;
    if (this.parent.crumbleStage >= 3) this.parent.crumbleStage = 3;
    this.reduc = 0;
    if (this.parent.crumbleStage >= 1) this.reduc += 5;
    if (this.parent.crumbleStage >= 2) this.reduc += 2;
    if (this.parent.crumbleStage >= 3) this.reduc += 1;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new CrumbleReduc(this.reduc));
  }
}

class CrumbleReduc extends Effect{
  constructor(reduc){
    super(0, getEffectPriority("CrumbleReduc"), false, true);
    this.reduc = reduc;
  }
  doEffect(target){
    let mul = (15 - this.reduc) / 15;
    target.tempRadius *= mul;
  }
}


