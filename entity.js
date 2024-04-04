const enemyStrokeWidth = 2;
const ringEnemyStrokeWidth = 4;
class Entity{
  constructor(x, y, radius, color, renderType = "noOutline"){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.tempRadius = radius;
    this.color = color;
    this.tempColor = color;
    this.renderType = renderType;
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
    if (!this.renderType === "image"){
      ellipse(this.x, this.y, this.radius - this.renderType === "ring" ? ringEnemyStrokeWidth : 0);
    }
    this.tempColor = this.color;
    this.tempRadius = this.radius;
  }
}