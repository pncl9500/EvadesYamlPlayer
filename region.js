class Region{
  constructor(name, properties, areaArray){
    this.name = name;
    this.properties = properties;
    this.areas = [];
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
        if (x === "last_right" || x === "last_x"){
          x = lastZone.x + lastZone.width;
        }
        if (y === "last_bottom" || y === "last_y"){
          y = lastZone.y + lastZone.height;
        }

        var zone = new Zone(zn.type, x, y, w, h, zn.properties, zn.translate);
        zones.push(zone);
        lastZone = zone;
      }
      var x = ar.x;
      var y = ar.y;
      if (x === "var x"){
        x = 0;
      }
      if (y === "var y"){
        y = 0;
      }
      if (x === "last_right" || x === "last_x"){
        x = lastZone.x + lastArea.x;
      }
      if (y === "last_bottom" || y === "last_y"){
        y = lastZone.y + lastArea.y;
      }
      var area = new Area(x, y, zones, ar.properties);
      this.areas.push(area);
      lastArea = area;
    }
  }
  drawAreaNum(num){
    this.areas[num].draw(this);
  }
}

class Area{
  constructor(x, y, zones, properties){
    this.x = x;
    this.y = y;
    this.zones = zones;
    this.properties = properties;
    this.bounds = this.findBounds();
  }
  draw(parentRegion){
    for (var i in this.zones){
      this.zones[i].draw(this, parentRegion);
    }
  }
  update(){

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
    var lb = 99999;
    var rb = -99999;
    var tb = 99999;
    var bb = -99999;
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
  constructor(type, x, y, width, height, properties, translate){
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.translate = translate ?? null;
    this.properties = properties ?? {};
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
    if (this.properties.hasOwnProperty("background_color")){
      fill(this.properties.background_color[0], this.properties.background_color[1], this.properties.background_color[2], this.properties.background_color[3]);
      rect(this.x, this.y, this.width, this.height);
    }
  }
}