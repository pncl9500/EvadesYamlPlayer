class Chrono extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.chrono, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Chrono";
    this.ability1 = new BlackHole();
    this.ability2 = new Orbit();
    this.previousStates = [];
    this.clock = 0;
    
    this.backtrackLength = 2000;
  }
  behavior(){
    let timer;
    this.deathEffect && (timer = this.deathEffect.life);
    debugValue = timer;
    this.clock += dTime;
    this.previousStates.push({
      x: this.x,
      y: this.y,
      dead: this.dead,
      deathTimer: timer,
      time: this.clock,
    });
    this.cullOldStates();
  }
  cullOldStates(){
    if (this.previousStates[0].time){

    }
  }
}
