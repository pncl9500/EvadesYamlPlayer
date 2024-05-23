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
}

function drawLightArc(x0, y0, r0, ang, arcWidth){
  let x = x0 - cameraFocusX;
  let y = y0 - cameraFocusY;
  let r = r0;
  x /= settings.lightMapDownsample;
  y /= settings.lightMapDownsample;
  r /= settings.lightMapDownsample;
  r *= 2;
  x += lightMapWidth / 2;
  y += lightMapHeight / 2;

  lightMap.erase();
  lightMap.fill(255, floor(255 / r) * 2);
  for (let i = 0; i < r; i++){
    lightMap.arc(x, y, i, i, ang - arcWidth / 2, ang + arcWidth / 2);
  }
  lightMap.noErase();
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

class FlashlightSpawner extends Entity{
  constructor(x, y){
    super(x, y, 16, "#000000", z.flashlightSpawner, "imageUnscaled");
    this.image = "ent.flashlight_item";
    this.downTime = 1000;
    this.clock = 0;
  }
  drawOnMap(){
    
  }
  update(){
    this.clock += dTime;
    for (let i = 0; i < game.players.length; i++){
      if (this.clock > this.downTime && circleCircle(game.players[i], this) && game.players[i].ability3.constructor.name === "Ability"){
        this.clock = 0;
        game.players[i].ability3 = new Flashlight();
        game.players[i].ability3.upgrade(game.players[i], true);
      }
    }
  }
  draw(){
    this.renderType = (this.clock < this.downTime) ? "none" : "imageUnscaled";
    super.draw();
  }
}

class Flashlight extends ToggleAbility{
  constructor(){
    super(1, 0, 1, "ab.lantern");
    this.aura = new FlashlightAura({x: 0, y: 0, lastDir: 0});
  }
  update(){
    this.aura.update();
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    player.addAura(this.aura);
  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.toRemove = true;
  }
  remove(){
    this.aura.toRemove = true;
  }
}

class FlashlightAura extends LockedAura{
  constructor(parent){
    super(parent, 0, "#00000000", 0);
    this.dir = parent.lastDir;
    this.rotationSpeed = PI/12;
  }
  drawLight(){
    drawLightArc(this.parent.x, this.parent.y, 480, this.dir, 35 * PI/180);
  }
  update(){
    let targetDir = (this.parent.lastDir + 2 * PI) % (2 * PI);
    this.dir = (this.dir + 2 * PI) % (2 * PI);
    let turnDirection = -1;
    let a = this.dir;
    let b = targetDir;
    if (a < b && b - a <= PI){
      turnDirection = 1;
    }
    if (a > b && a - b > PI){
      turnDirection = 1;
    }
    this.dir += this.rotationSpeed * turnDirection * tFix;
    if (Math.abs(a - b) < this.rotationSpeed){
      this.dir = targetDir;
    }
    debugValue = targetDir;
  }
}


