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

class WASDset extends KeyCtrlSet{constructor(){super(87, 83, 65, 68, 74, 75, 76); this.ctrlType = "wasd";}}
class ArrowSet extends KeyCtrlSet{constructor(){super(38, 40, 37, 39, 90, 88, 67); this.ctrlType = "arrows";}}

class MouseSet extends ControlSet{
  constructor(){
    super(false);
    this.ctrlType = "mouse";
  }
  getCtrlVector(){
    //todo
    return null;
  }
}