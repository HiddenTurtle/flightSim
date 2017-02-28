var rocketPos;
var rocketRot;
var rocketVel;
var jetOn;
var planetPos;
var offGround;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rocketPos = createVector(width / 2, height / 2 - 70);
  rocketRot = 0;
  rocketVel = createVector(0, 0);
  jetOn = [false, false, false]
  planetPos = createVector(width / 2, height / 2);
  offGround = false;
}

function draw() {
  background(0, 50, 150);
  strokeWeight(10);
  stroke(125, 25, 25);
  fill(150, 50, 50);
  ellipse(planetPos.x, planetPos.y, 100, 100);
  push();
  translate(rocketPos.x, rocketPos.y);
  rotate(rocketRot);
  if(jetOn[1]) {
    strokeWeight(5);
    stroke(255, 150, 50)
    line(-5, 10, -8, 20);
    line(5, 10, 8, 20);
  }
  if(jetOn[0]) {
    strokeWeight(5);
    stroke(255, 150, 50)
    line(-5, 10, -8, 20);
  }
  if(jetOn[2]) {
    strokeWeight(5);
    stroke(255, 150, 50)
    line(5, 10, 8, 20);
  }
  noStroke();
  fill(255, 230, 200);
  triangle(-10, 10, 10, 10, 0, -20);
  pop();
  if(jetOn[1]) {
    var jetForce = createVector(0, -0.066).rotate(rocketRot);
    rocketVel.add(jetForce);
  }
  if(jetOn[0]) {
    var jetForce = createVector(0, -0.033).rotate(rocketRot + 0.4);
    rocketVel.add(jetForce);
  }
  if(jetOn[2]) {
    var jetForce = createVector(0, -0.033).rotate(rocketRot - 0.4);
    rocketVel.add(jetForce);
  }
  var gravityForce = p5.Vector.sub(planetPos, rocketPos);
  gravityForce.setMag(200 / pow(gravityForce.mag(), 2));
  rocketVel.add(gravityForce)
  rocketPos.add(rocketVel);
  if(rocketPos.dist(planetPos) < 65) {
    if(offGround) {
      rocketPos.set(10000, 10000);
    }
    rocketVel.set(0, 0);
    if(rocketPos.y < 240) {
      rocketPos.add(0, rocketPos.dist(planetPos) - 65);
    } else {
      rocketPos.add(0, 65 - rocketPos.dist(planetPos));
    }
  } else {
    offGround = true;
  }
  if(rocketPos.dist(planetPos) < 100) {
    console.log(rocketVel.heading() + HALF_PI);
    console.log(rocketVel);
  }
  if(rocketVel.mag() > 0.001) {
    rocketRot = rocketVel.heading() + HALF_PI;
  }
} 

function keyPressed() {
  if(keyCode == UP_ARROW) {
    jetOn[1] = true;
  }
  if(keyCode == LEFT_ARROW) {
    jetOn[0] = true;
  }
  if(keyCode == RIGHT_ARROW) {
    jetOn[2] = true;
  }
}

function keyReleased() {
  if(keyCode == UP_ARROW) {
    jetOn[1] = false;
  }
  if(keyCode == LEFT_ARROW) {
    jetOn[0] = false;
  }
  if(keyCode == RIGHT_ARROW) {
    jetOn[2] = false;
  }
}
