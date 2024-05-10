class Zone{
  constructor(type, x, y, width, height, properties, spawner, translate, parentRegion, parentAreaNum){
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.translate = translate ?? null;
    this.properties = properties ?? {};
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
  }
  initSpawners(){
    if (this.spawner === undefined){
      return;
    }
    const spawner = this.spawner;
    for (var i in spawner){
      this.spawn(spawner[i]);
    }
  }
  spawn(spawner){
    let enemyCount = spawner.count;
    if (enemyCount === undefined){
      enemyCount = 1;
    }
    for (var spawnIndex = 0; spawnIndex < enemyCount; spawnIndex++){
      let enemyType = random(spawner.types);
      let area = this.parentRegion.areas[this.parentAreaNum]
      let x = spawner.x ?? random(this.x + spawner.radius, this.x + this.width - spawner.radius);
      let y = spawner.y ?? random(this.y + spawner.radius, this.y + this.height - spawner.radius);
      if (typeof x === "string"){
        let strs = x.split(", ");
        x = random(parseInt(strs[0]), parseInt(strs[1]));
      }
      if (typeof y === "string"){
        let strs = y.split(", ");
        y = random(parseInt(strs[0]), parseInt(strs[1]));
      }
      let d = spawner.angle ?? random(0, 360);
      let enemy = getEnemyFromSpawner(x, y, d * (Math.PI/180), enemyType, spawner, spawnIndex, this);
      enemy.parentZone = this;
      area.entities.push(enemy);
      console.log(enemy);
    }
  }
}



