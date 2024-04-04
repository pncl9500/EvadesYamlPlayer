const enemyStrokeWidth = 2;
const ringEnemyStrokeWidth = 4;

class Entity{
  /**
     * Creates an entity which is a circle that does stuff.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} radius - In game units.
     * @param {Object} color - Object containing r, g, b, and also a values of a color.
     * @param {String} renderType - Rendering style of object, can be outline, noOutline, ring, or image
     */
  constructor(x, y, radius, color, area, renderType = "noOutline"){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.tempRadius = radius;
    this.color = color;
    this.tempColor = color;
    this.renderType = renderType;
    this.restricted = false;
    this.area = area;
  }
  getRadius(){
    return this.tempRadius;
  }
  backboneUpdate(){
    if (this.restricted){
      this.area.restrict(this);
    }
  }
  draw(){
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, this.tempColor.a ?? 255);
    switch (this.renderType) {
      case "noOutline":
        noStroke();
        break;
      case "outline":
        stroke(0);
        strokeWeight(enemyStrokeWidth);
        break;
      case "ring":
        noFill();
        strokeWeight(ringEnemyStrokeWidth);
        stroke(this.tempColor.r, this.tempColor.g, this.tempColor.b, this.tempColor.a ?? 255);
        break;
      case "image":
        //do this later (this is for sweet tooth and experiorb)
      default:
        break;
    }
    if (!(this.renderType === "image")){
      ellipse(this.x, this.y, this.radius - (this.renderType === "ring" ? ringEnemyStrokeWidth : 0));
    }
    this.tempColor = this.color;
    this.tempRadius = this.radius;
  }
}