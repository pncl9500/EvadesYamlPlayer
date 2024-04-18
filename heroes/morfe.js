class Morfe extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = []){
    super(x, y, radius, pal.hero.morfe, name, isMain, game, regionNum, areaNum, ctrlSets);
    this.heroName = "Morfe";
    this.ability1 = new Reverse();
    this.ability2 = new Minimize();
  }
}

class Reverse extends Ability{
  constructor(){
    super(5, 3000, 10, im.ab.reverse);
    this.projectileCounts = [1,2,3,4,5];
    this.fanAngle = 35;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let projCount = this.projectileCounts[this.tier - 1];
    for (var i = 0; i < projCount; i++){
      area.addEnt(new ReverseProjectile(player.x, player.y, player.angle - this.fanAngle / 2 + i * this.fanAngle / projCount, area));
    }
  }
}

class Minimize extends Ability{
  constructor(){
    super(5, 1500, 10, im.ab.minimize);
    this.projectileCounts = [2,3,4,5,6];
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    
  }
}

//later
class Projectile extends Entity{
  constructor(x, y, angle, speed, lifetime, bounces, radius, color, area, z, renderType = "noOutline"){
    super(x, y, radius, color, z, renderType);
    this.angle = angle;
    this.speed = speed;
    this.lifetime = lifetime;
    this.bounces = bounces;
    this.area = area;
    this.bounds = area.bounds;
    //bounce count of -1: infinite bounces
  }
  update(){
    if (this.lifetime !== -1){
      this.lifetime -= deltaTime;
      if (this.lifetime < 0){
        this.toRemove = true;
        return;
      }
    }
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
    this.wallBounce();
  }
  wallBounce(){
    this.x - this.radius < this.bounds.left && (this.x = this.bounds.left + this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.x + this.radius > this.bounds.right && (this.x = this.bounds.right - this.radius, this.angleToVel(), this.xv *= -1, this.velToAngle());
    this.y - this.radius < this.bounds.top && (this.y = this.bounds.top + this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.y + this.radius > this.bounds.bottom && (this.y = this.bounds.bottom - this.radius, this.angleToVel(), this.yv *= -1, this.velToAngle());
    this.bounces--;
    if (this.bounces === 0){
      this.toRemove = true;
      return;
    }
    this.wallBounceEvent();
  }
}