//only use with circle entities
function circleRect(c, r){
  // temporary variables to set edges for testing
  cx = c.x;
  cy = c.y;
  radius = c.radius;
  testX = cx;
  testY = cy;
  rx = r.x;
  ry = r.y;
  rw = r.width;
  rh = r.height;

  // which edge is closest?
  if (cx < rx)         testX = rx;      // test left edge
  else if (cx > rx+rw) testX = rx+rw;   // right edge
  if (cy < ry)         testY = ry;      // top edge
  else if (cy > ry+rh) testY = ry+rh;   // bottom edge

  // get distance from closest edges
  distX = cx-testX;
  distY = cy-testY;
  distance = sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}
function rectRect(r1, r2){
  return r1.x + r1.width >= r2.x &&    
         r1.x <= r2.x + r2.width &&    
         r1.y + r1.height >= r2.y &&    
         r1.y <= r2.y + r2.height;
}
function circleCircle(c1, c2){
  let dist = sqrt((c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y));
  let r1;
  let r2;
  try {
    r1 = c1.getRadius();
  } catch (error) {
    r1 = c1.r;
  }
  try {
    r2 = c2.getRadius();
  } catch (error) {
    r2 = c2.r;
  }
  if (settings.squareMode){
    return rectRect({x: c1.x - r1, y: c1.y - r1, width: r1 * 2, height: r1 * 2}, {x: c2.x - r2, y: c2.y - r2, width: r2 * 2, height: r2 * 2})
  }
  return dist < r1 + r2;
}


function hexToRgb(hex) {
  if (hex.length === 9){
    return hexToRgba(hex);
  }
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function hexToRgba(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: parseInt(result[4], 16),
  } : null;
}

//cosine... if it was a SQUARE (inaccurate but we just use it for ability wheel rendering so its acceptable)
function sqcos(ang){
  let mul = (abs(cos(ang)) + abs(sin(ang)));
  return constrain(cos(ang) * mul, -1, 1);
}

//sine... if it was a SQUARE (inaccurate but we just use it for ability wheel rendering so its acceptable)
function sqsin(ang){
  let mul = (abs(cos(ang)) + abs(sin(ang)));
  return constrain(sin(ang) * mul, -1, 1);
}

// function sq(x){
//   return x * x;
// }

function dst(e1, e2){
  return sqrt(sq(e2.x - e1.x) + sq(e2.y - e1.y));
}






function lineCircle(line, circle) {
  let x1 = line.x1;
  let x2 = line.x2;
  let y1 = line.y1;
  let y2 = line.y2;
  let cx = circle.x;
  let cy = circle.y;
  let r;
  try {
    r = circle.getRadius();
  } catch (error) {
    r = circle.r;
  }
  
  // is either end INSIDE the circle?
  // if so, return true immediately
  let inside1 = pointCircle(x1,y1, cx,cy,r);
  let inside2 = pointCircle(x2,y2, cx,cy,r);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = x1 - x2;
  let distY = y1 - y2;
  let len = sqrt( (distX*distX) + (distY*distY) );

  // get dot product of the line and circle
  let dot = ( ((cx-x1)*(x2-x1)) + ((cy-y1)*(y2-y1)) ) / Math.pow(len,2);

  // find the closest point on the line
  let closestX = x1 + (dot * (x2-x1));
  let closestY = y1 + (dot * (y2-y1));

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  let onSegment = linePoint(x1,y1,x2,y2, closestX,closestY);
  if (!onSegment) return false;

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  let distance = sqrt( (distX*distX) + (distY*distY) );

  if (distance <= r) {
    return true;
  }
  return false;
}


// POINT/CIRCLE
function pointCircle(px, py, cx, cy, r) {

  // get distance between the point and circle's center
  // using the Pythagorean Theorem
  let distX = px - cx;
  let distY = py - cy;
  let distance = sqrt( (distX*distX) + (distY*distY) );

  // if the distance is less than the circle's
  // radius the point is inside!
  if (distance <= r) {
    return true;
  }
  return false;
}


// LINE/POINT
function linePoint(x1, y1, x2, y2, px, py) {

  // get distance from the point to the two ends of the line
  let d1 = dist(px,py, x1,y1);
  let d2 = dist(px,py, x2,y2);

  // get the length of the line
  let lineLen = dist(x1,y1, x2,y2);

  // since floats are so minutely accurate, add
  // a little buffer zone that will give collision
  let buffer = 0.01;    // higher # = less accurate

  // if the two distances are equal to the line's
  // length, the point is on the line!
  // note we use the buffer here to give a range,
  // rather than one #
  if (d1+d2 >= lineLen-buffer && d1+d2 <= lineLen+buffer) {
    return true;
  }
  return false;
}