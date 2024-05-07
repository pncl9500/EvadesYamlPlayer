function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex, zone){
  let r = spawner.radius;
  let s = spawner.speed;
  let auraSize = spawner[enemyType + "_radius"] ?? (defaults.spawnerProps[enemyType + "_radius"] ?? 150);
  switch (enemyType) {
    //shove new enemies here
    case "normal": return new Normal(x, y, d, s, r);
    case "immune": return new Immune(x, y, d, s, r);
    case "dasher": return new Dasher(x, y, d, s, r);
    case "homing": return new Homing(x, y, d, s, r);

    //aura
    case "slowing": return new Slowing(x, y, d, s, r, auraSize);
    case "draining": return new Draining(x, y, d, s, r, auraSize);
    case "freezing": return new Freezing(x, y, d, s, r, auraSize);
    case "toxic": return new Toxic(x, y, d, s, r, auraSize);
    case "enlarging": return new Enlarging(x, y, d, s, r, auraSize);
    case "disabling": return new Disabling(x, y, d, s, r, auraSize);
    case "lava": return new Lava(x, y, d, s, r, auraSize);
    
    //wall
    case "wall": return new Wall(s, r, spawnIndex, spawner.count, spawner.move_clockwise ?? defaults.spawnerProps.move_clockwise, zone);
    default: return new MysteryEnemy(x, y, d, s, r, pal.nmaur[enemyType] ?? {r: 0, b: 0, g: 0}, pal.nmaur.hasOwnProperty(enemyType) ? auraSize : 0, enemyType);
  }
}