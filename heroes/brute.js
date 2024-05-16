class Brute extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.brute, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Brute";
    this.ability1 = new Stomp();
    this.ability1.player = this;
    this.ability2 = new Vigor();
  }
}

class Vigor extends Ability{
  constructor(){
    super(5, 0, 0, im.ab.vigor);
    this.reductions = [0.15, 0.30, 0.45, 0.60, 0.75];
    this.maxEnergyReduction = 0.25;
    this.sizeIncreases = [1.03, 1.03, 1.06, 1.06, 1.09];
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.tier === 0){
      return;
    }
    let vulnMultiplier = (1 - (this.reductions[this.tier - 1]) - ((player.energy > player.maxEnergy - 0.01) ? this.maxEnergyReduction : 0))
    player.gainEffect(new VigorEffect(vulnMultiplier, this.sizeIncreases[this.tier - 1], vulnMultiplier === 0));
  }
}

class VigorEffect extends Effect{
  constructor(vuln, size, full){
    super(0, getEffectPriority("VigorEffect"), true);
    this.vuln = vuln;
    this.size = size;
    this.full = full;
  }
  doEffectBeforeAbilities(target){
    target.radiusMultiplier *= this.size;
    target.effectVulnerability *= this.vuln;
    if (this.full){
      target.fullEffectImmunity = true;
    }
  }
}

class Stomp extends ToggleAbility{
  constructor(){
    super(5, 1000, 10, im.ab.stomp);
    this.ranges = [130, 145, 160, 175, 190];
    this.stompTravelTime = 200;
    this.freezeTime = 4000;
    this.recoveryDistance = 512;
    this.aura = new LockedAura({x: 0, y: 0}, this.ranges[this.tier - 1], "#9b580039", z.genericAura + random() * z.randEpsilon);
    //player property given by the player
  }
  upgradeBehavior(player){
    this.aura.radius = this.ranges[this.tier - 1];
  }
  update(){
    this.currentCooldown -= dTime;
    this.aura.update();
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.parent = player;
    player.addAura(this.aura);
  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    this.aura.toRemove = true;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    let affectedEnts = getEntsInRadius(enemies, player.x, player.y, this.ranges[this.tier - 1]);
    for (var i in affectedEnts){
      affectedEnts[i].gainEffect(new StompingEffect(this.player, this.ranges[this.tier - 1], this.stompTravelTime, affectedEnts[i]));
      affectedEnts[i].gainEffect(new StompedEffect(this.player, this.freezeTime, this.recoveryDistance));
    }
  }
}

class StompingEffect extends Effect{
  constructor(player, range, travelTime, enemy){
    super(travelTime, getEffectPriority("StompingEffect"), true);
    this.player = player;
    this.playerInitialX = player.x;
    this.playerInitialY = player.y;
    this.range = range;
    this.travelTime = travelTime;
    this.enemy = enemy;
    this.enemyInitialX = enemy.x;
    this.enemyInitialY = enemy.y;
    this.stompAngle = atan2(enemy.y - player.y, enemy.x - player.x);
    this.initialDist = sqrt(sq(enemy.y - player.y) + sq(enemy.x - player.x));
    this.targetDist = range + enemy.radius;
  }
  doEffect(target){
    let moveDist = ((this.targetDist - this.initialDist) / this.travelTime) * dTime;
    target.x += cos(this.stompAngle) * moveDist;
    target.y += sin(this.stompAngle) * moveDist;
    target.harmless = true;
    target.disabled = true;
    target.alphaMultiplier = 0.4;
  }
}

class StompedEffect extends Effect{
  constructor(player, duration, recoveryDistance){
    super(duration, getEffectPriority("StompedEffect"), true);
    this.player = player;
    this.recoveryDistance = recoveryDistance;
    this.pcf = (player, enemy) => {
      let brute = false;
      for (var i in enemy.effects){
        if (enemy.effects[i].constructor.name === "StompedEffect"){
          brute = enemy.effects[i].player;
          break;
        }
      }
      if (!brute || brute.area !== player.area || brute === player || player.dead){
        return;
      }
      let dist = sqrt(sq(brute.x - player.x) + sq(brute.y - player.y));
      if (dist < 512){
        player.x = brute.x;
        player.y = brute.y;
      }
    }
  }
  doEffect(target){
    target.speedMultiplier = 0;
  }
  gainEffect(target){
    target.playerContactFunctions.push(this.pcf)
  }
  removeEffect(target){
    target.playerContactFunctions.splice(target.playerContactFunctions.indexOf(this.pcf));
  }
}
