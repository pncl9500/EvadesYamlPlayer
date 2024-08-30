function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex, zone){
  let r = spawner.radius;
  let s = spawner.speed ?? 0;
  if (settings.useNewUnits) {
    s /= 30;
  }
  let auraSize = spawner[enemyType + "_radius"] ?? (defaults.spawnerProps[enemyType + "_radius"] ?? 150);
  function property(prop){
    return spawner[prop] ?? defaults.spawnerProps[prop];
  }
  let enemy;
  switch (enemyType) {
    //"generic" enemies (really just stuff i can't think of a category for)
    case "normal": enemy = new Normal(x, y, d, s, r); break;
    case "immune": enemy = new Immune(x, y, d, s, r); break;
    case "dasher": enemy = new Dasher(x, y, d, s, r); break;
    case "homing": enemy = new Homing(x, y, d, s, r); break;
    case "sizing": enemy = new Sizing(x, y, d, s, r); break;
    case "corrosive": enemy = new Corrosive(x, y, d, s, r); break;
    case "liquid": enemy = new Liquid(x, y, d, s, r, property("player_detection_radius")); break;
    case "switch": enemy = new Switch(x, y, d, s, r, spawnIndex, property("switch_interval")); break;
    case "grass": enemy = new Grass(x, y, d, s, r); break;
    case "flower": enemy = new Flower(x, y, d, s, r, property("growth_multiplier")); break;
    case "seedling": enemy = new Seedling(x, y, d, s, r); break;
    case "fire_trail": enemy = new FireTrail(x, y, d, s, r); break;
    case "cycling": enemy = new Cycling(x, y, d, s, r); break;
    case "cactus": enemy = new Cactus(x, y, d, s, r); break;
    case "lunging": enemy = new Lunging(x, y, d, s, r); break;
    //case "charging": enemy = new Charging(x, y, d, s, r); break;

    //wall hitters
    case "crumbling": enemy = new Crumbling(x, y, d, s, r); break;
    case "snowman": enemy = new Snowman(x, y, d, s, r); break;

    //invisible enemies
    case "glowy": enemy = new Glowy(x, y, d, s, r); break;
    case "firefly": enemy = new Firefly(x, y, d, s, r); break;
    case "mist": enemy = new Mist(x, y, d, s, r); break;
    case "phantom": enemy = new Phantom(x, y, d, s, r); break;

    //pumpkins
    case "fake_pumpkin": enemy = new FakePumpkin(x, y, d, s, r); break;
    case "pumpkin": enemy = new Pumpkin(x, y, d, s, r); break;
    
    //blinking movement
    case "teleporting": enemy = new Teleporting(x, y, d, s, r); break;
    case "star": enemy = new Star(x, y, d, s, r); break;

    //accelerative
    case "sand": enemy = new Sand(x, y, d, s, r); break;
    case "sandrock": enemy = new SandRock(x, y, d, s, r); break;
    
    //altered movement
    case "icicle": enemy = new Icicle(x, y, s, r, property("horizontal")); break;
    case "turning": enemy = new Turning(x, y, d, s, r, property("circle_size")); break;
    case "wavy": enemy = new Wavy(x, y, spawner.angle === undefined ? undefined : d, s, r); break;
    case "zigzag": enemy = new Zigzag(x, y, d, s, r); break;
    case "zoning": enemy = new Zoning(x, y, d, s, r); break;
    case "spiral": enemy = new Spiral(x, y, d, s, r); break;
    case "oscillating": enemy = new Oscillating(x, y, d, s, r); break;

    //aura
    case "slowing": enemy = new Slowing(x, y, d, s, r, auraSize); break;
    case "draining": enemy = new Draining(x, y, d, s, r, auraSize); break;
    case "freezing": enemy = new Freezing(x, y, d, s, r, auraSize); break;
    case "toxic": enemy = new Toxic(x, y, d, s, r, auraSize); break;
    case "enlarging": enemy = new Enlarging(x, y, d, s, r, auraSize); break;
    case "disabling": enemy = new Disabling(x, y, d, s, r, auraSize); break;
    case "lava": enemy = new Lava(x, y, d, s, r, auraSize); break;
    case "slippery": enemy = new Slippery(x, y, d, s, r, auraSize); break;
    case "gravity": enemy = new Gravity(x, y, d, s, r, auraSize, property("gravity")); break;
    case "repelling": enemy = new Repelling(x, y, d, s, r, auraSize, property("repulsion")); break;
    case "reducing": enemy = new Reducing(x, y, d, s, r, auraSize); break;
    case "barrier": enemy = new Invin(x, y, d, s, r, auraSize); break;
    case "blocking": enemy = new Blocking(x, y, d, s, r, auraSize); break;
    case "experience_drain": enemy = new ExperienceDrain(x, y, d, s, r, auraSize); break;
    case "radar": enemy = new Radar(x, y, d, s, r, auraSize); break;
    case "quicksand": enemy = new Quicksand(x, y, d, s, r, auraSize, property("push_direction"), property("quicksand_strength")); break;
    case "magnetic_reduction": enemy = new MagneticReduction(x, y, d, s, r, auraSize); break;
    case "magnetic_nullification": enemy = new MagneticNullification(x, y, d, s, r, auraSize); break;

    //sniper
    case "sniper": enemy = new Sniper(x, y, d, s, r); break;
    case "speed_sniper": enemy = new SpeedSniper(x, y, d, s, r, property("speed_loss")); break;
    case "regen_sniper": enemy = new RegenSniper(x, y, d, s, r, property("regen_loss")); break;
    case "corrosive_sniper": enemy = new CorrosiveSniper(x, y, d, s, r); break;
    case "poison_sniper": enemy = new PoisonSniper(x, y, d, s, r); break;
    case "ice_sniper": enemy = new IceSniper(x, y, d, s, r); break;
    case "force_sniper_a": enemy = new ForceSniperA(x, y, d, s, r); break;
    case "force_sniper_b": enemy = new ForceSniperB(x, y, d, s, r); break;
    case "wind_sniper": enemy = new WindSniper(x, y, d, s, r); break;
    case "positive_magnetic_sniper": enemy = new PositiveMagneticSniper(x, y, d, s, r); break;
    case "negative_magnetic_sniper": enemy = new NegativeMagneticSniper(x, y, d, s, r); break;

    //pseudo sniper
    case "radiating_bullets": enemy = new RadiatingBullets(x, y, d, s, r, property("release_time"), property("release_interval")); break;
    case "tree": enemy = new Tree(x, y, d, s, r); break;
    case "stalactite": enemy = new Stalactite(x, y, d, s, r); break;
    // case "frost_giant": enemy = new FrostGiant(x, y, d, s, r,
    //   property("direction"),
    //   property("turn_speed"),
    //   property("shot_interval"),
    //   property("cone_angle"),
    //   property("pause_interval"),
    //   property("pause_duration"),
    //   property("turn_acceleration"),
    //   property("shot_acceleration"),
    //   property("pattern"),
    //   property("immune"),
    //   property("projectile_duration"),
    //   property("projectile_radius"),
    //   property("projectile_speed"),
    // ); break;

    //ghost
    case "disabling_ghost": enemy = new DisablingGhost(x, y, d, s, r); break;
    case "speed_ghost": enemy = new SpeedGhost(x, y, d, s, r); break;
    case "regen_ghost": enemy = new RegenGhost(x, y, d, s, r); break;
    case "poison_ghost": enemy = new PoisonGhost(x, y, d, s, r); break;
    case "ice_ghost": enemy = new IceGhost(x, y, d, s, r); break;
    case "gravity_ghost": enemy = new GravityGhost(x, y, d, s, r); break;
    case "repelling_ghost": enemy = new RepellingGhost(x, y, d, s, r); break;
    case "wind_ghost": enemy = new WindGhost(x, y, d, s, r); break;
    case "positive_magnetic_ghost": enemy = new PositiveMagneticGhost(x, y, d, s, r); break;
    case "negative_magnetic_ghost": enemy = new NegativeMagneticGhost(x, y, d, s, r); break;

    //wall
    case "wall": enemy = new Wall(s, r, spawnIndex, spawner.count, spawner.move_clockwise ?? defaults.spawnerProps.move_clockwise, zone); break;
    default: enemy = new MysteryEnemy(x, y, d, s, r, pal.nmaur[enemyType] ?? {r: 0, b: 0, g: 0}, pal.nmaur.hasOwnProperty(enemyType) ? auraSize : 0, enemyType); break;
  }
  enemy.parentZone = zone;
  if (enemy.constructor.name !== "Wall") enemy.wallSnap();
  return enemy;
}
