class Euclid extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.euclid, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Euclid";
    this.ability1 = new BlackHole();
    this.ability2 = new Orbit();
  }
}


class OrbitInvincibilityEffect extends Effect{
  constructor(duration){
    super(duration, getEffectPriority("OrbitInvincibilityEffect"), false, true);
  }
  doEffect(target){
    target.invincible = true;
    let t = this.life / this.duration;
    target.tempColor = lerpCol(target.tempColor, t, 0, 0, 0);
  }
}

function lerpCol(tempColor, t, r, g, b){
  return {r: floor(map(t, 0, 1, tempColor.r, r)), g: floor(map(t, 0, 1, tempColor.g, g)), b:  floor(map(t, 0, 1, tempColor.b, b))};;
}

class Orbit extends Ability{
  constructor(){
    super(5, 4000, 15, "ab.orbit");
    this.radii = [35, 70, 105, 140, 175];
    this.duration = 2000;
    this.invincibilityDuration = 1000;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    player.gainEffect(new OrbitInvincibilityEffect(this.invincibilityDuration));
    area.addEnt(new OrbitCore(player.x, player.y, this.duration));
    area.addEnt(new OrbitAura(player.x, player.y, this.duration, this.radii[this.tier - 1], player));
  }
}

class OrbitCore extends Entity{
  constructor(x, y, duration){
    super(x, y, 10, {r: 168, g: 138, b: 182}, z.orbitCore, "outline")
    this.clock = 0;
    this.duration = duration;
    this.renderOnMinimap = false;
  }
  update(){
    this.clock += dTime;
    if (this.clock > this.duration) this.toRemove = true;
  }
}

class OrbitAura extends Projectile{
  constructor(x, y, duration, radius, player){
    //super(x, y, radius, {r: 168, g: 138, b: 182, a: 80}, z.orbitAura, "noOutline")
    super(x, y, 0, 0, duration, -1, radius, {r: 168, g: 138, b: 182, a: 80}, player.area, player, z.orbitAura, [], "noOutline", 0, false) 
    this.ignorePreviousTargets = false;
    this.renderOnMinimap = false;
  }
  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    enemy.gainEffect(new OrbitEffect(0, this.x, this.y));
  }
}

class OrbitEffect extends Effect{
  constructor(duration = 0, sourceX, sourceY){
    super(duration, getEffectPriority("OrbitEffect"), true);
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    this.revolutionSpeed = 3;
    this.speedMultiplier = 0.1;
  }
  doEffect(target){
    target.speedMultiplier *= this.speedMultiplier;
    let revolutionDirection = PI/2 + atan2(target.y - this.sourceY, target.x - this.sourceX);
    target.x += cos(revolutionDirection) * this.revolutionSpeed * tFix;
    target.y += sin(revolutionDirection) * this.revolutionSpeed * tFix;
    //buggy behavior if fixed wallbounces are on, so snap the enemy tangent to the wall without correcting behavior
    target.wallSnap();
  }
  removeEffectLate(target){
    target.gainEffect(new SpeedRecoveryEffect(this.speedMultiplier, 1000));
  }
}

class SpeedRecoveryEffect extends Effect{
  constructor(speedMul, duration = 1000){
    super(duration, getEffectPriority("SpeedRecoveryEffect"), true);
    this.speedMul = speedMul;
    this.speedChange = (1 - speedMul) / duration;
  }
  doEffect(target){
    this.speedMul += this.speedChange * dTime;
    target.speedMultiplier *= this.speedMul; 
  }
}

//black hole notes
//black hole projectile radius (before expanding) = ~24px
//black hole full uninterrupted range = ~576px
//black hole was shot at 4 secs 5 frames
//black hole started expanding at 4 secs 53 frames
//black hole therefore takes 0.8 secs to travel which is a very nice number so its probably correct
//576 px / 0.8s / 30fps = 24px/frame exactly, nice!
//black hole max expanded radius = 192? 200? 192 was measured but usually aura ranges are always divisible by 5 and 195 doesn't feel like a number that would be used.
//black hole expansion is linear (i think?)
//black hole started expanding in the clip at 4 secs 53 frames
//black hole finished expanding in the clip at 5 secs 33 frames
//black hole therefore takes ~40 frames to expand fully at 60fps, expansion time is therefore ~667ms... number seems off, usually durations are very round.
//black hole began shrinking at 8 secs 5 frames
//black hole stays fully expanded for 152 frames, round it to 150 i guess. Thats 2.5 seconds which is where the duration in the description is.
//black hole finished shrinking at 9 secs 3 frames
//black hole basically shrinks in 1 second
//black hole shrinking is not linear, it starts at 32px per frame?
//ends up shrinking like 1px per frame... seems impossible to make truly accurate by eye alone

//a travelling black hole will immediately start expanding if you press the button again

//a travelling black hole will immediately start expanding if it hits a wall. it will snap its center exactly
//onto the wall.

//enemies are sucked in in the expanding and staying states.
//enemy began being sucked in at 4s 13f
//enemy reached center of black hole at 4s 29f
//enemy went from edge of black hole to center in 16f
//192px in 16f, 12px/f, double that to 24 because video was in 60 but game is in 30
//enemies are sucked in at a speed of 24
//24 speed seems incredibly wrong even by eyeballing, i must have done something incorrectly.
//it doesn't pertain to gameplay too much so i guess its fine. i'll make it 12 since it
//looks correct enough and it's off by exactly a factor of two which has to mean something right

//sucked in enemies immediately stop being harmless upon the black hole dying.

class BlackHole extends Ability{
  constructor(){
    super(5, [14000, 13000, 12000, 11000, 10000], 30, "ab.black_hole");
    this.projectile = null;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    this.projectile = new BlackHoleProjectile(player.x, player.y, player.lastDir, area, player);
    area.addEnt(this.projectile);
  }
  useDuringCooldown(player, players, pellets, enemies, miscEnts, region, area){
    if (!this.projectile) return;
    if (this.projectile.state === "travelling"){
      this.projectile.speed = 0;
      this.projectile.switchState("expanding");
    }
  }
}

class BlackHoleProjectile extends Projectile{
  constructor(x, y, angle, area, player){
    super(x, y, angle, 24, -1, -1, 24, {r: 0, g: 0, b: 0, a: 140}, area, player, z.blackHole, [], "noOutline", 24, false);
    this.state = "travelling";
    this.clock = 0;

    //we offset the projectile forward by 24px so we need to account for that
    this.travelTime = 800 - 33;
    this.startingRadius = 24;
    this.expandedRadius = 192;
    this.expansionTime = 667;
    this.stayTime = 2500;
    this.ignorePreviousTargets = false;
  }
  drawOnMap(){
    let map = ui.miniMap;
    noStroke();
    fill(this.tempColor.r, this.tempColor.g, this.tempColor.b, (this.tempColor.a ?? 255) * this.alphaMultiplier);
    ellipse(this.x, this.y, this.radius / map.storedRatio * map.markerScale);
  }
  switchState(state){
    this.state = state;
    this.clock = 0;
  }
  behavior(area, players){
    this.clock += dTime;
    //black hole troll :)
    if (this.player.area !== this.area){
      this.toRemove = true;
    }
    switch (this.state) {
      case "travelling": this.travel(area, players); break;
      case "expanding": this.expand(area, players); break;
      case "staying": this.stay(area, players); break;
      case "shrinking": this.shrink(area, players); break;
      default:
        break;
    }
  }
  travel(area,players){
    if (this.clock > this.travelTime){
      this.speed = 0;
      this.switchState("expanding");
    }
    this.radius = 0;
    this.wallSnap();
    this.radius = this.startingRadius;
  }
  wallSnapEvent(){
    this.speed = 0;
    this.switchState("expanding");
  }
  expand(area, players){
    this.radius = map(this.clock, 0, this.expansionTime, this.startingRadius, this.expandedRadius, true);
    if (this.radius === this.expandedRadius){
      this.switchState("staying");
    }
  }
  stay(area,players){
    if (this.clock > this.stayTime){
      this.switchState("shrinking");
    }
  }
  shrink(area, players){
    this.radius /= pow(1.25, tFix);
    if (this.clock > 1000){
      this.toRemove = true;
    }
  }

  detectContact(){
    this.detectEnemyContact();
  }
  contactEffect(enemy){
    if (this.state === "travelling") return;
    enemy.gainEffect(new BlackHoleEffect(this.x, this.y));
  }
}

class BlackHoleEffect extends Effect{
  constructor(x, y){
    super(0, getEffectPriority("BlackHoleEffect"), true, true);
    this.travelSpeed = 12;
    this.x = x;
    this.y = y;
  }
  doEffect(target){
    target.conditionallyHarmless = true;
    target.conditionalHarmlessnessHeroTypes.push("Euclid");
    target.alphaMultiplier = 0.4;
    target.speedMultiplier = 0;
    let angle = atan2(this.y - target.y , this.x - target.x);
    let dist = dst(this, target);
    if (dist < this.travelSpeed * tFix){
      target.x = this.x;
      target.y = this.y;
      target.wallSnap();
      return;
    }
    target.x += cos(angle) * this.travelSpeed * tFix;
    target.y += sin(angle) * this.travelSpeed * tFix;
    target.wallSnap();
  } 
}