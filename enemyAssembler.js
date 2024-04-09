function getEnemyFromSpawner(x, y, d, enemyType, spawner, spawnIndex, zone){
  let r = spawner.radius;
  let s = spawner.speed;
  let auraSize = spawner[enemyType + "_radius"] ?? (defaults.spawnerProps[enemyType + "_radius"] ?? 150);
  switch (enemyType) {
    //shove new enemies here
    case "normal": return new Normal(x, y, d, s, r);
    case "wall": return new Wall(s, r, spawnIndex, spawner.count, spawner.move_clockwise ?? defaults.spawnerProps.move_clockwise, zone);
    default: return new MysteryEnemy(x, y, d, s, r, pal.nmaur[enemyType] ?? {r: 0, b: 0, g: 0}, pal.nmaur.hasOwnProperty(enemyType) ? auraSize : 0, enemyType);
  }
}