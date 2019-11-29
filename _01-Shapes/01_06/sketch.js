// Global var
/**
 * GUI
 */
var options = {
  baseCorners: 14,
  nElements: 10,
  radius: 12,
  opacity: 0,
  changeColor: true,
};

var colors = [];

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(options, 'baseCorners').min(3).max(25).step(1);
  gui.add(options, 'nElements').min(2).max(30).step(1);
  gui.add(options, 'radius').min(10).max(1000).step(1);
  gui.add(options, 'opacity').min(0).max(50).step(0.2);
  gui.add(options, 'changeColor');
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


let noiseXOffH = Math.random();
let noiseXOffS = Math.random();
let noiseXOffB = Math.random();
let noiseXInc = .01;
function getRandomColor(){
  const floor = Math.floor; //number [0,1]
  const random = Math.random; //number [0,1]
  const factor = 100;
  noiseXOffH = noiseXOffH + 0.1;
  noiseXOffS = noiseXOffS + noiseXInc;
  noiseXOffB = noiseXOffB + noiseXInc;
  // return color(floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor), floor(noise(noiseXOff)*factor))
  return color(floor(noise(noiseXOffH)*factor), floor(noise(noiseXOffS)*factor), floor(noise(noiseXOffB)*factor));
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

  colorMode(HSB,100);
  background(0,0,0);

  /**
   * generate colorsArray
   */
  generateColorArray();
}


let drawCount = 0;
let snakes = 5;
let noiseBaseX = [];
let noiseBaseY = [];
let noiseIncrement = 0.01;

for(let s=0; s<snakes; s++){
  noiseBaseX[s] = Math.random() * 10;
  noiseBaseY[s] = Math.random() * 10;
}

function draw() {
  if(options.changeColor){
    if(drawCount%50 == 0){
      generateColorArray();
    }
  }
  // generateColorArray()
  noStroke();
  fill(0,options.opacity);
  rect(0,0,width,height);

  for(let j=0; j < snakes; j++){
    noiseBaseX[j] += noiseIncrement;
    noiseBaseY[j] += noiseIncrement;

    for(let i=0; i < options.nElements; i++){
      fill(colors[i]);
      radiusFactor = (options.radius / options.nElements) * i;
      radius = options.radius - radiusFactor;
      polygon((noise(noiseBaseX[j]) * windowWidth),(noise(noiseBaseY[j]) * windowHeight),radius,options.baseCorners - i);
    }
  }

  drawCount++;
}


/**
 * global functions
 */
function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
  if (key == 'c' || key == 'C') generateColorArray();
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