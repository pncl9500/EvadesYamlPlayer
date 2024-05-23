settings = {
  fps: 60,
  //whether or not to draw the grid.
  drawTiles: true,
  //why am i even commenting this
  drawOutlines: true,
  //the color of the grid, alpha included
  gridColor: [
    0,
    0,
    20,
    30,
  ],
  //the width of each grid line.
  gridLineWidth: 1,
  //the size of each grid tile.
  gridSize: 32,
  //if true, changes the color of the background to be more like the current region's color.
  regionBackground : true,
  energyBarColor: [
    0,
    0,
    255,
    255,
  ],
  energyBarOutlineWidth: 1,
  energyBarWidth: 36,
  energyBarHeight: 6,

  invincibilityCheat: false,
  infiniteAbilityUseCheat: false,
  instantRespawn: true,
  rechargeCooldownOnDeath: true,

  randomDummySpawn: true,
  changeCtrlsOnCycle: true,
  removeDeadPlayers: false,
  infiniteDeathTimer: false,
  tasMode: false,
  gamePaused: false,

  wobblyMode: false,
  wobbleFrequency: 1,

  squareMode: false,

  darkMode: false,
  zoneBaseColors: {
    active: {r: 255, g: 255, b: 255},
    safe: {r: 195, g: 195, b: 195},
    exit: {r: 253, g: 244, b: 129},
    removal: {r: 254, g: 250, b: 193},
    teleport: {r: 132, g: 206, b: 220},
    dummy: {r: 213, g: 213, b: 213},
  },
  zoneBaseColorsDark: {
    active: {r: 17, g: 17, b: 17},
    safe: {r: 60, g: 60, b: 60},
    exit: {r: 146, g: 136, b: 42},
    removal: {r: 194, g: 186, b: 120}, //estimated
    teleport: {r: 63, g: 133, b: 147},
    dummy: {r: 17, g: 17, b: 17}, //estimated
  },
  backgroundBrightness: 51,
  pelletOpacity: 1,

  mouseEnabled: true,
  toggleMouse: true,
  mouseToggled: false,
  mouseAngleFix: false,
  mainRelativeMouseControl: false,
  
  fixedWallbounces: true,

  agarMode: false,

  serverLag: false,
  serverLagChance: 0.05,
  serverLagMinLength: 67,
  serverLagMaxLength: 4000,
  serverLagCooldown: 10000,

  shortGameLag: false,
  shortGameLagChance: 12,
  shortGameLagMinLength: 17,
  shortGameLagMaxLength: 60,
  shortGameLagCooldown: 180,

  longGameLag: false,
  longGameLagChance: 0.3,
  longGameLagMinLength: 100,
  longGameLagMaxLength: 400,

  regularGameLag: false,
  regularGameLagInterval: 190,
  regularGameLagMinLength: 40,
  regularGameLagMaxLength: 50,

  lightMapDownsample: 8,
  nightMode: false,
  hideTorches : false,
}