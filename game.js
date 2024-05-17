class Game{
  constructor(){
    this.regions = [];
    this.players = [];
    this.mainPlayer = null;
  }
  draw(){
    this.mainPlayer.area.draw(this.mainPlayer.region);
  }
  update(){
    this.doSettingEffects();
    //loop through every player and update their areas
    var areasToUpdate = [];
    for (var i in this.players){
      if (areasToUpdate.indexOf(this.players[i].area) === -1){
        areasToUpdate.push(this.players[i].area);
      }
    }
    for (var i in areasToUpdate){
      areasToUpdate[i].update();
    }
    //update all players - we don't do this earlier since it seems better to update
    //all players after updating the areas because idk
    //better to keep things separate
    for (var i in this.players){
      this.players[i].tempColor.r = this.players[i].color.r;
      this.players[i].tempColor.g = this.players[i].color.g;
      this.players[i].tempColor.b = this.players[i].color.b;
      this.players[i].tempColor.a = this.players[i].color.a;
      this.players[i].tempRadius = this.players[i].radius;
      this.players[i].update();
    }
    this.mainPlayer.updateAsMain();
  }
  addPlayer(player, ind = null){
    if (ind === null){
      this.players.push(player);
      return;
    }
    this.players.splice(ind, 0, player);
  }
  setMainPlayer(player){
    this.mainPlayer = player;
    this.mainPlayer.z = z.mainPlayer;
  }
  addRegion(region){
    this.regions.push(region);
  }
  cycleMainPlayer(){
    if (this.players.length === 0){
      return;
    }
    this.mainPlayer.isMain = false;
    this.mainPlayer.z = z.player;
    if (settings.changeCtrlsOnCycle){
      var mainPlayerControls = this.mainPlayer.ctrlSets;
      this.mainPlayer.ctrlSets = [];
    }
    let ind = this.players.indexOf(this.mainPlayer);
    ind++;
    ind %= this.players.length;
    this.mainPlayer = this.players[ind];
    this.mainPlayer.isMain = true;
    this.mainPlayer.z = z.mainPlayer;
    if (settings.changeCtrlsOnCycle){
      this.mainPlayer.ctrlSets = mainPlayerControls;
    }
  }
  doSettingEffects(){
    if (settings.invincibilityCheat){
      this.mainPlayer.gainEffect(new CheatInvincibilityEffect());
    }
    if (settings.infiniteAbilityUseCheat){
      this.mainPlayer.gainEffect(new CheatInfiniteAbilityEffect());
      this.mainPlayer.ability1.recharge(100000);
      this.mainPlayer.ability2.recharge(100000);
      this.mainPlayer.ability3.recharge(100000);
    }
    if (settings.wobblyMode){
      wobbleClock = frameCount / settings.fps;
      timeScale = 1 + sin(wobbleClock * settings.wobbleFrequency * 8) / 1.5;
    }
  }
}
wobbleClock = 0;

startingRegionName = "Central Core";
startingAreaNum = 0;
// startingRegionName = "Monumental Migration";
// startingAreaNum = 479;

function initGame(){
  var game = new Game();
  addVanillaRegionsToGame(game);
  startingRegionId = 0;
  for (var i in game.regions){
    if (game.regions[i].name === startingRegionName){
      startingRegionId = i;
      break;
    }
  }
  mainPlayer = new Magmax(176 + random(-64,64), 240 + random(-96,96), gameConsts.defaultPlayerSize, "Player 1", true, game, startingRegionId, startingAreaNum, [new WASDset(), new ArrowSet(), new MouseSet()]);
  game.setMainPlayer(mainPlayer);
  game.addPlayer(mainPlayer);
  return game;
}