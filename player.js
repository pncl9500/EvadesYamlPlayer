class Player extends Entity{
  constructor(x, y, radius, color, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, color, null, "noOutline")
    this.isMain = isMain;
    this.game = game;
    this.regionNum = regionNum;
    this.region = game.regions[regionNum];
    this.areaNum = areaNum;
    this.area = this.region.areas[areaNum];
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
      //this code looks terrible
      if (zone.type === "exit" || zone.type === "teleport"){
        if (!this.onTpZoneLastFrame){
          if (zone.type === "exit"){
            this.doExitTranslate(zone); 
          }
          if (zone.type === "teleport"){
            this.doTeleportTranslate(this.area.zones.indexOf(zone)); 
          }
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
      console.log(epsilon);
      var translatedExitZone = {
        x: exitZone.x + this.area.x + exitZone.translate.x + epsilon,
        y: exitZone.y + this.area.y + exitZone.translate.y + epsilon,
        width: exitZone.width - epsilon * 2,
        height: exitZone.height - epsilon * 2,
      }
      //for (var a = this.region.areas.length - 1; a >= 0; a--){
      for (var a in this.region.areas){
        if (a === this.areaNum){
          //this doesnt even work
          continue;
        }
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
    if ((epsilon !== tpZoneEpsilon - 8) && !(epsilon <= -1024)){
      console.warn("Exit translation did not immediately find valid area. This is normal when user enters some rr teleports, but behavior may be inaccurate.")
    }
    if (epsilon <= -1024){
      console.warn("Exit translation could not find valid area. Search cut to prevent infinite loop. This is not normal and something has gone very wrong.")
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
  goToRegionFromId(id){
    this.regionNum = id;
    this.region = this.game.regions[id];
  }
  goToAreaFromId(id){
    this.areaNum = id;
    this.area = this.region.areas[id];
  }
  doTeleportTranslate(zoneId){
    //we are actually going to override evades convention here because it is very bad!
    const regionName = this.region.name;
    const areaId = this.areaNum;
    const areaSet = "area_" + areaId;
    const zoneSet = "zone_" + zoneId;
    if (regionTeleports[regionName] === undefined){
      //no region teleport assigned, abort
      console.warn("No region teleport found.");
      return;
    }
    if (!regionTeleports[regionName].hasOwnProperty(areaSet)){
      console.warn("Teleport zone does not have a known area.");
      return;
    }
    if (!regionTeleports[regionName][areaSet].hasOwnProperty(zoneSet)){
      console.warn("Teleport zone is not assigned.");
      return;
    }
    const rtSet = regionTeleports[regionName][areaSet][zoneSet];

    //warp to bbh if it doesnt work
    const dest = rtSet.dest ?? "Burning Bunker Hard";
    const areaDest = rtSet.area ?? 0;
    const x = rtSet.x ?? null;
    const y = rtSet.y ?? null;
    for (var i in this.game.regions){
      if (this.game.regions[i].name === dest){
        //found region
        this.goToRegionFromId(i);
        this.goToAreaFromId(areaDest);
        if (x !== null){
          this.x = x;
          this.x += (this.x < 0) ? this.area.bounds.right : this.area.bounds.left;
        }
        if (y !== null){
          this.y = y;
          this.y += (this.y < 0) ? this.area.bounds.bottom : this.area.bounds.top;
        }
        return;
      }
    }
  }
}
//this is actually helpful somehow
tpZoneEpsilon = 8;