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
    var foundArea = null;
    var foundAreaNum = null;
    var epsilon = tpZoneEpsilon
    while (foundArea === null && epsilon > -1024){
      var translatedExitZone = {
        x: exitZone.x + this.area.x + exitZone.translate.x + epsilon,
        y: exitZone.y + this.area.y + exitZone.translate.y + epsilon,
        width: exitZone.width - epsilon * 2,
        height: exitZone.height - epsilon * 2,
      }
      for (var a = this.region.areas.length - 1; a >= 0; a--){
        var area = this.region.areas[a];
        var areaZone = {
          x: area.x,
          y: area.y,
          width: area.bounds.right - area.bounds.left,
          height: area.bounds.bottom - area.bounds.top,
        }
        var areaHasBeenFound = rectRect(translatedExitZone, areaZone);
        if (areaHasBeenFound){
          foundArea = this.region.areas[a];
          foundAreaNum = a;
        }
      }
      epsilon -= 8;
    }
    if (epsilon !== tpZoneEpsilon - 8){
      console.warn("Exit translation did not immediately find valid area. This is normal when user enters some rr teleports, but behavior may be inaccurate.")
    }
    if (epsilon < -1024){
      console.warm("Exit translation could not find valid area. Search cut to prevent infinite loop. This is not normal and something has gone very wrong.")
    }
    if (foundArea !== null){
      this.x += exitZone.translate.x;
      this.y += exitZone.translate.y;
      this.x -= foundArea.x - this.area.x;
      this.y -= foundArea.y - this.area.y;
      this.areaNum = foundAreaNum;
      this.area = foundArea;
    }
  }
}
//this is actually helpful somehow
tpZoneEpsilon = 8;