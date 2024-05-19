class Rameses extends Player{
  constructor(x, y, radius, name, isMain, game, regionNum = 0, areaNum = 0, ctrlSets = [], putInArea){
    super(x, y, radius, pal.hero.rameses, name, isMain, game, regionNum, areaNum, ctrlSets, putInArea);
    this.heroName = "Rammeses";
    this.ability1 = new Bandages();
    this.ability2 = new Pit();
  }
}

class Bandages extends Ability{
  constructor(){
    super(5, [12000, 11000, 10000, 9000, 8000], 50, "ab.bandages");
    this.unbandagingDuration = 900;
    this.slowdown = 0.5;
    this.bandagesApplied = false;
    this.applyingBandages = false;
  }
  activate(player, players, pellets, enemies, miscEnts, region, area){
    if (player.hasEffect("BandageEffect") || player.hasEffect("UnbandagingEffect")) this.cancelUse(player);
    this.applyingBandages = true;
    player.gainEffect(new BandagingEffect(this.currentCooldown, this.slowdown));
  }
  behavior(player, players, pellets, enemies, miscEnts, region, area){
    if (this.applyingBandages && this.currentCooldown <= 0){
      this.giveBandages(player);
    }
  }
  giveBandages(player){
    player.gainEffect(new BandageEffect(this.unbandagingDuration));
    //remove bandaging effect if recharged early early
    for (let i = 0; i < player.effects.length; i++){
      if (player.effects[i].constructor.name === "BandagingEffect"){
        player.effects.splice(i, 1);
        i--;
      }
    }
    this.applyingBandages = false;
  }
  startCooldown(player){
    this.currentCooldown = (this.cooldowns[this.tier - 1] * (this.pelletBased ? 1 : player.cooldownMultiplier));
    if (player.hasEffect("SafeZoneEffect")){
      this.currentCooldown /= 2;
    }
    this.cooldownOfPreviousUse = this.currentCooldown;
  }
}

class BandagingEffect extends Effect{
  constructor(duration, slowdown){
    super(duration, getEffectPriority("BandagingEffect"), false, false);
    this.slowdown = slowdown;
  }
  doEffect(target){
    target.speedMultiplier *= this.slowdown;
  }
}

class BandageEffect extends Effect{
  constructor(unbandagingDuration){
    super(-1, getEffectPriority("BandagingEffect"), false, false);
    this.unbandagingDuration = unbandagingDuration;
  }
  gainEffect(target){
    this.bandageVisualOutline = new LockedAura(target, target.radius + 3.1, "#aeac97", 0);
    this.bandageVisual = new LockedAura(target, target.radius + 2.5, "#dddac1", 0);
    target.addAura(this.bandageVisualOutline);
    target.addAura(this.bandageVisual);
  }
  doEffect(target){
    target.cancelContactDeath = true;
  }
  playerEnemyContact(target, contactedEnemy){
    if (contactedEnemy.corrosive){
      target.die();
      return;
    }
    target.gainEffect(new UnbandagingEffect(this.unbandagingDuration, target, this.bandageVisual, this.bandageVisualOutline));
    this.toRemove = true;
  }
}

class UnbandagingEffect extends Effect{
  constructor(duration, player, bandageVisual, bandageVisualOutline){
    super(duration, getEffectPriority("UnbandagingEffect"), false, false);
    this.bandageVisual = bandageVisual;
    this.bandageVisualOutline = bandageVisualOutline;
    this.shrinkSpeed = (bandageVisualOutline.radius - player.radius) / duration;
  }
  doEffect(target){
    target.invincible = true;
    //is this right???
    target.fullEffectImmunity = true;
    target.effectVulnerability = 0;
    this.bandageVisual.radius -= this.shrinkSpeed * dTime;
    this.bandageVisualOutline.radius -= this.shrinkSpeed * dTime;
  }
  removeEffect(target){
    this.bandageVisual.toRemove = true;
    this.bandageVisualOutline.toRemove = true;
  }
}