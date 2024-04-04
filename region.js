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

        var zone = new Zone(zn.type, x, y, w, h, zn.translate, zn.properties);
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
  }
  draw(parentRegion){
    for (var i in this.zones){
      this.zones[i].draw(this, parentRegion);
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
    this.properties = properties;
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
  }
}