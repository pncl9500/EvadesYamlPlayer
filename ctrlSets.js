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
  constructor(upKey, downKey, leftKey, rightKey){
    super(true);
    this.upKey = upKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
  }
  getCtrlVector(){
    let x = keyIsDown(this.rightKey) ? 1 : (keyIsDown(this.leftKey) ? -1 : 0);
    let y = keyIsDown(this.upKey) ? -1 : (keyIsDown(this.downKey) ? 1 : 0);
    return this.active && {} ? {x: x, y: y} : null;
  }
}

class WASDset extends KeyCtrlSet{constructor(){super(87, 83, 65, 68); this.ctrlType = "wasd";}}
class IJKLset extends KeyCtrlSet{constructor(){super(73, 75, 74, 76); this.ctrlType = "ijkl";}}
class ArrowSet extends KeyCtrlSet{constructor(){super(38, 40, 37, 39); this.ctrlType = "arrows";}}

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