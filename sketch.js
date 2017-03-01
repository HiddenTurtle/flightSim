var rocketPos;
var rocketRot;
var rocketVel;
var jetOn;
var planetPos;
var stars;
var predictorOn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rocketPos = createVector(0, -215);
  rocketRot = 0;
  rocketVel = createVector(0, 0);
  jetOn = [false, false, false]
  planetPos = createVector(0, 0);
  stars = [];
  for(var i = 0; i < 2000; i++) {
    stars.push(createVector(random(-2 * width, 2 * width), random(-2 * height, 2 * height)));
  }
  predictorOn = false;
}

function draw() {
  background(0, 50, 150);
  noStroke();
  fill(255);
  textSize(25);
  text("RESTART", 5, 25);
  if(predictorOn) {
    text("DISABLE FLIGHT GUIDE", 5, 50);
  } else {
    text("ENABLE FLIGHT GUIDE", 5, 50);
  }
  text("")
  push();
  translate(width / 2 - rocketPos.x, height / 2 - rocketPos.y);
  strokeWeight(10);
  stroke(125, 25, 25);
  fill(150, 50, 50);
  ellipse(planetPos.x, planetPos.y, 400, 400);
  strokeWeight(3);
  stroke(255);
  for(var i = 0; i < stars.length; i++) {
    if(dist(stars[i].x, stars[i].y, 0, 0) > 215) {
      point(stars[i].x, stars[i].y);
    }
  }
  if(predictorOn) {
    stroke(0, 255, 0);
    var predictorPos = rocketPos.copy();
    var predictorVel = rocketVel.copy();
    for(var i = 0; i < 10000; i++) {
      point(predictorPos.x, predictorPos.y);
      var gravityForce = p5.Vector.sub(planetPos, predictorPos);
      gravityForce.setMag(2000 / pow(gravityForce.mag(), 2));
      predictorVel.add(gravityForce);
      predictorPos.add(predictorVel);
      if(predictorPos.dist(planetPos) < 205 || (i > 10 && predictorPos.dist(rocketPos) < 1)) {
        break;
      }
    }
  }
  pop();
  push();
  translate(width / 2, height / 2);
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
  gravityForce.setMag(2000 / pow(gravityForce.mag(), 2));
  rocketVel.add(gravityForce);
  rocketPos.add(rocketVel);
  if(rocketPos.dist(planetPos) < 215) {
    rocketVel.set(0, 0);
    if(rocketPos.y < 0) {
      rocketPos.add(0, rocketPos.dist(planetPos) - 215);
    } else {
      rocketPos.add(0, 215 - rocketPos.dist(planetPos));
    }
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
  if(key == "r" || key == "R") {
    rocketPos = createVector(0, -65);
    rocketRot = 0;
    rocketVel = createVector(0, 0);
    jetOn = [false, false, false]
    planetPos = createVector(0, 0);
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

function mousePressed() {
  if(mouseX < 100 && mouseY < 25) {
    rocketPos = createVector(0, -65);
    rocketRot = 0;
    rocketVel = createVector(0, 0);
    jetOn = [false, false, false]
    planetPos = createVector(0, 0);
  } else if(mouseX < 300 && mouseY < 50) {
    predictorOn = !predictorOn;
  }
}
