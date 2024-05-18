class CheatMenuItem{
  constructor(height, width){
    this.height = height;
    this.width = width;
  }
  draw(offset){

  }
  behavior(offset){

  }
}

class CheatMenuText extends CheatMenuItem{
  constructor(text, height){
    super(height, 0);
    textSize(height);
    this.width = textWidth(text);
    this.text = text;
  }
  draw(offset){
    noStroke();
    textSize(this.height);
    fill(255);
    text(this.text, 0, offset);
  }
}

class CheatMenuLine extends CheatMenuItem{
  constructor(){
    super(2, cheatMenuWidth - cheatMenuLeftPadding * 2);
  }
  draw(offset){
    stroke(255);
    strokeWeight(2);
    line(0, offset, cheatMenuWidth - cheatMenuLeftPadding * 2, offset);
  }
}

class CheatMenuButton extends CheatMenuItem{
  constructor(text, width, height, func, tooltip){
    super(height, width);
    this.text = text;
    this.width = width;
    if (width === null){
      textSize(this.height - cheatMenuButtonPadding * 2);
      this.width = textWidth(this.text) + cheatMenuButtonPadding * 2 + 1;
    }
    this.func = func;
    this.tooltip = tooltip;
    this.color = {r: 255, g: 255, b: 255};
    this.hoverColor = {r: 125, g: 125, b: 125};
    this.textColor = {r: 0, g: 0, b: 0};
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return ptRect(relMouseX, relMouseY, 0, offset, this.width, this.height);
  }
  draw(offset){
    noStroke();
    fill(this.color.r, this.color.g, this.color.b);
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(this.hoverColor.r, this.hoverColor.g, this.hoverColor.b);
      if (mouseReleasedLastFrame){
        this.func();
      }
    }
    rect(0, offset, this.width, this.height);
    textSize(this.height - cheatMenuButtonPadding * 2);
    fill(this.textColor.r, this.textColor.g, this.textColor.b);
    textAlign(LEFT, CENTER);
    text(this.text, cheatMenuButtonPadding, offset + this.height / 2 + 0.5);
    textAlign(LEFT, TOP);
    if (this.tooltip !== undefined && this.hoveredByMouse(relMouseX, relMouseY, offset)){
      tooltipToRender = this.tooltip;
    }
  }
}

class CheatMenuRow extends CheatMenuItem{
  constructor(items){
    super(0);
    this.items = items;
    let greatestHeight = 0;
    let width = 0;
    for (var i in items){
      if (items[i].height > greatestHeight){
        greatestHeight = items[i].height;
        width += items[i].width;
        width += cheatMenuRowItemPadding;
      }
    }
    this.height = greatestHeight;
  }
  draw(offset){
    push();
    let initialRelMouseX = relMouseX;
    for (var i in this.items){
      this.items[i].draw(offset);
      this.items[i].behavior();
      translate(this.items[i].width + cheatMenuRowItemPadding, 0)
      relMouseX -= this.items[i].width + cheatMenuRowItemPadding;
    }
    relMouseX = initialRelMouseX;
    pop();
  }
}

class CheatMenuToggle extends CheatMenuItem{
  constructor(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip){
    super(height, width);
    this.toggled = toggled;
    this.onFunc = onFunc;
    this.offFunc = offFunc;
    this.toggleBoxPadding = 2;
    this.getStateFunc = getStateFunc;
    this.tooltip = tooltip;
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return ptRect(relMouseX, relMouseY, 0, offset, this.width, this.height);
  }
  draw(offset){
    if (this.getStateFunc !== undefined){
      this.toggled = this.getStateFunc();
    }
    stroke(255);
    strokeWeight(1);
    noFill();
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(255, 100);
      if (mouseReleasedLastFrame){
        if (this.toggled){
          this.toggled = false;
          this.offFunc();
        } else {
          this.toggled = true;
          this.onFunc();
        }
      }
    }
    rect(0, offset, this.width, this.height);
    if (this.toggled){
      fill(255);
      noStroke();
      rect(0 + this.toggleBoxPadding, offset + this.toggleBoxPadding, this.width - this.toggleBoxPadding * 2 - 0.40, this.height - this.toggleBoxPadding * 2 - 0.40);
    }
    if (this.tooltip !== undefined && this.hoveredByMouse(relMouseX, relMouseY, offset)){
      tooltipToRender = this.tooltip;
    }
  }
}

class CheatMenuSlider extends CheatMenuItem{
  constructor(min, max, width, setFunc, getFunc, step, downOffset = 6){
    super(2, width);
    this.min = min;
    this.max = max;
    this.setFunc = setFunc;
    this.getFunc = getFunc;
    this.step = step;
    this.circleRadius = 4;
    let val = this.getFunc();
    let t = (val - this.min) / (this.max - this.min);
    this.circleX = map(t, 0, 1, 0, this.width);
    this.downOffset = downOffset;
    this.lockedToMouse = false;
  }
  hoveredByMouse(relMouseX, relMouseY, offset){
    return circleCircle({x: relMouseX, y: relMouseY, r: 1}, {x: this.circleRadius + this.circleX, y: offset + this.downOffset, r: this.circleRadius});
  }
  draw(offset){
    stroke(255);
    strokeWeight(1);
    line(this.circleRadius, offset + this.downOffset, this.width, offset + this.downOffset);
    fill(0);
    if (this.hoveredByMouse(relMouseX, relMouseY, offset)){
      fill(100);
    }
    ellipse(this.circleRadius + this.circleX, offset + this.downOffset, this.circleRadius);

    if (this.hoveredByMouse(relMouseX, relMouseY, offset) && mouseIsPressed){
      this.lockedToMouse = true;
    }
    if (!mouseIsPressed){
      this.lockedToMouse = false;
    }
    
    let currentVal = this.getFunc();
    this.circleX = map(currentVal, this.min, this.max, 0, this.width);


    if (this.lockedToMouse){
      this.circleX = relMouseX - this.circleRadius;
      this.circleX = min(max(this.circleX, 0), this.width)
    }
    let xtoVal = map(this.circleX, 0, this.width, this.min, this.max);
    if (this.step !== 0){
      xtoVal = (round(xtoVal / this.step)) * this.step;
    }
    this.circleX = map(xtoVal, this.min, this.max, 0, this.width);
    this.setFunc(xtoVal);
  }
}

class CheatMenuPadding extends CheatMenuItem{
  constructor(width, height){
    super(height, width);
  }
}

function bigLine(){
  return new CheatMenuLine();
}
function txt(text, height){
  return new CheatMenuText(text, height);
}

function btn(text, width, height, func, tooltip){
  return new CheatMenuButton(text, width, height, func, tooltip);
}

function row(items){
  return new CheatMenuRow(items);
}

function tog(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip){
  return new CheatMenuToggle(width, height, toggled, onFunc, offFunc, getStateFunc, tooltip);
}
function sld(min, max, width, setFunc, getFunc, step, downOffset = 6){
  return new CheatMenuSlider(min, max, width, setFunc, getFunc, step, downOffset);
}
function pdd(width, height){
  return new CheatMenuPadding(width, height);
}