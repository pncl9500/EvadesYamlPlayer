pelletRadius = 8;
class Pellet extends Entity{
  constructor(x, y, zone, multiplier, spawnedInVictory = false){
    super(x, y, pelletRadius, {r: 125, g: 125, b: 125}, z.pellet, "noOutline")    
    this.multiplier = multiplier;
    this.zone = zone;
    this.mainType = "pellet";
    this.colors = ["#b84dd4", "#a32dd8", "#3b96fd", "#43c59b", "#f98f6b", "#61c736", "#d192bd"];
    const selectedColor = this.colors[floor(random(0, this.colors.length))];
    this.color = hexToRgb(selectedColor);
    let area = zone.parentRegion.areas[zone.parentAreaNum];
    this.area = area;
    this.spawnedInVictory = spawnedInVictory;
    this.relocate();

    let region = zone.parentRegion;
    let pelletMultiplier = 1;
    try {
      pelletMultiplier = region.properties.pellet_multiplier ?? 1;
    } catch (error) {
      pelletMultiplier = pelletMultiplier;
    }
    try {
      pelletMultiplier = area.properties.pellet_multiplier ?? 1;
    } catch (error) {
      pelletMultiplier = pelletMultiplier;
    }
    this.xpValue = floor(2+(zone.parentAreaNum + 1))/3*pelletMultiplier;
  }
  update(){

  }
  playerCollision(player){
    this.collect(player);
    this.relocate();
  }
  collect(player){
    player.addXp(this.xpValue);
    player.rechargePelletBasedAbilities(this.multiplier);
  }
  relocate(){
    let viableZoneFound = false
    while (!viableZoneFound) {
      this.x = random(this.zone.x + this.radius, this.zone.x + this.zone.width - this.radius);
      this.y = random(this.zone.y + this.radius, this.zone.y + this.zone.height - this.radius); 
      if (!this.spawnedInVictory){
        return;
      }
      viableZoneFound = true;
      for (let i in this.area.zones){
        if (this.area.zones[i].type === "victory"){
          continue;
        }
        if (circleRect({x: this.x, y: this.y, radius: this.radius}, this.area.zones[i])){
          viableZoneFound = false;
        }
      }
    }
  }
  //debug pellet value drawing
  // drawFrontExtra(){
  //   fill(0);
  //   textSize(12);
  //   text(this.xpValue, this.x, this.y - 10);
  // }
}