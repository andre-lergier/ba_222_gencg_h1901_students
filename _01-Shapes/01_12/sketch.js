// Global var
/**
 * GUI
 */
var options = {
  opacity: 255, //19
  direction: -1,
  velocity: 0.04, // will be overriden by setup
  start: 0, // will be overriden by setup
  layerSpeed: 0.2,
  mountainsLength: 100,
  mountainsInterval: 10,
  moutainsLayer: 12,
  mountainsLayerMax: 13,
  mountainsType: 3,
  mountainsNoiseInc: 0.01,
  capture: true,
  elevator: false,
};

let gui;
let drawCount = 0;
let noiseBaseX = [];
let noiseBaseY = [];
let noiseIncrement = 0.01;
let points = [];
const possibleTypes = [2,3];
let capturer;
const fps = 60;
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
    floor(Math.random()*180), 100, 50
  );

  let to = colorHsluv(
    floor(Math.random()*180) + 180, 100, 50
  );

  colors = [];
  colorMode(RGB);
  for(var i = 0; i < options.mountainsLayerMax; i++) {
    colors.push(
      lerpColor(from, to, 1/options.mountainsLayerMax * (i+1))
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

  for(let i=0; i < options.mountainsLayerMax; i++){
    noiseXOffH = noiseXOffH + (noiseXInc * 10); // for every color a bit higher
    noiseXOffS = noiseXOffS + noiseXInc;
    noiseXOffB = noiseXOffB + noiseXInc;
    colors[i] = getRandomColor(noiseXOffH, noiseXOffS, noiseXOffB);
  }
}

/**
 * function to generate mountain backgorund
 * @param noiseScale as bigger, to more bumpy the skyline will be
 * @param length length of line if type 2
 * @param amountOfPoints every x from with it draws a line / point
 * @param {1,2,3} type 1: draw with lines, 2: draw with lines and floating bottom, 3: draw flächen
 * @param layer number of current layer
 * @param start 
 */
function generateMountainBackground(noiseScale, length, width, amountOfPoints, type, layer, start){
  let canvasOffset = 25;
  let xOffset = 100;
  interval = floor(width / amountOfPoints);
  beginShape();

  for (let x=-canvasOffset; x < width + canvasOffset; x++) {
    // value from noise [0,1]
    let noiseVal = noise((xOffset+x)*noiseScale, millis()/8000); // let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    // options.layerSpeed = height/5000;
    let yComp = start*layer*options.layerSpeed; // move down start per layer
    let noiseFactor = height/7.5; //120
    let y = yComp + noiseVal*noiseFactor;

    // draw point if first, if in interval or if last
    if(x == -canvasOffset || x % interval == 0 || x == width+canvasOffset-1){
      if(type == 1 || type == 2){

        curveVertex(x, y)

        if(type == 1){
          line(x, y, x, height);
        } else {
          line(x, y, x, y + length);
        }
      }else if(type == 3) {
        curveVertex(x,y);
        /*
        points.push(createVector(x,y));
        
        strokeWeight(5); // Make the points 10 pixels in size
        point(x, y);
        strokeWeight(1);*/
      }
    }
  }

  /**
   * points bottom right, bottom left
   */
  if(type == 1 || type == 3){
    let offset = 10;
    curveVertex(width + offset, height + offset); // bottom right
    curveVertex(width + offset, height + offset);
    vertex(0 - offset, height + offset); // bottom left
    vertex(0 - offset, height + offset);
    endShape(CLOSE);
  } else {
    endShape();
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

    console.log(capturer);

    // this is optional, but lets us see how the animation will look in browser.
    frameRate(fps);

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
  console.log(stepSize);

  const difference = options.start - options.target

  for(let s=0; s<options.objectsMax; s++){
    noiseBaseX[s] = Math.random() * 10;
    noiseBaseY[s] = Math.random() * 10;
  }
  
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

  //background(0);
  fill(0,options.opacity);
  rect(0,0,width,height);

  // generate layers
  for(let i = 1; i <= options.moutainsLayer; i++){
    stroke(255);
    if(options.elevator || options.capture){
      strokeWeight(3);
    }
    if(options.mountainsType == 3){
     fill(color(colors[i]));
    }

    /**
     * variables for moutain background - different per layer
     * start is different per line
     */
    let noiseInc = options.mountainsNoiseInc*i; // increase noise inc every layer
    let lineHeight = height/3;
    let amountOfPoints = floor(options.mountainsInterval*(i/2)); // make bigger stepps every layer
    let stepFactor = animate(t, 0, stepSize / 3, rideDuration, 2.5); // value between 0 & 1
    let step = options.direction * stepFactor;
    options.start += step;
    console.log('step: ' + step);
    //options.start += options.velocity*options.direction*stepFactor;
    // options.start = height/10;

    generateMountainBackground(noiseInc, lineHeight, width, amountOfPoints, options.mountainsType, i, options.start);
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
  gui.add(options, 'moutainsLayer').min(1).max(30).step(1);
  gui.add(options, 'mountainsLength').min(1).max(width).step(1);
  gui.add(options, 'mountainsInterval').min(1).max(100).step(1);
  gui.add(options, 'mountainsType').min(1).max(3).step(1);
  gui.add(options, 'mountainsNoiseInc').min(0.0001).max(10).step(0.01);
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
