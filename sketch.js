var rocketPos;
var rocketRot;
var rocketVel;
var jetOn;
var planetPos;
var stars;
var predictorOn;
var zoom;
var draggingZoom;
var speed;
var draggingSpeed;
var starsOn;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rocketPos = createVector(0, -215);
  rocketRot = 0;
  rocketVel = createVector(0, 0);
  jetOn = [false, false, false]
  planetPos = createVector(0, 0);
  stars = [];
  for(var i = 0; i < 1000; i++) {
    stars.push(createVector(random(-3 * width, 3 * width), random(-3 * height, 3 * height)));
  }
  predictorOn = false;
  zoom = 1;
  draggingZoom = false;
  speed = 1;
  draggingSpeed = false;
}

function draw() {
  background(0, 50, 150);
  push();
  translate((1 - zoom) * width / 2, (1 - zoom) * height / 2);
  scale(zoom);
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
    var apogee = rocketPos.copy();
    var perigee = rocketPos.copy();
    for(var i = 0; i < 10000; i++) {
      point(predictorPos.x, predictorPos.y);
      var gravityForce = p5.Vector.sub(planetPos, predictorPos);
      gravityForce.setMag(2800 / pow(gravityForce.mag(), 2));
      predictorVel.add(gravityForce);
      predictorPos.add(predictorVel);
      if(predictorPos.dist(planetPos) > apogee.dist(planetPos)) {
        apogee = predictorPos.copy();
      }
      if(predictorPos.dist(planetPos) < perigee.dist(planetPos)) {
        perigee = predictorPos.copy();
      }
      if(predictorPos.dist(planetPos) < 205 || (i > 10 && predictorPos.dist(rocketPos) < 1 && abs(predictorVel.heading() - rocketVel.heading() - PI) > 0.1)) {
        break;
      }
    }
    strokeWeight(20);
    if(apogee.dist(rocketPos) > 0.1) {
      point(apogee.x, apogee.y);
    }
    if(perigee.dist(rocketPos) > 0.1) {
      point(perigee.x, perigee.y);
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
    line(-5, 10, -7, 15);
  }
  if(jetOn[2]) {
    strokeWeight(5);
    stroke(255, 150, 50)
    line(5, 10, 7, 15);
  }
  noStroke();
  fill(255, 230, 200);
  triangle(-10, 10, 10, 10, 0, -20);
  pop();
  pop();
  noStroke();
  fill(255);
  textSize(25);
  text("RESTART (R)", 5, 25);
  if(predictorOn) {
    text("DISABLE FLIGHT GUIDE", 5, 50);
  } else {
    text("ENABLE FLIGHT GUIDE", 5, 50);
  }
  text("ZOOM: ", width - 325, 30);
  text("SPEED: ", width - 335, 70);
  strokeWeight(10);
  stroke(255);
  line(width - 210, 25, width - 10, 25);
  if(draggingZoom) {
    zoom = map(constrain(mouseX, width - 210, width - 10), width - 210, width - 10, 0.3, 2);
  }
  line(width - 210 + map(zoom, 0.3, 2, 0, 200), 10, width - 210 + map(zoom, 0.3, 2, 0, 200), 40);
  line(width - 210, 65, width - 10, 65);
  if(draggingSpeed) {
    speed = map(constrain(mouseX, width - 210, width - 10), width - 210, width - 10, 1, 10);
  }
  line(width - 210 + map(speed, 1, 10, 0, 200), 50, width - 210 + map(speed, 1, 10, 0, 200), 80);
  for(var i = 0; i < speed; i++) {
    if(jetOn[1]) {
      var jetForce = createVector(0, -0.066).rotate(rocketRot);
      rocketVel.add(jetForce);
    }
    if(jetOn[0] && !jetOn[1]) {
      var jetForce = createVector(0, -0.033).rotate(rocketRot + 0.4);
      rocketVel.add(jetForce);
    }
    if(jetOn[2] && !jetOn[1]) {
      var jetForce = createVector(0, -0.033).rotate(rocketRot - 0.4);
      rocketVel.add(jetForce);
    }
    var gravityForce = p5.Vector.sub(planetPos, rocketPos);
    gravityForce.setMag(2800 / pow(gravityForce.mag(), 2));
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
    jetOn = [false, false, false];
    planetPos = createVector(0, 0);
    zoom = 1;
    speed = 1;
  }
  if(key == "q" || key == "Q" && zoom < 2) {
    zoom += 0.1;
  }
  if(key == "w" || key == "W" && zoom > 0.4) {
    zoom -= 0.1;
  }
  if(key == "a" || key == "A") {
    speed += 1;
  }
  if(key == "s" || key == "S") {
    speed -= 1;
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
  if(mouseX < 150 && mouseY < 25) {
    rocketPos = createVector(0, -65);
    rocketRot = 0;
    rocketVel = createVector(0, 0);
    jetOn = [false, false, false];
    planetPos = createVector(0, 0);
    zoom = 1;
    speed = 1;
  }
  if(mouseX < 300 && mouseY < 50 && mouseY > 25) {
    predictorOn = !predictorOn;
  }
  if(mouseX > width - 215 + map(zoom, 0.3, 2, 0, 200) && mouseX <  width - 205 + map(zoom, 0.3, 2, 0, 200) && mouseY > 10 && mouseY < 40) {
    draggingZoom = true;
  }
  if(mouseX > width - 215 + map(speed, 1, 10, 0, 200) && mouseX <  width - 205 + map(speed, 1, 10, 0, 200) && mouseY > 50 && mouseY < 80) {
    draggingSpeed = true;
  }
} 

function mouseReleased() {
  draggingZoom = false;
  draggingSpeed = false;
}
