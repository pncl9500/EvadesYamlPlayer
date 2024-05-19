class Chrono extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.chrono, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Chrono";
    this.ability1 = new Backtrack();
    this.ability2 = new Orbit();
    this.previousStates = [];
    this.clock = 0;
    
    this.backtrackLength = 2000;
    this.firstStateArea = this.area;
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