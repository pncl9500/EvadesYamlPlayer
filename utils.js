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