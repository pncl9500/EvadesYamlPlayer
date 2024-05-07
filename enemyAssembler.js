function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex, zone){
  let r = spawner.radius;
  let s = spawner.speed;
  let auraSize = spawner[enemyType + "_radius"] ?? (defaults.spawnerProps[enemyType + "_radius"] ?? 150);
  function property(prop){
    return spawner[prop] ?? defaults.spawnerProps[prop];
  }
  switch (enemyType) {
    //"generic" enemies
    case "normal": return new Normal(x, y, d, s, r);
    case "immune": return new Immune(x, y, d, s, r);
    case "dasher": return new Dasher(x, y, d, s, r);
    case "homing": return new Homing(x, y, d, s, r);
    case "sizing": return new Sizing(x, y, d, s, r);
    case "corrosive": return new Corrosive(x, y, d, s, r);
    
    //altered movement
    case "turning": return new Turning(x, y, d, s, r, property("circle_size"));

    //aura
    case "slowing": return new Slowing(x, y, d, s, r, auraSize);
    case "draining": return new Draining(x, y, d, s, r, auraSize);
    case "freezing": return new Freezing(x, y, d, s, r, auraSize);
    case "toxic": return new Toxic(x, y, d, s, r, auraSize);
    case "enlarging": return new Enlarging(x, y, d, s, r, auraSize);
    case "disabling": return new Disabling(x, y, d, s, r, auraSize);
    case "lava": return new Lava(x, y, d, s, r, auraSize);

    //sniper
    case "sniper": return new Sniper(x, y, d, s, r);
    case "speed_sniper": return new SpeedSniper(x, y, d, s, r, property("speed_loss"));
    case "regen_sniper": return new RegenSniper(x, y, d, s, r, property("regen_loss"));
    case "corrosive_sniper": return new CorrosiveSniper(x, y, d, s, r);

    //pseudo sniper
    case "radiating_bullets": return new RadiatingBullets(x, y, d, s, r, property("release_time"), property("release_interval"));

    //ghost
    case "disabling_ghost": return new DisablingGhost(x, y, d, s, r);
    case "speed_ghost": return new SpeedGhost(x, y, d, s, r);
    case "regen_ghost": return new RegenGhost(x, y, d, s, r);

    //wall
    case "wall": return new Wall(s, r, spawnIndex, spawner.count, spawner.move_clockwise ?? defaults.spawnerProps.move_clockwise, zone);
    default: return new MysteryEnemy(x, y, d, s, r, pal.nmaur[enemyType] ?? {r: 0, b: 0, g: 0}, pal.nmaur.hasOwnProperty(enemyType) ? auraSize : 0, enemyType);
  }
}
