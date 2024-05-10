effectPriorities = {
  //on player
  DeadEffect: 2000,
  SafeZoneEffect: -200,
  HardenEffect: 1000,
  FlowEffect: 0,
  MinimumSpeedZoneEffect: -2000,

  PoisonSniperEffect: 1700,
  
  BarrierEffect: -1000,
  StreamEffect: 1950,

  CheatInvincibilityEffect: 4000,
  CheatInfiniteAbilityEffect: 4000,

  EnergizeEffect: 1000,
  VigorEffect: 200,
  FullVigorEffect: 200,

  SlowingEnemyEffect: 500,
  DrainingEnemyEffect: 500,
  FreezingEnemyEffect: 500,
  EnlargingEnemyEffect: 500,
  DisablingEnemyEffect: 500, //after vigor (important)
  LavaEnemyEffect: 500,
  IceSniperEffect: 1900,
  SlipperyEnemyEffect: 900,
  ReducingEnemyEffect: 480, //before enlarging (important), before post effect (important)
  ReducingEnemyPostEffect: 490, //before enlarging (important)
  InvinEnemyEffect: 500,
  BlockingEnemyEffect: -99999, //REALLY low (important)

  //on enemy
  FreezeEffect: 1000,
  StompedEffect: 1010,
  StompingEffect: 1010,
  MinimizeEffect: 1000,
  RevivingEnemyEffect: 1000,
  DistortEffect: 1000,

  IsGhostEffect: 2000,

}

function getEffectPriority(effectName){
  return effectPriorities[effectName];
}