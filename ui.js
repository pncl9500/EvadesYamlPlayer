function initUI(){
  return new UI;
}
class UI{
  constructor(){
    this.uiPanels = [new UIpanel(-1, -1)];
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
  }
  draw(){
    fill(0);
    rect(0, 0, 120, 120);
  }
  transform(){
    translate(cameraFocusX, cameraFocusY);
    translate(gsUnitWidth * this.xside / 2, gsUnitHeight * this.yside / 2);
  }
}