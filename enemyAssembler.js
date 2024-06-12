function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex, zone){
  let r = spawner.radius;
  let s = spawner.speed ?? 0;
  let auraSize = spawner[enemyType + "_radius"] ?? (defaults.spawnerProps[enemyType + "_radius"] ?? 150);
  function property(prop){
    return spawner[prop] ?? defaults.spawnerProps[prop];
  }
  let enemy;
  switch (enemyType) {
    //"generic" enemies (really just stuff i can't think of a category for)
    case "normal": enemy = new Normal(x, y, d, s, r);
    case "immune": enemy = new Immune(x, y, d, s, r);
    case "dasher": enemy = new Dasher(x, y, d, s, r);
    case "homing": enemy = new Homing(x, y, d, s, r);
    case "sizing": enemy = new Sizing(x, y, d, s, r);
    case "corrosive": enemy = new Corrosive(x, y, d, s, r);
    case "liquid": enemy = new Liquid(x, y, d, s, r, property("player_detection_radius"));
    case "switch": enemy = new Switch(x, y, d, s, r, spawnIndex, property("switch_interval"));
    case "grass": enemy = new Grass(x, y, d, s, r);
    case "flower": enemy = new Flower(x, y, d, s, r, property("growth_multiplier"));
    case "seedling": enemy = new Seedling(x, y, d, s, r);
    case "fire_trail": enemy = new FireTrail(x, y, d, s, r);
    case "cycling": enemy = new Cycling(x, y, d, s, r);
    case "cactus": enemy = new Cactus(x, y, d, s, r);
    case "lunging": enemy = new Lunging(x, y, d, s, r);
    //case "charging": enemy = new Charging(x, y, d, s, r);

    //wall hitters
    case "crumbling": enemy = new Crumbling(x, y, d, s, r);
    case "snowman": enemy = new Snowman(x, y, d, s, r);

    //invisible enemies
    case "glowy": enemy = new Glowy(x, y, d, s, r);
    case "firefly": enemy = new Firefly(x, y, d, s, r);
    case "mist": enemy = new Mist(x, y, d, s, r);
    case "phantom": enemy = new Phantom(x, y, d, s, r);

    //pumpkins
    case "fake_pumpkin": enemy = new FakePumpkin(x, y, d, s, r);
    case "pumpkin": enemy = new Pumpkin(x, y, d, s, r);
    
    //blinking movement
    case "teleporting": enemy = new Teleporting(x, y, d, s, r);
    case "star": enemy = new Star(x, y, d, s, r);

    //accelerative
    case "sand": enemy = new Sand(x, y, d, s, r);
    case "sandrock": enemy = new SandRock(x, y, d, s, r);
    
    //altered movement
    case "icicle": enemy = new Icicle(x, y, s, r, property("horizontal"));
    case "turning": enemy = new Turning(x, y, d, s, r, property("circle_size"));
    case "wavy": enemy = new Wavy(x, y, spawner.angle === undefined ? undefined : d, s, r);
    case "zigzag": enemy = new Zigzag(x, y, d, s, r);
    case "zoning": enemy = new Zoning(x, y, d, s, r);
    case "spiral": enemy = new Spiral(x, y, d, s, r);
    case "oscillating": enemy = new Oscillating(x, y, d, s, r);

    //aura
    case "slowing": enemy = new Slowing(x, y, d, s, r, auraSize);
    case "draining": enemy = new Draining(x, y, d, s, r, auraSize);
    case "freezing": enemy = new Freezing(x, y, d, s, r, auraSize);
    case "toxic": enemy = new Toxic(x, y, d, s, r, auraSize);
    case "enlarging": enemy = new Enlarging(x, y, d, s, r, auraSize);
    case "disabling": enemy = new Disabling(x, y, d, s, r, auraSize);
    case "lava": enemy = new Lava(x, y, d, s, r, auraSize);
    case "slippery": enemy = new Slippery(x, y, d, s, r, auraSize);
    case "gravity": enemy = new Gravity(x, y, d, s, r, auraSize, property("gravity"));
    case "repelling": enemy = new Repelling(x, y, d, s, r, auraSize, property("repulsion"));
    case "reducing": enemy = new Reducing(x, y, d, s, r, auraSize);
    case "barrier": enemy = new Invin(x, y, d, s, r, auraSize);
    case "blocking": enemy = new Blocking(x, y, d, s, r, auraSize);
    case "experience_drain": enemy = new ExperienceDrain(x, y, d, s, r, auraSize);
    case "radar": enemy = new Radar(x, y, d, s, r, auraSize);
    case "quicksand": enemy = new Quicksand(x, y, d, s, r, auraSize, property("push_direction"), property("quicksand_strength"));
    case "magnetic_reduction": enemy = new MagneticReduction(x, y, d, s, r, auraSize);
    case "magnetic_nullification": enemy = new MagneticNullification(x, y, d, s, r, auraSize);

    //sniper
    case "sniper": enemy = new Sniper(x, y, d, s, r);
    case "speed_sniper": enemy = new SpeedSniper(x, y, d, s, r, property("speed_loss"));
    case "regen_sniper": enemy = new RegenSniper(x, y, d, s, r, property("regen_loss"));
    case "corrosive_sniper": enemy = new CorrosiveSniper(x, y, d, s, r);
    case "poison_sniper": enemy = new PoisonSniper(x, y, d, s, r);
    case "ice_sniper": enemy = new IceSniper(x, y, d, s, r);
    case "force_sniper_a": enemy = new ForceSniperA(x, y, d, s, r);
    case "force_sniper_b": enemy = new ForceSniperB(x, y, d, s, r);
    case "wind_sniper": enemy = new WindSniper(x, y, d, s, r);
    case "positive_magnetic_sniper": enemy = new PositiveMagneticSniper(x, y, d, s, r);
    case "negative_magnetic_sniper": enemy = new NegativeMagneticSniper(x, y, d, s, r);

    //pseudo sniper
    case "radiating_bullets": enemy = new RadiatingBullets(x, y, d, s, r, property("release_time"), property("release_interval"));
    case "tree": enemy = new Tree(x, y, d, s, r);
    case "stalactite": enemy = new Stalactite(x, y, d, s, r);
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
    // );

    //ghost
    case "disabling_ghost": enemy = new DisablingGhost(x, y, d, s, r);
    case "speed_ghost": enemy = new SpeedGhost(x, y, d, s, r);
    case "regen_ghost": enemy = new RegenGhost(x, y, d, s, r);
    case "poison_ghost": enemy = new PoisonGhost(x, y, d, s, r);
    case "ice_ghost": enemy = new IceGhost(x, y, d, s, r);
    case "gravity_ghost": enemy = new GravityGhost(x, y, d, s, r);
    case "repelling_ghost": enemy = new RepellingGhost(x, y, d, s, r);
    case "wind_ghost": enemy = new WindGhost(x, y, d, s, r);
    case "positive_magnetic_ghost": enemy = new PositiveMagneticGhost(x, y, d, s, r);
    case "negative_magnetic_ghost": enemy = new NegativeMagneticGhost(x, y, d, s, r);

    //wall
    case "wall": enemy = new Wall(s, r, spawnIndex, spawner.count, spawner.move_clockwise ?? defaults.spawnerProps.move_clockwise, zone);
    default: enemy = new MysteryEnemy(x, y, d, s, r, pal.nmaur[enemyType] ?? {r: 0, b: 0, g: 0}, pal.nmaur.hasOwnProperty(enemyType) ? auraSize : 0, enemyType);
  }
  enemy.parentZone = zone;
  enemy.wallSnap();
  return enemy;
}
