class MysteryEnemy extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraColor, auraRadius, placeholderType){
    super(x, y, angle, speed, radius, pal.nm.hasOwnProperty(placeholderType) ? pal.nm[placeholderType] : pal.nm.mystery, auraColor, auraRadius);
  }
}

class Normal extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.normal);
  }
}

class Wall extends Enemy{
  constructor(speed, radius, ind, count, clockwise, zone){
    super(0, 0, 0, speed, radius, pal.nm.wall);

    this.immune = true;

    //parentzone isnt assigned yet
    let sideAngles = {
      top: 0,
      bottom: 180,
      left: 270,
      right: 90,
    }
    this.side = null;
    let perimeter = zone.width * 2 + zone.height * 2;
    let trackPosition = (perimeter / count) * ind;
    this.ind = ind;
    this.getPosFromTrackPosition(trackPosition, zone)
    this.angle = sideAngles[this.side];
    this.spawnerCount = count;
    if (!clockwise){
      this.angle += 180;
    }
    //go to radians
    this.angle *= PI/180;
    this.clockwise = clockwise;
    this.angleToVel();
  }
  wallBounce(){
    this.bounced = false;
    this.x - this.radius < this.parentZone.x && (this.x = this.parentZone.x + this.radius, this.bounced = true);
    this.x + this.radius > this.parentZone.x + this.parentZone.width && (this.x = this.parentZone.x + this.parentZone.width - this.radius, this.bounced = true);
    this.y - this.radius < this.parentZone.y && (this.y = this.parentZone.y + this.radius, this.bounced = true);
    this.y + this.radius > this.parentZone.y + this.parentZone.height && (this.y = this.parentZone.y + this.parentZone.height - this.radius, this.bounced = true);
    if (!this.bounced) {return};
    this.velToAngle();
    this.angle += this.clockwise ? PI/2 : -PI/2;
    this.angleToVel();
  }
  getPosFromTrackPosition(trackPosition, zone){
    let top = zone.y;
    let bottom = zone.y + zone.height;
    let left = zone.x;
    let right = zone.x + zone.width;
    this.x = zone.width * 0.5 + zone.x;
    this.y = top;
    //top 2
    if (trackPosition > zone.width / 2 + zone.height + zone.width + zone.height){
      let relPosition = trackPosition - zone.width / 2 - zone.height - zone.width - zone.height;
      this.side = "top";
      this.x = left + relPosition;
      this.y = top;
      this.y += this.radius;
      return;
    }
    //left
    if (trackPosition > zone.width / 2 + zone.height + zone.width){
      let relPosition = trackPosition - zone.width / 2 - zone.height - zone.width;
      this.side = "left";
      this.x = left;
      this.y = bottom - relPosition;
      this.x += this.radius;
      return;
    }
    //bottom
    if (trackPosition > zone.width / 2 + zone.height){
      let relPosition = trackPosition - zone.width / 2 - zone.height;
      this.side = "bottom";
      this.x = right - relPosition;
      this.y = bottom;
      this.y -= this.radius;
      return;
    }
    //right
    if (trackPosition > zone.width / 2){
      let relPosition = trackPosition - zone.width / 2;
      this.side = "right";
      this.x = right;
      this.y = top + relPosition;
      this.x -= this.radius;
      return;
    }
    //top 1
    let relPosition = trackPosition;
    this.side = "top";
    this.x += relPosition;
    this.y = top;
    this.y += this.radius;
    return;
  }
}