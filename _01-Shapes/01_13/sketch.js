// Global var
/**
 * GUI
 */
var options = {
  opacity: 15, //19
  direction: -1,
  velocity: 0.04, // will be overriden by setup
  capture: false,
  elevator: false,
  objects: 200,
  maxObjects: 1000,
};

let gui;
let drawCount = 0;
let noiseBase = [];
let noiseBaseX = [];
let noiseBaseY = [];
let noiseScale = 0.02;
let points = [];
const possibleTypes = [2,3];
let capturer;
const fps = 60;
let timeCounter;
const rideDuration = 24;
const framesOverall = fps * rideDuration;

let rideDelta = 0;
let stepSize = 0;
let currentFrame = 1;

let colors = [
  '#2E3440',
  '#3B4252',
  '#434C5E',
  '#4C566A',
  '#D8DEE9',
  '#E5E9F0',
  '#ECEFF4',
];

colors = [
  '#EBF0F2',
  '#91C4D9',
  '#658DA6',
  '#376B8C',
  '#4C566A',
  '#3B4252',
  '#2E3440',
]

colors = [];

// color theme with hsluv
function generateColorTheme(){
  let h = floor(Math.random()*360);
  // let start = `hsb(${floor(Math.random()*360)}, 80%, 100%)`;
  // let to = `hsb(${floor(Math.random()*360)}, 80%, 20%)`;

  let from = colorHsluv(
    floor(Math.random()*180), floor(Math.random()*50) + 50, 50
  );

  let to = colorHsluv(
    floor(Math.random()*180) + 180, floor(Math.random()*50) + 50, 50
  );

  colors = [];
  colorMode(RGB);
  for(var i = 0; i < options.maxObjects; i++) {
    colors.push(
      lerpColor(from, to, 1/options.maxObjects * (i+1))
    );
  }
}

function getRandomColor(noiseXOffH, noiseXOffS, noiseXOffB){
  const noiseH = floor(noise(noiseXOffH) * 360);
  const noiseS = floor(noise(noiseXOffS) * 100);
  const noiseB = floor(noise(noiseXOffB) * 100);

  return colorHsluv(
    noiseH, noiseS, noiseB
  );

  // return color(floor(noise(noiseXOffH)*360), floor(noise(noiseXOffS)*factor), floor(noise(noiseXOffB)*factor));
  // return color(floor(noise(noiseXOffH)*360), floor(noise(noiseXOffS)*factor), floor(noise(noiseXOffB)*factor));
  return color(`hsb(${noiseH}, ${noiseS}%, ${noiseB}%)`)
}

function generateColorArray(){
  let noiseXOffH = Math.random() * 100;
  let noiseXOffS = Math.random() * 100;
  let noiseXOffB = Math.random() * 100;
  let noiseXInc = .05;

  for(let i=0; i < options.maxObjects; i++){
    noiseXOffH = noiseXOffH + (noiseXInc * 10); // for every color a bit higher
    noiseXOffS = noiseXOffS + noiseXInc;
    noiseXOffB = noiseXOffB + noiseXInc;
    colors[i] = getRandomColor(noiseXOffH, noiseXOffS, noiseXOffB);
  }
}


/**
 * 
 * SETUP / DRAW
 * 
 */
function setup() {
  let canvasWidth;
  let canvasHeight;

  var density = displayDensity();
  pixelDensity(density);

  if(options.capture) {
    canvasWidth = 6480 / density;
    canvasHeight = 3840 / density

    // Capture settings
    capturer = new CCapture({
      format: 'png',
      framerate: fps,
      verbose: true,
    });

    // start the recording
    capturer.start();
  } else {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
  }

  if(options.elevator || options.capture){
    frameRate(fps);
    canvasWidth = 6480 / density;
    canvasHeight = 3840 / density;

    options.velocity = 1.2;
  } else {
    options.velocity = 0.07;
  }

  // Canvas setup
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("p5Container");

  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  loop();

  generateColorTheme();
  background(0,0,0);

  // set initial values
  if(options.direction == -1){
    // down
    options.start = height/2;
    options.target = height/11;
    rideDelta = options.start - options.target;
    console.log('down');
  } else {
    // up
    options.start = height/9;
    options.target = height/2;
    rideDelta = options.target - options.start;
    console.log('up');
  }
  
  stepSize = rideDelta / framesOverall;
  // console.log(stepSize);

  const difference = options.start - options.target

  for(let i = 0; i < options.maxObjects; i++){
    noiseBaseX[i] = Math.random() * 10000;
    noiseBaseY[i] = Math.random() * 10000;
  }

  console.table(colors);

  timeCounter = 0;
  
  startTime = millis();
}

function draw() {
  // duration in seconds
  var t = (millis() - startTime)/1000;

  // if we have passed t=duration then end the animation.
  if (t > rideDuration) {
    console.log('finished recording.');

    if(options.capture) {
      noLoop();
      capturer.stop();
      capturer.save();
      return;
    }
  }

  // let stepFactor = animate(t, 0, stepSize / 5, rideDuration, 2.5); // value between 0 & 1

  //background(0);
  noStroke();
  fill(0,options.opacity);
  rect(0,0,width,height);/*

  stroke(255, 25);
  strokeWeight(2);
  noFill();
  /*
  var x1 = width * noise(t + 15);
  var x2 = width * noise(t + 25);
  var x3 = width * noise(t + 35);
  var x4 = width * noise(t + 45);
  var y1 = height * noise(t + 55);
  var y2 = height * noise(t + 65);
  var y3 = height * noise(t + 75);
  var y4 = height * noise(t + 85);

  bezier(x1, y1, x2, y2, x3, y3, x4, y4);

  timeCounter += 0.005;*/

  stroke(color(colors[currentFrame % options.maxObjects]));
  for(let i = 0; i < options.objects; i++){
    circle(width * noise((noiseBaseX[i])*noiseScale, millis()/4000),height * noise((noiseBaseY[i])*noiseScale, millis()/3000),20);
  }

  if(options.capture){
    // handle saving the frame
    console.log('capturing frame');
    capturer.capture(document.getElementById('defaultCanvas0'));
  }

  currentFrame++;
}


/**
 * global functions
 */
window.onload = function() {
  // this.initGUI();
};

function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
  if (key == 'c' || key == 'C') generateColorArray();
  if (key == 't' || key == 'T') generateColorTheme();
  if (key == 'd' || key == 'D') destroyGUI();
  if (key == 'g' || key == 'G') initGUI();

  if (keyCode === 32) setup() // 32 = Space
  if (keyCode === 38) options.direction = 1; // 38 = ArrowUp
  if (keyCode === 40) options.direction = -1; // 40 = ArrowDown
}

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

function boxedPolygons(x, y, elements, radius, baseCorners){
  for(let i=0; i < elements; i++){
    stroke(100, 0, 100);

    // calc radius for every polygon
    radiusFactor = (radius / elements) * i;
    radius = radius - radiusFactor;
    polygon(x,y,radius,baseCorners - i);
  }
}

/**
 * Tools
 */
function initGUI(){
  gui = new dat.GUI();
  gui.add(options, 'opacity').min(0).max(255).step(1);
  gui.add(options, 'velocity').min(0).max(0.1).step(0.005);
  gui.add(options, 'start').min(0).max(1000).step(10);
  gui.add(options, 'objects').min(1).max(1000).step(1);
}

function destroyGUI(){
  gui.destroy();
}

// Color functions
function fillHsluv(h, s, l) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  fill(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function strokeHsluv(h, s, l) {
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  stroke(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function colorHsluv(h, s, l) {
  console.log('generated!: ' + h, s, l);
  var rgb = hsluv.hsluvToRgb([h, s, l]);
  return color(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

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
