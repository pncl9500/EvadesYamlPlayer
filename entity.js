const enemyStrokeWidth = 2;
const ringEnemyStrokeWidth = 4;

imageCullingPadding = 100;
lightingCullingPadding = 200;
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
    this.restrictedLastFrame = false;
    this.effectRemovalQueue = [];
    this.renderOnMinimap = true;

    this.light = 0;

  }
  drawLight(){
    if (this.light === 0 && !settings.allGlowMode) return;
    if (this.x - this.radius > game.mainPlayer.x + gsUnitWidth / 2 + lightingCullingPadding) return;
    if (this.y - this.radius > game.mainPlayer.y + gsUnitHeight / 2 + lightingCullingPadding) return;
    if (this.x + this.radius < game.mainPlayer.x - gsUnitWidth / 2 - lightingCullingPadding) return;
    if (this.y + this.radius < game.mainPlayer.y - gsUnitHeight / 2 - lightingCullingPadding) return;
    lightMap.erase();
    lightMap.noStroke();
    drawLightGradient(this.x, this.y, settings.allGlowMode ? max(this.light, 60) : this.light)
  }
  checkPlayerCollision(area, players){
    for(let i in players){
      if (this.radius === 0){
        continue;
      }
      if (circleCircle(players[i], this)){
        this.playerCollision(players[i]);
      }
    }
  }
  playerCollision(){
    
  }
  getRadius(){
    return this.tempRadius ?? this.radius;
  }
  hasEffect(effectConstructorName){
    for (var i in this.effects){
      if(this.effects[i].constructor.name === effectConstructorName){
        return this.effects[i];
      }
    }
    return false;
  }
  canGainEffect(effect){
    return true;
  }
  gainEffect(effect){
    if (!this.canGainEffect(effect)){
      return;
    }
    for (let j = 0; j < this.effectRemovalQueue.length; j++){
      if (this.effectRemovalQueue[j].constructor.name === effect.constructor.name){
        this.effectRemovalQueue.splice(this.effectRemovalQueue.indexOf(this.effectRemovalQueue[j]), 1);
        j--;
      }
    }
    if (!effect.allowDuplicates){
      for (var i in this.effects){
        if (this.effects[i].constructor.name === effect.constructor.name){
          //duplicate found, get outta there
          //BUT if its refreshable, refresh it!
          if (this.effects[i].refreshable){
            this.effects[i].life = max(this.effects[i].life, effect.duration);
          }
          return;
        }
      }
    }
    effect.gainEffect(this);
    this.effects.push(effect);
    this.effects.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
  }

  applyEffects(){
    //loop through ERQ
    for (let j = 0; j < this.effectRemovalQueue.length; j++){
      this.effectRemovalQueue[j].removeEffectLate(this);
    }
    this.effectRemovalQueue = [];
    for (var i = 0; i < this.effects.length; i++){
      this.effects[i].apply(this);
      if (this.effects[i].toRemove){
        //this.effects[i].toRemove = false; is this good? will this cause weird stuff to happen? i have no idea
        this.effects[i].removeEffect(this);
        this.effectRemovalQueue.push(this.effects[i]);
        this.effects.splice(i, 1);
        i--;
      }
    }
  }
  drawBackExtra(){

  }
  drawFrontExtra(){

  }
  getAura(){

  }
  preDraw(){
    
  }
  drawOnMap(){
    if (this.renderType === "none") return;
    let map = ui.miniMap;
    noStroke();
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, (this.tempColor.a ?? 255) * this.alphaMultiplier);
    ellipse(this.x, this.y, max(this.radius, minEntityMinimapRadius) / map.storedRatio * map.markerScale);
  }
  draw(){
    //cull offscreen image type outlines (REALLY helps with performance, turn it off and try hh2 16)
    if (this.renderType === "imageOutline" || this.renderType === "image"){
      if (this.x - this.radius > game.mainPlayer.x + gsUnitWidth / 2 + imageCullingPadding) return;
      if (this.y - this.radius > game.mainPlayer.y + gsUnitHeight / 2 + imageCullingPadding) return;
      if (this.x + this.radius < game.mainPlayer.x - gsUnitWidth / 2 - imageCullingPadding) return;
      if (this.y + this.radius < game.mainPlayer.y - gsUnitHeight / 2 - imageCullingPadding) return;
    }
    // noStroke();
    // fill(0);
    // textSize(12);
    // text(this.z, this.x, this.y - this.radius);
    noStroke();
    this.drawBackExtra();
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, (this.tempColor.a ?? 255) * this.alphaMultiplier);
    switch (this.renderType) {
      case "none":
        //dont render
        return;
      case "noOutline":
        break;
      case "outline":
        if (settings.drawOutlines){
          stroke(0, (this.tempColor.a ?? 255) * this.alphaMultiplier);
          strokeWeight(enemyStrokeWidth);
        }
        break;
      case "ring":
        noFill();
        strokeWeight(ringEnemyStrokeWidth);
        stroke(this.tempColor.r, this.tempColor.g, this.tempColor.b, this.tempColor.a ?? 255);
        break;
      case "image":
        drawImage(this.image, this.x, this.y, this.radius);
        break;
      case "imageOutline":
        noFill();
        stroke(0, (this.tempColor.a ?? 255) * this.alphaMultiplier);
        strokeWeight(enemyStrokeWidth);
        push();
          tint(255, floor(this.alphaMultiplier * 255));
          drawImage(this.image, this.x, this.y, this.radius);
        pop();
        break;
      default:
        break;
    }
    if (!(this.renderType === "image")){
      if (settings.squareMode){
        rect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2)
      } else {
        ellipse(this.x, this.y, this.radius - (this.renderType === "ring" ? ringEnemyStrokeWidth / 2 : 0));
      }
    }
    this.drawFrontExtra();
  }
  update(){
    
  }
  doRemove(area, players){
    
  }
}