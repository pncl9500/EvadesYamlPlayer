class Enemy extends Entity{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, radius, color, 2000 - radius, "outline");
    
    this.immune = false;

    this.angle = angle;
    this.xv = speed;
    this.yv = 0;
    this.restricted = true;
    this.speedMultiplier = 1;
    this.angleToVel();
    //all enemies have parentZone property
  }
  velToAngle(){
    this.angle = atan2(this.yv, this.xv);
  }
  angleToVel(){
    let mag = sqrt(this.xv * this.xv + this.yv * this.yv);
    this.xv = mag * cos(this.angle);
    this.yv = mag * sin(this.angle);
  }
  update(){
    this.resetState();
    this.x += this.xv * tFix * this.speedMultiplier;
    this.y += this.yv * tFix * this.speedMultiplier;
    this.wallBounce();
    this.updateAura();
  }
  updateAura(){

  }
  wallBounce(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
  }
  resetState(){
    this.speedMultiplier = 1;
  }
}

class Aura extends Entity{
  constructor(x, y, radius, color){
    super(x, y, radius, color, 200 + radius, "noOutline");
  }
}

class AuraEnemy extends Enemy{
  constructor(x, y, angle, speed, radius, color, auraColor, auraSize){
    super(x, y, angle, speed, radius, color)
    this.auraColor = auraColor;
    this.auraSize = auraSize;
    this.aura = new Aura(x, y, auraSize, auraColor);
  }
  drawExtra(){
    this.aura.draw();
  }
  updateAura(){
    this.aura.x = this.x;
    this.aura.y = this.y;
  }
}