class Chrono extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.chrono, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Chrono";
    this.ability1 = new Backtrack();
    this.ability2 = new Rewind();
    this.previousStates = [];
    this.clock = 0;
    
    this.backtrackLength = 2000;
    this.firstStateArea = this.area;
  }
  instantRespawnAppropriate(){
    //when is instant respawn appropriate?
    //if backtrack cooldown > 2000
    //if you are going to backtrack onto an enemy
    if (this.ability1.currentCooldown > this.backtrackLength){
      return true;
    }
    //other cases, return false
    return false;
  }
  behavior(){
    let timer;
    this.deathEffect && (timer = this.deathEffect.life);
    this.clock += dTime;
    this.previousStates.push({
      x: this.x,
      y: this.y,
      dead: this.dead,
      deathTimer: timer,
      time: this.clock,
    });
    //if player's area is not the same as its states, remove all states
    if (this.firstStateArea !== this.area){
      this.previousStates = [];
      this.firstStateArea = this.area;
    }
    this.cullOldStates();

    if (settings.instantRespawn && this.deathEffect && this.deathEffect.life < this.deathTimer - 4400){
      this.x = this.mostRecentSafeZone.x + this.mostRecentSafeZone.width / 2;
      this.y = this.mostRecentSafeZone.y + this.mostRecentSafeZone.height / 2;
      this.revive();
    }
  }
  cullOldStates(){
    for (let i = 0; i < this.previousStates.length; i++){
      if ((this.clock - this.previousStates[i].time) > this.backtrackLength){
        this.previousStates.splice(i, 1);
        i--;
      } else {
        break;
      }
    }
  }
  //chrono shadow or whatever (for testing);
  // drawFrontExtra(){
  //   if (this.previousStates.length === 0){
  //     return;
  //   }
  //   noFill();
  //   stroke(this.color.r / 2, this.color.g / 2, this.color.b / 2);
  //   strokeWeight(3);
  //   let x = this.previousStates[0].x;
  //   let y = this.previousStates[0].y;
  //   ellipse(x, y, 15);
  // }
}

class Backtrack extends Ability{
  constructor(){
    super(5, [7500, 7000, 6500, 5000, 5500], 30, "ab.backtrack");
    this.backtrackLength = 2000;
    this.usableWhileDead = true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let state = player.previousStates[0];
    if (!state) return;
    player.x = state.x;
    player.y = state.y;
    !state.dead && player.dead && player.revive();
    state.dead && !player.dead && player.die();
    state.dead && (player.deathEffect.life = state.deathTimer);
  }
}

class Rewind extends ToggleAbility{
  constructor(){
    super(5, [7000, 6500, 6000, 5500, 5000], 15, "ab.rewind");
    this.ranges = [100, 115, 130, 145, 160];
    this.rewindLength = 2000;
    this.slowEffects = [0.7, 0.6, 0.5, 0.4, 0.3];
    this.effectLength = 3000;
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#00fa6c25", z.genericAura + random() * z.randEpsilon);

    this.backwardsSimulationSteps = 200;
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
    let affectedEnts = getEntsInRadius(enemies, player.x, player.y, this.ranges[this.tier - 1]);
    for (let i in affectedEnts){
      affectedEnts[i].gainEffect(new RewindEffect(this.effectLength, this.slowEffects[this.tier - 1]));
      //MOOOOOOOOOOVE!
      if (affectedEnts[i].immune) continue;
      affectedEnts[i].speedMultiplier *= -1;
      let tempDtime = dTime;
      let tempTfix = tFix;
      let dt = this.rewindLength / this.backwardsSimulationSteps;
      let tf = dt / (1000 / 60) / 2;
      dTime = dt;
      tFix = tf;
      affectedEnts[i].harmless = true;
      affectedEnts[i].alphaMultiplier = 0.4;
      for (let s = 0; s < this.backwardsSimulationSteps; s++){
        affectedEnts[i].update(area, players, true);
      }
      dTime = tempDtime;
      tFix = tempTfix;
      affectedEnts[i].speedMultiplier *= -1;
    }
  }
}

class RewindEffect extends Effect{
  constructor(time, slow){
    super(time, getEffectPriority("RewindEffect"), false, true);
    this.slow = slow;
  }
  doEffect(target){
    target.speedMultiplier *= this.slow;
    target.harmless = true;
    target.alphaMultiplier = 0.4;
  }
}