class Game{
  constructor(){
    this.regions = [];
    this.players = [];
    this.mainPlayer = null;
  }
  update(){
    if (settings.invincibilityCheat){
      this.mainPlayer.gainEffect(new CheatInvincibilityEffect());
    }
    if (settings.infiniteAbilityUseCheat){
      this.mainPlayer.gainEffect(new CheatInfiniteAbilityEffect());
      this.mainPlayer.ability1.recharge(100000);
      this.mainPlayer.ability2.recharge(100000);
      this.mainPlayer.ability3.recharge(100000);
    }
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
      this.players[i].update();
    }
    this.mainPlayer.updateAsMain();
  }
  addPlayer(player){
    this.players.push(player);
  }
  setMainPlayer(player){
    this.mainPlayer = player;
    this.mainPlayer.z = z.mainPlayer;
  }
  addRegion(region){
    this.regions.push(region);
  }
  draw(){
    this.mainPlayer.area.draw(this.mainPlayer.region);
  }
  cycleMainPlayer(){
    this.mainPlayer.isMain = false;
    this.mainPlayer.z = z.player;
    let mainPlayerControls = this.mainPlayer.ctrlSets;
    this.mainPlayer.ctrlSets = [];
    let ind = this.players.indexOf(this.mainPlayer);
    ind++;
    ind %= this.players.length;
    this.mainPlayer = this.players[ind];
    this.mainPlayer.isMain = true;
    this.mainPlayer.z = z.mainPlayer;
    this.mainPlayer.ctrlSets = mainPlayerControls;
  }
}

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
  mainPlayer = new Magmax(176 + random(-64,64), 240 + random(-96,96), 16, "Player 1", true, game, startingRegionId, startingAreaNum, [new WASDset, new ArrowSet]);
  game.setMainPlayer(mainPlayer);
  game.addPlayer(mainPlayer);
  game.addPlayer(new Rime(176 + random(-64,64), 240 + random(-96,96), 16, "Player 2", false, game, startingRegionId, startingAreaNum, []));
  game.addPlayer(new Morfe(176 + random(-64,64), 240 + random(-96,96), 16, "Player 3", false, game, startingRegionId, startingAreaNum, []));
  game.addPlayer(new Aurora(176 + random(-64,64), 240 + random(-96,96), 16, "Player 4", false, game, startingRegionId, startingAreaNum, []));
  game.addPlayer(new Necro(176 + random(-64,64), 240 + random(-96,96), 16, "Player 5", false, game, startingRegionId, startingAreaNum, []));
  game.addPlayer(new Brute(176 + random(-64,64), 240 + random(-96,96), 16, "Player 6", false, game, startingRegionId, startingAreaNum, []));
  game.addPlayer(new Nexus(176 + random(-64,64), 240 + random(-96,96), 16, "Player 7", false, game, startingRegionId, startingAreaNum, []));
  return game;
}