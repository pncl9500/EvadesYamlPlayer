class IceWall{
  constructor(x, y, w, h, texture){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.width = w;
    this.height = h;
    if (!texture){
      this.draw = () => {};
    }

    this.draw = () => {};
  }
  draw(){
    //console.log(this);
    stroke(0);
    strokeWeight(enemyStrokeWidth);
    fill(240, 240, 255);
    rect(this.x, this.y, this.w, this.h);
  }
}