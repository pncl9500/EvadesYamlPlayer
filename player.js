class Player extends Entity{
  constructor(x, y, radius, color, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, color, null, "noOutline")
    this.isMain = isMain;
    this.game = game;
    this.regionNum = regionNum;
    this.region = game.regions[regionNum];
    this.areaNum = areaNum;
    this.area = region.areas[areaNum];
    this.downed = false;
    this.name = name;
    this.speed = 5;
    this.tempSpeed = 5;
    this.regen = 1;
    this.maxEnergy = 30;
    this.energy = 30;
    this.level = 1;
    this.levelProgress = 0;
    this.levelProgressNeeded = 4;
    this.restricted = true;
    this.ctrlSets = ctrlSets;
  }
  update(){
    var ctrlVector = {x: 0, y: 0};
    for (var i in this.ctrlSets){
      var testCv = this.ctrlSets[i].getCtrlVector();
      if (testCv !== null){
        this.ctrlVector = testCv;
      }
    }
    this.xv = this.ctrlVector.x * this.tempSpeed * tFix;
    this.yv = this.ctrlVector.y * this.tempSpeed * tFix;
    this.x += this.xv;
    this.y += this.yv;
  }
  updateAsMain(){
    cameraFocusX = this.x;
    cameraFocusY = this.y;
  }
}