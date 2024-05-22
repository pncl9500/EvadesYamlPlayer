function drawLightGradient(x0, y0, r0){
  let x = x0 - cameraFocusX;
  let y = y0 - cameraFocusY;
  let r = r0;
  x /= settings.lightMapDownsample;
  y /= settings.lightMapDownsample;
  r /= settings.lightMapDownsample;
  r *= 2;
  x += lightMapWidth / 2;
  y += lightMapHeight / 2;

  lightMap.fill(255, floor(255 / r) * 2);
  for (let i = 0; i < r; i++){
    lightMap.ellipse(x, y, i);
  }
  lightMap.noErase();


  //test
  // lightMap.fill(0);
  // lightMap.ellipse(x, y, 2);
}

class LightRegion{
  constructor(x, y, w, h){
    this.x = x + w / 2;
    this.y = y + h / 2;
    this.w = w;
    this.h = h;
  }
  draw(){};
  drawLight(){
    this.radius = max(this.w, this.h) / 2;
    if (this.x - this.radius > game.mainPlayer.x + gsUnitWidth / 2 + lightingCullingPadding) return;
    if (this.y - this.radius > game.mainPlayer.y + gsUnitHeight / 2 + lightingCullingPadding) return;
    if (this.x + this.radius < game.mainPlayer.x - gsUnitWidth / 2 - lightingCullingPadding) return;
    if (this.y + this.radius < game.mainPlayer.y - gsUnitHeight / 2 - lightingCullingPadding) return;
    lightMap.erase();
    lightMap.noStroke();
    drawLightGradient(this.x, this.y, this.radius);
  }
}

class Torch{
  constructor(x, y, upside_down){
    this.x = x + 13 / 2;
    //why??!?!?! random meaningless magic number offset to get torches right
    this.y = y + 6;
    this.upsideDown = upside_down;
    this.imageId = floor(Math.random() * 6);
    this.imageSet = [
      "ent.torch-1",
      "ent.torch-2",
      "ent.torch-3",
      "ent.torch-4",
      "ent.torch-5",
      "ent.torch-6",
    ];
    //guessed interval. not accurate (maybe it is? evades devs might have picked this number) but lets be honest who actually cares about the timing of each torch sprite
    //the answer is me i'll test and fix it later
    this.spriteInterval = 166.666;
    this.clock = Math.random() * this.spriteInterval;
    this.radius = 18;
  }
  draw(){
    if (settings.hideTorches) return;
    if (this.x - this.radius > game.mainPlayer.x + gsUnitWidth / 2 + imageCullingPadding) return;
    if (this.y - this.radius > game.mainPlayer.y + gsUnitHeight / 2 + imageCullingPadding) return;
    if (this.x + this.radius < game.mainPlayer.x - gsUnitWidth / 2 - imageCullingPadding) return;
    if (this.y + this.radius < game.mainPlayer.y - gsUnitHeight / 2 - imageCullingPadding) return;
    this.clock += dTime;
    if (this.clock > this.spriteInterval){
      this.imageId += 1;
      this.imageId %= this.imageSet.length;
      this.clock %= this.spriteInterval;
    }
    push();
    if (this.upsideDown){
      translate(this.x, this.y);
      rotate(PI);
      translate(-this.x, -this.y);
      translate(0, -22);
    }
    drawImageRect(this.imageSet[this.imageId], this.x, this.y, 13, 36);
    pop();
  }
  drawLight(){
    this.radius = 110;
    if (this.x - this.radius > game.mainPlayer.x + gsUnitWidth / 2 + lightingCullingPadding) return;
    if (this.y - this.radius > game.mainPlayer.y + gsUnitHeight / 2 + lightingCullingPadding) return;
    if (this.x + this.radius < game.mainPlayer.x - gsUnitWidth / 2 - lightingCullingPadding) return;
    if (this.y + this.radius < game.mainPlayer.y - gsUnitHeight / 2 - lightingCullingPadding) return;
    lightMap.erase();
    lightMap.noStroke();
    drawLightGradient(this.x, this.y, this.radius);
  }
}

class Lantern extends ContinuousToggleAbility{
  constructor(){
    super(1, 0, 3, "ab.lantern");
    this.range = 250;
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (!this.toggled) return;
    player.light = this.range;
  }
}