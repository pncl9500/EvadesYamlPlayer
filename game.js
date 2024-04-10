class Game{
  constructor(){
    this.regions = [];
    this.players = [];
    this.mainPlayer = null;
  }
  update(){
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
  }
  addRegion(region){
    this.regions.push(region);
  }
  draw(){
    this.mainPlayer.area.draw(this.mainPlayer.region);
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
  mainPlayer = new Player(176 + random(-64,64), 240 + random(-96,96), 16, {r: 255, g: 0, b: 0}, "TestPlayer", true, game, startingRegionId, startingAreaNum, [new WASDset, new ArrowSet]);
  game.setMainPlayer(mainPlayer);
  game.addPlayer(mainPlayer);
  return game;
}