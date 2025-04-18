class Kuipra extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.kuipra, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Kuipra";
    this.ability1 = new Tailwind(this);
    this.ability2 = new Energize();
  }
  onAreaExit() {
    this.ability1.removeProjs()
  }
  enemyCollision(enemy){
    if (!enemy.corrosive) {
      if (this.ability1.projectiles.length > 0) {
        this.x = this.ability1.projectiles[0].x;
        this.y = this.ability1.projectiles[0].y;
        this.ability1.projectiles[0].toRemove = true;
        this.ability1.projectiles.shift();
        return;
      }
    }
    super.enemyCollision(enemy);
  }
}

class Tailwind extends Ability{
  constructor(player){
    super(5, 0, 0, "ab.energize");
    this.projectiles = [];
    this.rates = [7000, 6000, 5000, 4000, 3000];
    this.timer = 0;
    this.player = player;
    this.maxProjectiles = 3;
  }
  removeProjs(){
    for (var i in this.projectiles) {
      this.projectiles[i].toRemove = true;
    }
    this.projectiles = [];
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier <= 0) {return}

    if (this.projectiles.length >= this.maxProjectiles) {return}
    this.timer += dTime;
    if (player.hasEffectLate("SafeZoneEffect")) {
      this.timer += dTime * 24;
    }
    if (this.timer > this.rates[this.tier - 1]) {
      this.timer = 0;
      this.makeProj(area)
    }
  }
  makeProj(area){
    let proj = new TailwindProjectile(this.player, this.projectiles)
    this.projectiles.push(proj)
    area.entities.push(proj)
  }
}

class TailwindProjectile extends Entity {
  constructor(player, projectiles) {
    super(player.x, player.y, 15, "d79cff", 0, "noOutline");
    this.player = player
    this.projectiles = projectiles
  }
  update() {
    this.alphaMultiplier = 0.5;
    this.index = this.projectiles.indexOf(this);
    if (this.index == -1) {
      return;
    }
    if (this.index == 0) {
      this.target = this.player
    } else {
      this.target = this.projectiles[this.index - 1]
    }
    this.x += (this.target.x - this.x) * 0.45 * tFix;
    this.y += (this.target.y - this.y) * 0.45 * tFix;
  }
}