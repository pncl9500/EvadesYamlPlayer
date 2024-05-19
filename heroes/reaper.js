class Reaper extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.reaper, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Reaper";
    this.ability1 = new Atonement();
    this.ability2 = new Depart();
  }
}

class Depart extends Ability{
  constructor(){
    super(5, 10000, 30, "ab.depart");
    this.speeds = [9, 9.5, 10, 10.5, 11];
    this.effectLengths = [2700, 2900, 3100, 3300, 3500];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new DepartEffect(this.effectLengths[this.tier - 1], this.speeds[this.tier - 1]));
  }
}

class DepartEffect extends Effect{
  constructor(duration, speed){
    super(duration, getEffectPriority("DepartEffect"));
    this.speed = speed;
  }
  doEffect(target){
    target.tempSpeed = this.speed;
    target.alphaMultiplier = 0;
    target.invincible = true;
    target.effectVulnerability = 0;
    target.fullEffectImmunity = true;
  }
}

class Atonement extends ToggleAbility{
  constructor(){
    super(5, [6000, 5500, 5000, 4500, 4000], 20, "ab.atonement");
    this.ranges = [130, 180, 230, 280, 330];
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#989C3125", z.genericAura + random() * z.randEpsilon);
    this.revivalDuration = 1500;
  }
  upgradeBehavior(player){
    this.aura.radius = this.ranges[this.tier - 1];
  }
  update(){
    this.currentCooldown -= dTime;
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
    //cancel depart
    for (let i = 0; i < player.effects.length; i++){
      if (player.effects[i].constructor.name === "DepartEffect"){
        player.effects.splice(i, 1);
        i--;
      }
    }
    let affectedEnts = getEntsInRadius(players, player.x, player.y, this.ranges[this.tier - 1]);
    let deadPlayerFound = false;
    for (let i in affectedEnts){
      if (affectedEnts[i].heroName === "Reaper") return;
      if (!affectedEnts[i].dead) return;
      affectedEnts[i].gainEffect(new AtonementEffect(this.revivalDuration));
      deadPlayerFound = true;
    }
    if (deadPlayerFound) player.die();
  }
}

class AtonementEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("AtonementEffect"), false, true);
  }
  doEffect(target){
    target.doRevive = true;
    let t = this.life / this.duration;
    target.tempColor = lerpCol(target.tempColor, t, 255, 255, 255);
  }
}