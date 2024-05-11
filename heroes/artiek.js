class Artiek extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.artiek, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Artiek";
    this.ability1 = new Sear();
    this.ability2 = new Fizzle();
  }
}

class Sear extends Ability{
  constructor(){
    super(5, 6000, 15, im.ab.sear);
    this.speedGains = [0, 1.25, 2.5, 3.75, 5];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    //player.gainEffect(new SearEffect(3500, this.speedGains[this.tier - 1]));
  }
}

class FadingAura extends Entity{
  constructor(x, y, radius, color, z, startingAlphaMul, fadeSpeed){
    super(x, y, radius, color, z, "noOutline");
    this.alphaMul = startingAlphaMul;
    this.fadeSpeed = fadeSpeed;
    console.log(this);
  }
  update(){
    this.alphaMul -= this.fadeSpeed * tFix;
    this.alphaMultiplier = this.alphaMul;
    if (this.alphaMul <= 0){
      this.toRemove = true;
    }
  }
}

class Fizzle extends Ability{
  constructor(){
    super(5, 250, 20, im.ab.fizzle);
    this.passive = true;
    this.onDeathPassive = true;
    this.reviveRadii = [100, 125, 150, 175, 200];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let aura = new FadingAura(player.x, player.y, this.reviveRadii[this.tier - 1], pal.hero.artiek, 0.5, 0.25, 0.008);
    area.addEnt(aura)
    let furthestPlayer;
    let furthestRadius = 0;
    for (let i in players){
      if (!circleCircle(aura,players[i])) continue;
      if (players[i].constructor.name === player.constructor.name) continue;
      if (!players[i].dead) continue;
      if (furthestRadius < dst(player, players[i])){
        furthestRadius = dst(player, players[i]);
        furthestPlayer = players[i];
      }
    }
    if (furthestPlayer){
      furthestPlayer.revive();
    }
  }
}

class SearEffect extends Effect{
  constructor(duration, speedGain){
    super(duration, getEffectPriority("SearEffect"), false);
    this.speedGain = speedGain;
    this.playerSearCore = null;
  }
  doEffect(target){
    target.tempSpeed += this.speedGain;
    target.alphaMultiplier = 0.8;
    target.invincible = true;
    this.playerSearCore = new PlayerSearCore(target);
    target.area.addEnt(this.playerSearCore);
  }
  removeEffect(target){
    this.playerSearCore.toRemove = true;
  }
}

let artiekSearCoreRadius = 4;
class PlayerSearCore extends Entity{
  constructor(player){
    super(player.x, player.y, artiekSearCoreRadius, "#ffaaaa", 2.5, "noOutline");
    this.player = player;
    this.restricted = false;
  }
  update(area, players){
    this.x = this.player.x;
    this.y = this.player.y;
  }
  draw(){

  }
  preDraw(){
    this.x = this.player.x;
    this.y = this.player.y;
    console.log(this);
  }
}