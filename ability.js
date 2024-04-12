class Ability{
  constructor(maxTier = 5, cooldowns = 0, cost = 0, image = im.missingImage){
    this.image = image;
    this.tier = 1;
    this.maxTier = maxTier;
    this.cooldowns = cooldowns;
    this.cooldownOfPreviousUse = 0;
    this.currentCooldown = 0;
    this.usableWhileDead = false;
    if (this.cooldowns.length === undefined){
      this.cooldowns = [this.cooldowns,this.cooldowns,this.cooldowns,this.cooldowns,this.cooldowns];
    }
    this.cost = cost;
  }
  update(player){
    this.currentCooldown -= deltaTime;
  }
  behavior(){

  }
  //for things like rameses latch where you can only use it if you have bandages
  useConditionSatisfied(){
    return true;
  }
  canUseAbility(player){
    return this.currentCooldown <= 0 && 
           player.energy - player.tempMinEnergy > this.cost && 
           !player.abilitiesDisabled && 
           (!player.dead || this.usableWhileDead);
  }
  attemptUse(player){
    if (this.canUseAbility(player)){
      if (this.useConditionSatisfied()){
        this.use(player);
        this.drainEnergy(player);
        this.startCooldown(player);
      }
    }
  }
  startCooldown(player){
    this.currentCooldown = this.cooldowns[this.tier - 1];
    this.cooldownOfPreviousUse = this.currentCooldown;
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
}

class ToggleAbility extends Ability{
  constructor(maxTier = 5, cooldowns = 0, cost = 0, image = im.missingImage){
    super(maxTier, cooldowns, cost, image);
    this.toggled = false;
  }
  toggleOn(player, players, pellets, enemies, miscEnts, region, area){

  }
  toggleOff(player, players, pellets, enemies, miscEnts, region, area){
    
  }
  attemptUse(player){
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
          this.toggleOff(player, prms.players, prms.pellets, prms.enemies, prms.miscEnts, prms.region, prms.area);
          this.drainEnergy(player);
          this.startCooldown(player);
          return;
        }
      }
    }
  }
}