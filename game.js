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
    this.mainPlayer.area.draw();
    for (var i in this.players){
      this.players[i].draw();
    }
  }
}

function initGame(){
  game = new Game();
  cc = regionFromName("cc");
  game.addRegion(cc);

  mainPlayer = new Player(128, 256, 16, {r: 255, g: 0, b: 0}, "TestPlayer", true, game, 0, 0, [new WASDset, new ArrowSet, new MouseSet]);
  game.setMainPlayer(mainPlayer);
  game.addPlayer(mainPlayer);
  return game;
}