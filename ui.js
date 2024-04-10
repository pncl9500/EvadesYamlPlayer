function initUI(){
  return new UI;
}
class UI{
  constructor(){
    this.uiPanels = [];
    //this.uiPanels.push(new Chat());
  }
  draw(){
    for (var i in this.uiPanels){
      push();
      this.uiPanels[i].transform();
      if (!this.uiPanels[i].hidden){
        this.uiPanels[i].draw();
      }
      pop();
    }
  }
}

class UIpanel{
  constructor(xside, yside){
    this.xside = xside;
    this.yside = yside;
    this.hidden = false;
    this.padding = 10;
  }
  draw(){
    
  }
  transform(){
    translate(cameraFocusX, cameraFocusY);
    translate(gsUnitWidth * this.xside / 2, gsUnitHeight * this.yside / 2);
    translate(this.padding * -this.xside, this.padding * -this.yside)
  }
}

class Chat extends UIpanel{
  constructor(){
    super(-1 ,-1);
  }
  draw(){
    noStroke();
    fill(0, 152);
    rect(0, 0, 300, 175);
  }
}