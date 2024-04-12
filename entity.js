const enemyStrokeWidth = 2;
const ringEnemyStrokeWidth = 4;

class Entity{
  /**
     * Creates an entity which is a circle that does stuff.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} radius - In game units.
     * @param {Object} color - Object containing r, g, b, and also a values of a color. Hex values work too
     * @param {String} renderType - Rendering style of object, can be outline, noOutline, ring, or image
     */
  constructor(x, y, radius, color, z, renderType = "noOutline"){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.tempRadius = radius;
    this.color = color;
    this.z = z;
    if (typeof this.color === "string"){
      this.color = hexToRgb(this.color);
    }
    this.tempColor = {r: this.color.r, g: this.color.g, b: this.color.b, a: this.color.a};
    this.renderType = renderType;
    this.restricted = false;
    this.checkForPlayerCollision = true;
    this.alphaMultiplier = 1;
    this.mainType = "entity";
    this.toRemove = false;
    this.effects = [];
  }
  checkPlayerCollision(area, players){
    for(let i in players){
      if (circleCircle(players[i], this)){
        this.playerCollision(players[i]);
      }
    }
  }
  playerCollision(){
    
  }
  getRadius(){
    return this.tempRadius;
  }
  gainEffect(effect){
    if (!effect.allowDuplicates){
      for (var i in this.effects){
        if (this.effects[i].constructor.name === effect.constructor.name){
          //duplicate found, get outta there
          return;
        }
      }
    }
    this.effects.push(effect);
  }

  applyEffects(){
    for (var i = 0; i < this.effects.length; i++){
      this.effects[i].apply(this);
      if (this.effects[i].toRemove){
        this.effects.toRemove = false;
        this.effects.splice(i, 1);
        i--;
      }
    }
  }
  drawBackExtra(){

  }
  drawFrontExtra(){

  }
  drawAura(){

  }
  draw(){
    this.drawBackExtra();
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, (this.tempColor.a ?? 255) * this.alphaMultiplier);
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
    this.drawFrontExtra();
    this.tempColor.r = this.color.r;
    this.tempColor.g = this.color.g;
    this.tempColor.b = this.color.b;
    this.tempColor.a = this.color.a;
    this.tempRadius = this.radius;
  }
  update(){
    
  }
}