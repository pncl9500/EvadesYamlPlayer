class Rime extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.rime, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Rime";
    this.ability1 = new Warp();
    this.ability2 = new Paralysis();
  }
}

class Warp extends Ability{
  constructor(){
    super(5, 300, 5, im.ab.warp);
    this.warpLengths = [80, 100, 120, 140, 160];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let warpLength = this.warpLengths[this.tier - 1];
    player.x += warpLength * cos(player.lastDir);
    player.y += warpLength * sin(player.lastDir);
  }
}

class Paralysis extends ToggleAbility{
  constructor(){
    super(5, 0, 15, im.ab.paralysis);
    this.ranges = [130, 150, 170, 190, 210];
    this.freezeTime = 2000;
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#00ffff39", 10);
  }
  upgradeBehavior(player){
    this.aura.radius = this.ranges[this.tier - 1];
  }
  update(){
    this.aura.update();
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    player.addAura(this.aura);
  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.toRemove = true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let affectedEnts = getEntsInRadius(enemies, player.x, player.y, this.ranges[this.tier - 1]);
    for (var i in affectedEnts){
      affectedEnts[i].gainEffect(new FreezeEffect(2000));
    }
  }
}

class FreezeEffect extends Effect{
  constructor(duration = 0){
    super(duration, effectPriorities[this.constructor.name], true);
  }
  doEffect(target){
    target.speedMultiplier = 0;
  }
}

