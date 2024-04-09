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
    //speed is set to 0 since the wall is being moved manually
    super(0, 0, 0, speed, radius, pal.nm.wall);
    this.immune = true;
    this.clockwise = clockwise;
    this.normalMovementDisabled = true;

    this.vertWallLength = zone.height - radius * 2;
    this.horizWallLength = zone.width - radius * 2;
    this.perimeter = this.vertWallLength * 2 + this.horizWallLength * 2;

    this.leftBound = zone.x + radius;
    this.rightBound = zone.x - radius + zone.width;
    this.topBound = zone.y + radius;
    this.bottomBound = zone.y - radius + zone.height;

    this.zoneCenterX = zone.x + zone.width / 2;

    this.trackPos = 0 + ind * (this.perimeter / count);
    this.getPosFromTrackPosition();
  }
  behavior(area, players){
    this.trackPos += this.speed * tFix * (this.clockwise ? 1 : -1);
    if (this.trackPos < 0){
      this.trackPos += this.perimeter;
    }
    this.trackPos %= this.perimeter;
    this.getPosFromTrackPosition();
  }
  wallBounce(){
    //disable default behavior (everything is controlled in GPFTP)
  }
  getPosFromTrackPosition(){
     //top 2
     if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength + this.horizWallLength + this.vertWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength - this.horizWallLength - this.vertWallLength;
      this.x = this.leftBound + relPos;
      this.y = this.topBound;
      return;
    }
    //left
    if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength + this.horizWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength - this.horizWallLength;
      this.x = this.leftBound;
      this.y = this.bottomBound - relPos;
      return;
    }
    //bottom
    if (this.trackPos > this.horizWallLength / 2 + this.vertWallLength){
      let relPos = this.trackPos - this.horizWallLength / 2 - this.vertWallLength;
      this.x = this.rightBound - relPos;
      this.y = this.bottomBound;
      return;
    }
    //right
    if (this.trackPos > this.horizWallLength / 2){
      let relPos = this.trackPos - this.horizWallLength / 2;
      this.x = this.rightBound;
      this.y = this.topBound + relPos;
      return;
    }
    //top 1
    this.x = this.zoneCenterX + this.trackPos;
    this.y = this.topBound;
    return;
  }
}