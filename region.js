class Region{
  constructor(name, properties, areaArray, convertTeleports = false){
    this.name = name;
    this.properties = properties;
    this.areas = [];
    this.unknownEnemyTypes = [];
    this.buildRegions(areaArray, convertTeleports);
  }
  buildRegions(areaArray, convertTeleports = false){
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
        let type = zn.type;
        if (convertTeleports && type === "teleport"){
          type = "pseudo_teleport"
        }
        var zone = new Zone(type, x, y, w, h, zn.properties, zn.spawner, zn.translate, this, a);
        zones.push(zone);
        lastZone = zone;
      }
      let assets = [];
      for (var s = 0; s < (ar.assets ? ar.assets.length : 0); s++){
        assets.push(ar.assets[s]);
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
      var area = new Area(x, y, zones, assets, ar.properties, this, ar.name);
      this.areas.push(area);
      lastArea = area;
    }
  }
  drawAreaNum(num){
    this.areas[num].draw(this);
  }
}


