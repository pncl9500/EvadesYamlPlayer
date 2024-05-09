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
    //players do not go in the entities array... for some reason
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
    //buffers suck don't do them, you can just do this
    if (settings.drawTiles){
      this.drawTiles();
    }

    let toDraw = [];
    for (var i in this.entities){
      let a = this.entities[i].getAura();
      if (a !== undefined){
        toDraw.push(a);
      }
    }
    for (var i in this.players){
      toDraw.push(this.players[i]);
    }
    for (var i in this.entities){
      toDraw.push(this.entities[i]);
    }
    toDraw.sort((a, b) => (a.z > b.z) ? 1 : -1);
    for (var i in toDraw){
      toDraw[i].draw();
    }
  }
  addEnt(ent){
    this.entities.push(ent);
  }
  drawTiles(){
    let r = settings.gridColor[0];
    let g = settings.gridColor[1];
    let b = settings.gridColor[2];
    let a = settings.gridColor[3];
    stroke(r, g, b, a);
    strokeWeight(settings.gridLineWidth);
    for (var x = 1; x < (this.bounds.right - this.bounds.left) / settings.gridSize; x++){
      line(x * settings.gridSize, this.bounds.top, x * settings.gridSize, this.bounds.bottom);
    }
    for (var y = 1; y < (this.bounds.bottom - this.bounds.top) / settings.gridSize; y++){
      line(this.bounds.left, y * settings.gridSize, this.bounds.right, y * settings.gridSize);
    }
  }
  update(){
    //basically everything loop
    for (var i = 0; i < this.entities.length; i++){
      this.entities[i].update(this, this.players);
      if (this.entities[i].toRemove){
        this.entities[i].toRemove = false;
        this.entities.splice(i, 1);
        i--;
        continue;
      }
      if (this.entities[i].restricted){
        this.restrict(this.entities[i]);
      }
      if (this.entities[i].checkForPlayerCollision){
        this.entities[i].checkPlayerCollision(this, this.players);
      }
    }
    for (var i in this.players){
      if (this.players[i].checkForPlayerCollision){
        this.players[i].checkPlayerCollision(this, this.players);
      }
    }
  }
  enter(player){
    this.players.push(player);
    if (!player.visitedAreas.includes(this)){
      player.visitedAreas.push(this);
      player.addXp(this.getXpValue());
    }
  }
  getXpValue(){
    return 12*(this.parent.areas.indexOf(this));
  }
  exit(player){
    this.players.splice(this.players.indexOf(player), 1);
  }
  attemptLoad(throughTp){
    if (this.players.length === 1){
      this.load(throughTp);
    } 
  }
  attemptUnload(){
    if (this.players.length === 0){
      this.unload();
    } 
  }
  load(throughTp){
    this.loaded = true;
    this.addPellets();
    if (this.parent.areas.indexOf(this) === 0 && throughTp){
      this.scanForUnknownEnemyTypes();
    }
  }
  scanForUnknownEnemyTypes(){
    this.parent.unknownEnemyTypes = [];
    for (var a in this.parent.areas){
      for (var z in this.parent.areas[a].zones){
        let zn = this.parent.areas[a].zones[z];
        for (var s in zn.spawner){
          for (var t in zn.spawner[s].types){
            let type = zn.spawner[s].types[t];
            let testEnem = getEnemyFromSpawner(0, 0, 0, type, zn.spawner, 0, zn);
            if (testEnem.constructor.name === "MysteryEnemy" && this.parent.unknownEnemyTypes.indexOf(type) === -1){
              this.parent.unknownEnemyTypes.push(type);
            }
          }
        }
      }
    }
    for (var i in this.parent.unknownEnemyTypes){
      console.warn(`Unknown enemy in ${this.parent.name}: ${this.parent.unknownEnemyTypes[i]}`);
    }
    return this.parent.unknownEnemyTypes;
  }
  addPellets(){
    let vzPelletsSpawned = false;
    for (var i in this.zones){
      if (this.zones[i].type === "active"){
        const pprop = this.parent.properties ?? {};
        const aprop = this.properties ?? {};
        const pelletCount = aprop.pellet_count ?? (pprop.pellet_count ?? defaults.regionProps.pellet_count);
        const pelletMultiplier = aprop.pellet_multiplier ?? (pprop.pellet_multiplier ?? defaults.regionProps.pellet_multiplier);
        const zone = this.zones[i];
        for (var p = 0; p < pelletCount; p++){
          this.entities.push(new Pellet(0, 0, this.zones[i], pelletMultiplier));
        }
        this.zones[i].initSpawners();
      }
      if (this.zones[i].type === "victory" && !vzPelletsSpawned){
        vzPelletsSpawned = true;
        const pprop = this.parent.properties ?? {};
        const aprop = this.properties ?? {};
        let pelletCount = aprop.pellet_count ?? (pprop.pellet_count ?? defaults.regionProps.pellet_count);
        const pelletMultiplier = aprop.pellet_multiplier ?? (pprop.pellet_multiplier ?? defaults.regionProps.pellet_multiplier);
        const zone = this.zones[i];
        if (pelletCount === 25){
          pelletCount *= 10;
        }
        for (var p = 0; p < pelletCount; p++){
          //create an invisible dummy zone that spans the entirety of the area
          let fakeZone = new Zone("dummy", 0, 0, this.bounds.right, this.bounds.bottom, {}, [], {x: 0, y: 0}, this.parent, this.parent.areas.indexOf(this));
          this.entities.push(new Pellet(0, 0, fakeZone, pelletMultiplier, true));
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
      entity.restrictedLastFrame = true;
    }
    if (entity.x + entity.getRadius() > this.bounds.right){
      entity.x = this.bounds.right - entity.getRadius();
      entity.restrictedLastFrame = true;
    }
    if (entity.y - entity.getRadius() < this.bounds.top){
      entity.y = this.bounds.top + entity.getRadius();
      entity.restrictedLastFrame = true;
    }
    if (entity.y + entity.getRadius() > this.bounds.bottom){
      entity.y = this.bounds.bottom - entity.getRadius();
      entity.restrictedLastFrame = true;
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
