class Ability{
  constructor(maxTier = 5, cooldowns = 0, cost = 0, image = "missingImage"){
    this.image = image;
    this.tier = 0;
    this.maxTier = maxTier;
    this.cooldowns = cooldowns;
    this.cooldownOfPreviousUse = 0;
    this.currentCooldown = 0;
    this.usableWhileDead = false;
    this.usableWhileAlive = true;
    if (this.cooldowns.length === undefined){
      this.cooldowns = [this.cooldowns,this.cooldowns,this.cooldowns,this.cooldowns,this.cooldowns];
    }
    this.cost = cost;
    this.rechargingActive = true;
  }
  upgrade(player, forceUpgrade = false){
    if ((player.upgradePoints > 0 || forceUpgrade) && this.tier < this.maxTier){
      this.tier++;
      if (!forceUpgrade){
        player.upgradePoints--;
      }
      this.upgradeBehavior(player);
    }
  }
  upgradeBehavior(player){

  }
  update(player){
    if (!this.pelletBased && this.rechargingActive){
      this.currentCooldown -= dTime;
    }
  }
  recharge(amount){
    this.currentCooldown -= amount;
  }
  behavior(player){

  }
  //for things like rameses latch where you can only use it if you have bandages
  useConditionSatisfied(player){
    return true;
  }
  canUseAbility(player){
    return this.currentCooldown <= 0 && 
           (player.energy - player.tempMinEnergy) >= this.cost && 
           !player.abilitiesDisabled && 
           (!player.dead || this.usableWhileDead) &&
           (player.dead || this.usableWhileAlive) &&
           this.tier != 0;
  }
  attemptUse(player, override){
    if (this.passive && !override){
      return;
    }
    if (this.canUseAbility(player)){
      if (this.useConditionSatisfied(player)){
        this.startCooldown(player);
        this.use(player);
        this.drainEnergy(player);
      }
    } else {
      let prms = this.getActivationParams(player);
      this.useDuringCooldown(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    }
  }
  useDuringCooldown(player, players, pellets, enemies, miscEnts, region, area){

  }
  startCooldown(player){
    this.currentCooldown = this.cooldowns[this.tier - 1] * (this.pelletBased ? 1 : player.cooldownMultiplier);
    this.cooldownOfPreviousUse = this.currentCooldown;
  }
  cancelUse(player, giveEnergy = true){
    this.currentCooldown = 0;
    //i don't want to bloat this out even more with a new cooldown of previous use variable god help me
    if (!giveEnergy) return;
    player.energy += this.cost;
  }
  use(player){
    let prms = this.getActivationParams(player);
    this.activate(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){

  }
  getActivationParams(player){
    let players = [];
    let pellets = [];
    let enemies = [];
    let miscEnts = [];
    let region = player.region;
    let area = player.area;
    for (let i in area.entities){
      let ent = area.entities[i];
      switch (ent.mainType) {
        case "enemy":
          enemies.push(ent);
          break;
        case "pellet":
          pellets.push(ent);
          break;
        default:
          miscEnts.push(ent);
          break;
      }
    }
    for (let i in area.players){
      if (area.players[i] !== player){
        players.push(area.players[i]);
      }
    }
    return {players: players, pellets: pellets, enemies: enemies, miscEnts: miscEnts, region: region, area: area};
  }
  drainEnergy(player){
    player.energy -= this.cost;
  }
  tryToggleOffThroughDeath(player){
    if (this.onDeathPassive){
      this.attemptUse(player, true);
    }
    return;
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){

  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    
  }
}

class ToggleAbility extends Ability{
  constructor(maxTier = 5, cooldowns = 0, cost = 0, image = "missingImage"){
    super(maxTier, cooldowns, cost, image);
    this.toggled = false;
    this.toggleOffOnDeath = true;
  }
  tryToggleOffThroughDeath(player){
    if(this.toggleOffOnDeath && this.toggled){
      this.toggled = false;
      let prms = this.getActivationParams(player);
      this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    }
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){

  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    
  }
  attemptUse(player, override){
    if (this.passive && !override){
      return;
    }
    if (this.canUseAbility(player)){
      if (this.useConditionSatisfied()){
        if (this.toggled === false){
          this.toggled = true;
          let prms = this.getActivationParams(player);
          this.toggleOn(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
          return;
        }
        if (this.toggled === true){
          this.toggled = false;
          let prms = this.getActivationParams(player);
          this.startCooldown(player);
          this.activate(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
          this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
          this.drainEnergy(player);
          return;
        }
      }
    }
  }
}

class ContinuousToggleAbility extends ToggleAbility{
  constructor(maxTier = 5, cooldowns = 0, cost = 0, image = "missingImage"){
    super(maxTier, cooldowns, cost, image);
    this.energyUseEpsilon = 0.05;
  }
  tryToggleOffThroughDeath(player){
    if(this.toggleOffOnDeath && this.toggled){
      this.toggled = false;
      this.startCooldown(player);
      let prms = this.getActivationParams(player);
      this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    }
  }
  canUseAbility(player){
    return this.currentCooldown <= 0 && 
           (abs(player.energy - player.tempMinEnergy)) > this.energyUseEpsilon && 
           !player.abilitiesDisabled && 
           (!player.dead || this.usableWhileDead) &&
           this.tier !== 0;
  }
  update(player){
    if (!this.pelletBased){
      this.currentCooldown -= dTime;
    }
    if (this.toggled){
      this.drainEnergy(player);
    }
  }
  drainEnergy(player){
    player.energy -= this.cost * tFix * (1/30);
    if (abs(player.energy - player.tempMinEnergy) < this.energyUseEpsilon){
      player.energy = player.tempMinEnergy;
      let prms = this.getActivationParams(player);
      this.toggled = false;
      this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
    }
  }
  attemptUse(player, override){
    if (this.passive && !override){
      return;
    }
    if (!this.useConditionSatisfied()){
      return;
    }
    if (this.toggled === false){
      if (this.canUseAbility(player)){
        this.toggled = true;
        let prms = this.getActivationParams(player);
        this.toggleOn(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
        this.activate(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
        return;
      }
    }
    if (this.toggled === true){
      this.toggled = false;
      let prms = this.getActivationParams(player);
      this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
      this.startCooldown(player);
      return;
    }
  }
}