class MysteryEnemy extends Enemy{
  constructor(x, y, angle, speed, radius, placeholderType){
    console.warn(`unimplemented enemy type "${placeholderType}"`)
    super(x, y, angle, speed, radius, pal.nm.hasOwnProperty(placeholderType) ? pal.nm[placeholderType] : pal.nm.mystery);
  }
}

class Normal extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.normal);
  }
}