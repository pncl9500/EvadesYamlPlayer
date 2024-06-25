fileImporterOpen = false
function makeFileInput(){
  regionFileInput = createFileInput(handleRegionFile, false);
  regionFileInput.position(windowWidth / 2, windowHeight / 2);
  regionFileInput.hide();
}
function tryImportSelector(){
  fileImporterOpen = true;
  regionFileInput.position(windowWidth / 2, windowHeight / 2);
  regionFileInput.show();
}

function closeFileImporter(){
  fileImporterOpen = false;
  regionFileInput.hide();
}

function drawFileImporter(){
  background(0, 200);
  regionFileInput.position(windowWidth / 2, windowHeight / 2);
}

function handleRegionFile(file){
  clr();
  closeFileImporter();
  cheatMenuOpen = false;
  console.log("file:");
  console.log(file);
  yamlOverride = false;
  if (file.subtype === undefined) yamlOverride = true;
  if ((file.subtype !== "json") && (file.subtype !== "x-yaml") && !yamlOverride){
    cog(file.name + " is not in the correct format.");
    cog(`read subtype: ${file.subtype}`)
    return;
  }
  cog("Importing " + file.name + "...");
  if (file.subtype === "x-yaml" || yamlOverride){
    cog("File read as YAML");
    importYAMLmapFile(file);
  }
  if (file.subtype === "json"){
    cog("File read as JSON");
    importJSONmapFile(file);
  }
  cog(" ")
  cog("Please note that map behavior may not be accurate to")
  cog("the vanilla game or other sandboxes.")
}

function importJSONmapFile(file){
  json = file.data;
  let region = new Region(json.name, json.properties, json.areas, true);
  createImportGame(region);
}

function importYAMLmapFile(file){
  console.log(2);
  let yaml = file.data;
  console.log("pre:")
  console.log(yaml);
  if (file.subtype === undefined){
    yaml = atob(yaml.substring(36));
  } else {
    yaml = atob(yaml.substring(31));
  }
  console.log("post:")
  console.log(yaml);
  let region = regionFromYAML(yaml, true);
  createImportGame(region);
}

function createImportGame(region){
  let newGame = new Game();
  newGame.regions = [region]; 
  newGame.setMainPlayer(game.mainPlayer);
  newGame.addPlayer(game.mainPlayer);
  newGame.mainPlayer.x = 176 + random(-64,64);
  newGame.mainPlayer.y = 240 + random(-96,96);
  game = newGame;
  game.mainPlayer.game = game;
  game.mainPlayer.region = game.regions[0];
  game.mainPlayer.area = game.regions[0].areas[0];
  game.mainPlayer.resetToSpawn();
}