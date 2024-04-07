class Region{
  constructor(name, properties, areaArray){
    this.name = name;
    this.properties = properties;
    this.areas = [];
    this.buildRegions(areaArray);
  }
  buildRegions(areaArray){
    //clean this code up later, its really bad
    var lastArea = null;
    for (var a = 0; a < areaArray.length; a++){
      var lastZone = null;
      var ar = areaArray[a];
      var zones = [];
      //is this even remotely close to how it's supposed to work in game?
      //i have no idea.
      for (var z = 0; z < ar.zones.length; z++){
        var zn = ar.zones[z];
        var x = zn.x; var y = zn.y; var w = zn.width; var h = zn.height;
        if (w === "last_width"){
          w = lastZone.width;
        }
        if (h === "last_height"){
          h = lastZone.height;
        }
        if (x === "last_right"){
          x = lastZone.x + lastZone.width;
        }
        if (x === "last_x"){
          x = lastZone.x;
        }
        if (y === "last_bottom"){
          y = lastZone.y + lastZone.height;
        }
        if (y === "last_y"){
          y = lastZone.y;
        }

        var zone = new Zone(zn.type, x, y, w, h, zn.properties, zn.spawner, zn.translate, this, a);
        zones.push(zone);
        lastZone = zone;
      }
      var x = ar.x;
      var y = ar.y;
      if (x === "var x"){
        x = regionOffsets[this.name].x;
      }
      if (y === "var y"){
        y = regionOffsets[this.name].y;
      }
      //WHY?!?!?!?!
      if (typeof x === "string"){
        if (x.startsWith("var x")){
          let str = x.split(" ");
          //in the case someone doesn't use spaces:
          if (str.length === 2){
            str[0] = x.substring(0, 3);
            str[1] = x.substring(3, 5);
            str[2] = x.substring(5, 6);
            str[3] = x.substring(6);
          }
          let mul = str[2] === "-" ? -1 : 1;
          let add = parseInt(str[3]) * mul;
          x = regionOffsets[this.name].x + add;
        }
      }
      if (typeof y === "string"){
        if (y.startsWith("var y")){
          let str = y.split(" ");
          //in the case someone doesn't use spaces:
          if (str.length === 2){
            str[0] = y.substring(0, 3);
            str[1] = y.substring(3, 5);
            str[2] = y.substring(5, 6);
            str[3] = y.substring(6);
          }
          let mul = str[2] === "-" ? -1 : 1;
          let add = parseInt(str[3]) * mul;
          y = regionOffsets[this.name].y + add;
        }
      }
      if (x === "last_right"){
        //x = lastZone.x + lastZone.width + lastArea.x;
        x = lastArea.bounds.right + lastArea.x;
      }
      if (y === "last_bottom"){
        //x = lastZone.x + lastZone.width + lastArea.x;
        y = lastArea.bounds.bottom + lastArea.y;
      }
      if (x === "last_x"){
        x = lastArea.x;
      }
      if (y === "last_y"){
        y = lastArea.y;
      }
      //why is this even a thing
      if (typeof x === "string"){
        if (x.startsWith("last_x")){
          let str = x.split(" ");
          if (str.length === 1){
            str[0] = x.substring(0, 6);
            str[1] = x.substring(6, 7);
            str[2] = x.substring(7);
          }
          let mul = str[1] === "-" ? -1 : 1;
          let add = parseInt(str[2]) * mul;
          x = lastArea.x + add;
        }
      }
      if (typeof y === "string"){
        if (y.startsWith("last_y")){
          let str = y.split(" ");
          if (str.length === 1){
            str[0] = y.substring(0, 6);
            str[1] = y.substring(6, 7);
            str[2] = y.substring(7);
          }
          let mul = str[1] === "-" ? -1 : 1;
          let add = parseInt(str[2]) * mul;
          y = lastArea.y + add;
        }
      }
      //NOT AGAIN
      if (typeof x === "string"){
        if (x.startsWith("last_right")){
          let str = x.split(" ");
          if (str.length === 1){
            str[0] = x.substring(0, 10);
            str[1] = x.substring(10, 11);
            str[2] = x.substring(11);
          }
          let mul = str[1] === "-" ? -1 : 1;
          let add = parseInt(str[2]) * mul;
          x = lastArea.bounds.right + lastArea.x + add;
        }
      }
      if (typeof y === "string"){
        if (y.startsWith("last_bottom")){
          let str = y.split(" ");
          if (str.length === 1){
            str[0] = y.substring(0, 11);
            str[1] = y.substring(11, 12);
            str[2] = y.substring(12);
          }
          let mul = str[1] === "-" ? -1 : 1;
          let add = parseInt(str[2]) * mul;
          y = lastArea.bounds.bottom + lastArea.y + add;
        }
      }
      var area = new Area(x, y, zones, ar.properties, this);
      this.areas.push(area);
      lastArea = area;
    }
  }
  drawAreaNum(num){
    this.areas[num].draw(this);
  }
}

class Area{
  constructor(x, y, zones, properties, parent){
    this.loaded = false;
    this.x = x;
    this.y = y;
    this.zones = zones;
    this.properties = properties;
    this.parent = parent;
    this.bounds = this.findBounds();
    this.players = [];
    //players do not go in the entities array
    this.entities = [];
  }
  draw(parentRegion){
    if (settings.regionBackground){
      if (this.parent.hasOwnProperty("properties") && this.parent.properties.hasOwnProperty("background_color")){
        background(this.parent.properties.background_color[0], this.parent.properties.background_color[1], this.parent.properties.background_color[2], floor(this.parent.properties.background_color[3] * 0.3));
      }
      if (this.hasOwnProperty("properties") && this.properties !== undefined && this.properties.hasOwnProperty("background_color")){
        background(this.properties.background_color[0], this.properties.background_color[1], this.properties.background_color[2], floor(this.properties.background_color[3] * 0.3));
      }
    }
    for (var i in this.zones){
      this.zones[i].draw(this, parentRegion);
    }
    //sort entities
    this.entities.sort((a, b) => (a.z > b.z) ? 1 : -1);
    for (var i in this.entities){
      this.entities[i].draw();
    }
  }
  update(){
    for (var i in this.entities){
      this.entities[i].update();
      if (this.entities[i].restricted){
        this.restrict(this.entities[i]);
      }
    }
  }
  enter(player){
    this.players.push(player);
  }
  exit(player){
    this.players.splice(this.players.indexOf(player), 1);
  }
  attemptLoad(){
    if (this.players.length === 1){
      this.load();
    } 
  }
  attemptUnload(){
    if (this.players.length === 0){
      this.unload();
    } 
  }
  load(){
    this.loaded = true;
    this.addPellets();
  }
  addPellets(){
    for (var i in this.zones){
      if (this.zones[i].type === "active"){
        const pprop = this.parent.properties ?? {};
        const aprop = this.properties ?? {};
        const pelletCount = aprop.pellet_count ?? (pprop.pellet_count ?? defaults.regionProps.pellet_count);
        const pelletMultiplier = aprop.pellet_multiplier ?? (pprop.pellet_multiplier ?? defaults.regionProps.pellet_multiplier);
        const zone = this.zones[i];
        for (var p = 0; p < pelletCount; p++){
          let px = random(zone.x + pelletRadius, zone.x + zone.width - pelletRadius);
          let py = random(zone.y + pelletRadius, zone.y + zone.height - pelletRadius);
          this.entities.push(new Pellet(px, py, this.zones[i], pelletMultiplier));
        }
        this.zones[i].initSpawners();
      }
    }
  }
  unload(){
    this.loaded = false;
    this.entities = [];
  }
  restrict(entity){
    if (entity.x - entity.getRadius() < this.bounds.left){
      entity.x = this.bounds.left + entity.getRadius();
    }
    if (entity.x + entity.getRadius() > this.bounds.right){
      entity.x = this.bounds.right - entity.getRadius();
    }
    if (entity.y - entity.getRadius() < this.bounds.top){
      entity.y = this.bounds.top + entity.getRadius();
    }
    if (entity.y + entity.getRadius() > this.bounds.bottom){
      entity.y = this.bounds.bottom - entity.getRadius();
    }
  }
  findBounds(){
    var lb = 9999999;
    var rb = -9999999;
    var tb = 9999999;
    var bb = -9999999;
    for (var z in this.zones){
      let zlb = this.zones[z].x;
      let zrb = this.zones[z].x + this.zones[z].width;
      let ztb = this.zones[z].y;
      let zbb = this.zones[z].y + this.zones[z].height;
      lb = min(lb, zlb);
      rb = max(rb, zrb);
      tb = min(tb, ztb);
      bb = max(bb, zbb);
    }
    return {
      left: lb,
      right: rb,
      top: tb,
      bottom: bb,
    }
  }
}

class Zone{
  constructor(type, x, y, width, height, properties, spawner, translate, parentRegion, parentAreaNum){
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.translate = translate ?? null;
    this.properties = properties ?? {};
    this.lineAlpha = this.type === "active" ? 15 : 15;
    this.parentRegion = parentRegion;
    this.parentAreaNum = parentAreaNum;
    this.spawner = spawner;
  }
  getZoneBaseColor(){
    switch (this.type) {
      case "active":
        fill(255);
        break;
      case "safe":
        fill(195);
        break;
      case "exit":
      case "victory":
        fill(253, 244, 129);
        break;
      case "removal":
        fill(254, 250, 193);
        break;
      case "teleport":
        fill(132, 206, 220);
        break;
      case "dummy":
        fill(213);
        break;
      default:
        break;
    }
  }
  draw(parentArea, parentRegion){
    this.getZoneBaseColor();
    rect(this.x, this.y, this.width, this.height);
    if (parentRegion.properties !== undefined && parentRegion.properties.hasOwnProperty("background_color")){
      fill(parentRegion.properties.background_color[0], parentRegion.properties.background_color[1], parentRegion.properties.background_color[2], parentRegion.properties.background_color[3]);
      rect(this.x, this.y, this.width, this.height);
    }
    if (parentArea.properties !== undefined && parentArea.properties.hasOwnProperty("background_color")){
      fill(parentArea.properties.background_color[0], parentArea.properties.background_color[1], parentArea.properties.background_color[2], parentArea.properties.background_color[3]);
      rect(this.x, this.y, this.width, this.height);
    }
    if (this.properties.hasOwnProperty("background_color")){
      fill(this.properties.background_color[0], this.properties.background_color[1], this.properties.background_color[2], this.properties.background_color[3]);
      rect(this.x, this.y, this.width, this.height);
    }
    
    if (settings.drawTiles){
      stroke(0, 0, 0, this.lineAlpha);
      strokeWeight(3);
      for (var x = 0; x < this.width / 32; x++){
        line(x * 32 + this.x, this.y, x * 32 + this.x, this.y + this.height);
      }
      for (var y = 0; y < this.height / 32; y++){
        line(this.x, y * 32 + this.y, this.x + this.width, y * 32 + this.y);
      }
    }
  }
  initSpawners(){
    console.log("INITIATE-NUCLEAR-REACTOR")
    if (this.spawner === undefined){
      return;
    }
    const spawner = this.spawner;
    for (var i in spawner){
      this.spawn(spawner[i]);
    }
  }
  spawn(spawner){
    for (var spawnIndex = 0; spawnIndex < spawner.count; spawnIndex++){
      let enemyType = random(spawner.types);
      let area = this.parentRegion.areas[this.parentAreaNum]
      let x = spawner.x ?? random(this.x + spawner.radius, this.x + this.width - spawner.radius);
      let y = spawner.y ?? random(this.y + spawner.radius, this.y + this.height - spawner.radius);
      if (typeof x === "string"){
        let strs = x.split(", ");
        x = random(parseInt(strs[0]), parseInt(strs[1]));
        console.log(strs);
        console.log(x);
      }
      if (typeof y === "string"){
        let strs = y.split(", ");
        y = random(parseInt(strs[0]), parseInt(strs[1]));
        console.log(strs);
        console.log(y);
      }
      let d = spawner.angle ?? random(0, 360);
      let enemy = getEnemyFromSpawner(x, y, d * (Math.PI/180), enemyType, spawner, spawnIndex);
      enemy.parentZone = this;
      area.entities.push(enemy);
    }
  }
}



function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex){
  let r = spawner.radius;
  let s = spawner.speed;
  switch (enemyType) {
    case "normal": return new Normal(x, y, d, s, r, "#ffffff");
    default: return new MysteryEnemy(x, y, d, s, r, enemyType);
  }
}