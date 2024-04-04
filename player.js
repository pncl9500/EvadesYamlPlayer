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
    this.ctrlVector = {x: 0, y: 0};
    this.effects = [];
    this.onTpZoneLastFrame = false;
  }
  //design this with the idea that it will be completely overriden in cent's code
  update(){
    if (keyIsDown(32)){
      this.speed += 0.2;
    }
    this.resetAllModifiers();

    this.applyEffects();



    //final pass
    this.ctrlVector = this.getControls();
    this.xv = this.ctrlVector.x * this.tempSpeed * tFix;
    this.yv = this.ctrlVector.y * this.tempSpeed * tFix;
    this.x += this.xv;
    this.y += this.yv;
    this.restrict();

    this.zonesTouched = this.getZonesTouched();

    this.handleZonesTouched();
  }
  getControls(){
    var ctrlVector = {x: 0, y: 0};
    for (var i in this.ctrlSets){
      var testCv = this.ctrlSets[i].getCtrlVector();
      if (testCv !== null){
        ctrlVector = testCv;
      }
    }
    return ctrlVector;
  }

  resetAllModifiers(){
    this.tempSpeed = this.speed;
  }

  getZonesTouched(){
    var zt = [];
    for (var i in this.area.zones){
      if (circleRect({x: this.x, y: this.y, radius: this.getRadius()}, this.area.zones[i])){
        zt.push(this.area.zones[i]);
      }
    }
    return zt;
  }

  handleZonesTouched(){
    var onTpZoneThisFrame = false;
    for (var z in this.zonesTouched){
      const zone = this.zonesTouched[z];
      if (zone.properties.hasOwnProperty("minimum_speed")){
        this.gainEffect(new MinimumSpeedZoneEffect(zone.properties.minimum_speed), false);
      }
      if (zone.type === "exit"){
        if (!this.onTpZoneLastFrame){
          this.doExitTranslate(zone);
        }
        onTpZoneThisFrame = true;
        this.onTpZoneLastFrame = true;
      }
    }
    if (!onTpZoneThisFrame){
      this.onTpZoneLastFrame = false;
    }
  }


  updateAsMain(){
    cameraFocusX = this.x;
    cameraFocusY = this.y;
  }

  doExitTranslate(exitZone){
    //we are going to check if the translated exitZone (basically the rectangle where
    //players might go) is in another area, and then put the player in that area.
    var translatedExitZone = {
      x: exitZone.x + this.area.x + exitZone.translate.x,
      y: exitZone.y + this.area.y + exitZone.translate.y,
      width: exitZone.width,
      height: exitZone.height,
    }
    for (var a in this.region.areas){
      var area = this.region.areas[a];
      console.log(area.bounds);
      var areaZone = {
        x: area.x,
        y: area.y,
        width: area.bounds.right - area.bounds.left,
        height: area.bounds.bottom - area.bounds.top,
      }
      var areaHasBeenFound = rectRect(translatedExitZone, areaZone);
      if (areaHasBeenFound){
        let xTranslateMul = 0;
        if (exitZone.translate.x > 0){
          xTranslateMul = 1;
        }
        if (exitZone.translate.x < 0){
          xTranslateMul = -1;
        }
        let yTranslateMul = 0;
        if (exitZone.translate.y > 0){
          yTranslateMul = 1;
        }
        if (exitZone.translate.y < 0){
          yTranslateMul = -1;
        }
        this.x += exitZone.translate.x - translatedExitZone.width * xTranslateMul;
        this.y += exitZone.translate.y - translatedExitZone.height * yTranslateMul;
        this.x -= this.region.areas[a].x - this.area.x;
        this.y -= this.region.areas[a].y - this.area.y;
        this.areaNum = a;
        this.area = this.region.areas[a];
      }
    }
  }
}