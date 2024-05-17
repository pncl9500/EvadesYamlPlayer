class ControlSet{
  constructor(active = true){
    this.active = active;
    this.ctrlType = null;
  }
  getCtrlVector(){
    return this.active ? {x: 0, y: 0} : null;
  }
}

class KeyCtrlSet extends ControlSet{
  constructor(upKey, downKey, leftKey, rightKey, ab1Key, ab2Key, ab3Key){
    super(true);
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.ab1Key = ab1Key;
    this.ab2Key = ab2Key;
    this.ab3Key = ab3Key;
    this.ab1KeyPressed = false;
    this.ab2KeyPressed = false;
    this.ab3KeyPressed = false;
    this.ab1KeyUsable = true;
    this.ab2KeyUsable = true;
    this.ab3KeyUsable = true;
    this.ab1KeyTapped = false;
    this.ab2KeyTapped = false;
    this.ab3KeyTapped = false;
  }
  getCtrlVector(){
    let x = keyIsDown(this.rightKey) ? 1 : (keyIsDown(this.leftKey) ? -1 : null);
    let y = keyIsDown(this.upKey) ? -1 : (keyIsDown(this.downKey) ? 1 : null);
    return {x: x, y: y};
  }
  getAbKeyStates(){
    this.ab1KeyTapped = false;
    this.ab2KeyTapped = false;
    this.ab3KeyTapped = false;
    if (!keyIsDown(this.ab1Key) && !this.ab1KeyUsable){ this.ab1KeyUsable = true }
    if (!keyIsDown(this.ab2Key) && !this.ab2KeyUsable){ this.ab2KeyUsable = true }
    if (!keyIsDown(this.ab3Key) && !this.ab3KeyUsable){ this.ab3KeyUsable = true }
    if (keyIsDown(this.ab1Key) && this.ab1KeyUsable){ this.ab1KeyUsable = false; this.ab1KeyTapped = true}
    if (keyIsDown(this.ab2Key) && this.ab2KeyUsable){ this.ab2KeyUsable = false; this.ab2KeyTapped = true}
    if (keyIsDown(this.ab3Key) && this.ab3KeyUsable){ this.ab3KeyUsable = false; this.ab3KeyTapped = true}
  }
}

class WASDset extends KeyCtrlSet{constructor(){super(87, 83, 65, 68, 74, 75, 76); this.ctrlType = "wasd"; this.setPriority = 1}}
class ArrowSet extends KeyCtrlSet{constructor(){super(38, 40, 37, 39, 90, 88, 67); this.ctrlType = "arrows"; this.setPriority = 2}}

class MouseSet extends ControlSet{
  constructor(){
    super(true);
    this.setPriority = 0;
    this.ctrlType = "mouse";
    this.ab1Key = 90;
    this.ab2Key = 88;
    this.ab3Key = 67;
    this.ab1KeyPressed = false;
    this.ab2KeyPressed = false;
    this.ab3KeyPressed = false;
    this.ab1KeyUsable = true;
    this.ab2KeyUsable = true;
    this.ab3KeyUsable = true;
    this.ab1KeyTapped = false;
    this.ab2KeyTapped = false;
    this.ab3KeyTapped = false;
  }
  getCtrlVector(player){
    if (!settings.mouseEnabled) return {x: null, y: null};
    if (cheatMenuOpen) return {x: null, y: null};
    if (!settings.toggleMouse && !mouseIsPressed) return {x: null, y: null};
    if (settings.toggleMouse && !settings.mouseToggled) return {x: null, y: null};
    var gameMouseX = 0 + game.mainPlayer.x + ((mouseX - windowWidth / 2)) / (pixelToUnitRatio);
    var gameMouseY = 0 + game.mainPlayer.y + ((mouseY - windowHeight / 2)) / (pixelToUnitRatio);
    let dx = gameMouseX - (settings.mainRelativeMouseControl ? (game.mainPlayer.x) : (player.x + (player.area.x - game.mainPlayer.area.x)));
    let dy = gameMouseY - (settings.mainRelativeMouseControl ? (game.mainPlayer.y) : (player.y + (player.area.y - game.mainPlayer.area.y)));
    if (!settings.mainRelativeMouseControl && mainPlayer.region !== player.region){
      dx = 0;
      dy = 0;
    }
    let maxOrthogDist = 150;
    let maxDiagonalDist = 200;
    let dist = sqrt((dx)*(dx) + (dy)*(dy));
    if (dist > maxDiagonalDist){
      dx *= maxDiagonalDist / dist;
      dy *= maxDiagonalDist / dist;
    }
    dx = constrain(dx, -maxOrthogDist, maxOrthogDist);
    dy = constrain(dy, -maxOrthogDist, maxOrthogDist);
    if (abs(dx) > maxOrthogDist){
      dx *= maxOrthogDist / dist;
    }
    if (abs(dy) > maxOrthogDist){
      dy *= maxOrthogDist / dist;
    }
    let mouseAngle = atan2(dy, dx);

    if (settings.mouseAngleFix){
      mouseAngle = atan2(gameMouseY - player.y, gameMouseX - player.x);
    }
    let mouseDistance = sqrt(dx**2 + dy**2);
    let xStrength = (mouseDistance / maxOrthogDist) * cos(mouseAngle);
    let yStrength = (mouseDistance / maxOrthogDist) * sin(mouseAngle);
    return {x: xStrength, y: yStrength};
  }
  getAbKeyStates(){
    this.ab1KeyTapped = false;
    this.ab2KeyTapped = false;
    this.ab3KeyTapped = false;
    if (!keyIsDown(this.ab1Key) && !this.ab1KeyUsable){ this.ab1KeyUsable = true }
    if (!keyIsDown(this.ab2Key) && !this.ab2KeyUsable){ this.ab2KeyUsable = true }
    if (!keyIsDown(this.ab3Key) && !this.ab3KeyUsable){ this.ab3KeyUsable = true }
    if (keyIsDown(this.ab1Key) && this.ab1KeyUsable){ this.ab1KeyUsable = false; this.ab1KeyTapped = true}
    if (keyIsDown(this.ab2Key) && this.ab2KeyUsable){ this.ab2KeyUsable = false; this.ab2KeyTapped = true}
    if (keyIsDown(this.ab3Key) && this.ab3KeyUsable){ this.ab3KeyUsable = false; this.ab3KeyTapped = true}
  }
}

defaultControls = [
  new MouseSet(),
  new WASDset(),
  new ArrowSet(),
]