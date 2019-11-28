// Global var
/**
 * GUI
 */
var options = {
  actRandomSeed: 0,
  tileCount: 20,
  bgAlpha: 255, 
  circleLineColor: 255, 
  circleFillColor: [255, 120, 0], //RGB   
  circleLineAlpha: 50,
  fill: false,
};

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(options, 'actRandomSeed');
  gui.add(options, 'tileCount').min(1).max(100).step(1);
  gui.add(options, 'bgAlpha').min(0).max(255).step(.5);
  gui.add(options, 'circleLineColor').min(0).max(255).step(1);
  gui.add(options, 'circleLineAlpha').min(0).max(255).step(.5);
  gui.add(options, 'fill');
  gui.addColor(options, 'circleFillColor');
};

/**
 * P5
 */
function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);
  
  background(200,200,200);
}

let time = 0;
let speed = 5;

/* will be called allways when the browser is able to draw */
function draw (){
  // clear();
  //background(200,200,200);
  
  // increase time with loop
  time = time + speed;
  
  let x = time%width;
  let y = time%height;
  
  x = random(0, width);
  y = random(0, height);
  
  // noStroke();
  circle(x,y,50);
}

function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
}

// Tools

// resize canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, false);
}

// Int conversion
function toInt(value) {
  return ~~value;
}

// Timestamp
function timestamp() {
  return Date.now();
}

// Thumb
function saveThumb(w, h) {
  let img = get( width/2-w/2, height/2-h/2, w, h);
  save(img,'thumb.jpg');
}