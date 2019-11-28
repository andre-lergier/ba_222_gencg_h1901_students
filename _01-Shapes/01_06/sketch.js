// Global var
/**
 * GUI
 */
var options = {
  baseCorners: 14,
  nElements: 10,
  radius: 40,
};

var colors = [];

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(options, 'baseCorners').min(3).max(25).step(1);
  gui.add(options, 'nElements').min(2).max(30).step(1);
  gui.add(options, 'radius').min(10).max(1000).step(1);
};

function polygon(pX, pY, radius, ncorners) {
  angle = TWO_PI / ncorners; // kreis / anzahl ecken

  beginShape();
  for(i = 0; i<=ncorners; i++) {
    let x = radius * cos(angle * i) + pX;
    let y = radius * sin(angle * i) + pY;
    vertex(x,y);
  }

  endShape(CLOSE);
}


let noiseXOff = 0;
let noiseXInc = 5;
function getRandomColor(){
  const floor = Math.floor;
  const random = Math.random; //number [0,1]
  const factor = 100;
  noiseXOff = noiseXOff + noiseXInc;
  // return color(floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor))
  return color(floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor));
}

function generateColorArray(){
  for(let i=0; i < 30; i++){
    colors[i] = getRandomColor();
  }
}

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

  colorMode(HSB, 100);

  /**
   * generate colorsArray
   */
  generateColorArray();
}

let noiseBaseX = 0;
let noiseBaseY = 10;

function draw() {
  noStroke();
  fill(0,5);
  rect(0,0,width,height);

  noiseBaseY += 0.01;
  noiseBaseX += 0.01;

  for(let i=0; i < options.nElements; i++){
    fill(colors[i]);
    radiusFactor = (options.radius / options.nElements) * i;
    radius = options.radius - radiusFactor;
    polygon(floor(noise(noiseBaseX) * windowWidth),floor(noise(noiseBaseY) * windowHeight),radius,options.baseCorners - i);
  }
}


/**
 * global functions
 */
function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
}

/**
 * Tools
 */

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