class Enemy extends Entity{
  constructor(x, y, angle, speed, radius, color){
    super(x, y, radius, color, 1000 + radius, "outline");
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
    this.checkForWallbounces();
  }
  checkForWallbounces(){
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
  }
  resetState(){
    this.speedMultiplier = 1;
  }
}