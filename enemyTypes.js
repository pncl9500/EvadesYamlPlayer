class MysteryEnemy extends AuraEnemy{
  constructor(x, y, angle, speed, radius, auraColor, auraRadius, placeholderType){
    super(x, y, angle, speed, radius, pal.nm.hasOwnProperty(placeholderType) ? pal.nm[placeholderType] : pal.nm.mystery, auraColor, auraRadius);
  }
}

class Normal extends Enemy{
  constructor(x, y, angle, speed, radius){
    super(x, y, angle, speed, radius, pal.nm.normal);
  }
}