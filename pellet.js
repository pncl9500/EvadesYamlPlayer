pelletRadius = 8;
class Pellet extends Entity{
  constructor(x, y, area, zone, multiplier){
    super(x, y, pelletRadius, {r: 125, g: 125, b: 125}, area, 0, "noOutline")    
    this.multiplier = multiplier;
    this.zone = zone;
    this.colors = ["#b84dd4", "#a32dd8", "#3b96fd", "#43c59b", "#f98f6b", "#61c736", "#d192bd"];
    const selectedColor = this.colors[floor(random(0, this.colors.length))];
    this.color = hexToRgb(selectedColor);
  }
  update(){

  }
}