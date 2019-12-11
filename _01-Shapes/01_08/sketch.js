// Global var
/**
 * GUI
 */
var options = {
  baseCorners: 14,
  nElements: 10,
  radius: 12,
  radiusMax: 1000,
  opacity: 0,
  changeColor: true,
  objects: 10,
  objectsMax: 50,
  noiseInc: 0.1,
  noiseScale: 0.01,

  direction: -1,
  velocity: 0.05,
  start: 100,
  layerSpeed: 0.5,
  mountainsLength: 300,
  mountainsInterval: 5,
  moutainsLayer: 7,
  mountainsLayerMax: 30,
  mountainsType: 2,
  mountainsNoiseInc: 0.01,
};

let gui;
let drawCount = 0;
let noiseBaseX = [];
let noiseBaseY = [];
let noiseIncrement = 0.01;
let points = [];

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
for(var i = 0; i < options.mountainsLayerMax; i++) {
  colors.push(
    `hsb(240, 80%, ${100/options.mountainsLayerMax * (i + 1)}%)`
  )
}

window.onload = function() {
  this.initGUI();
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

function boxedPolygons(x, y, elements, radius, baseCorners){
  for(let i=0; i < elements; i++){
    stroke(100, 0, 100);

    // calc radius for every polygon
    radiusFactor = (radius / elements) * i;
    radius = radius - radiusFactor;
    polygon(x,y,radius,baseCorners - i);
  }
}

function getRandomColor(noiseXOffH, noiseXOffS, noiseXOffB){
  const floor = Math.floor; //number [0,1]
  const random = Math.random; //number [0,1]
  const factor = 100;

  return color(floor(noise(noiseXOffH)*360), floor(noise(noiseXOffS)*factor), floor(noise(noiseXOffB)*factor));
}

function generateColorArray(){
  let noiseXOffH = Math.random();
  let noiseXOffS = Math.random();
  let noiseXOffB = Math.random();
  let noiseXInc = .01;

  for(let i=0; i < 30; i++){
    noiseXOffH = noiseXOffH + 3;
    noiseXOffS = noiseXOffS + noiseXInc;
    noiseXOffB = noiseXOffB + noiseXInc;
    colors[i] = getRandomColor(noiseXOffH, noiseXOffS, noiseXOffB);
  }
}

/**
 * function to generate mountain backgorund
 * @param noiseScale as bigger, to more bumpy the skyline will be
 * @param length length of line if type 2
 * @param interval every x from with it draws a line / point
 * @param {1,2,3} type 1: draw with lines, 2: draw with lines and floating bottom, 3: draw flächen
 * @param layer number of current layer
 * @param start 
 */
function generateMountainBackground(noiseScale, length, width, interval, type, layer, start){
  let canvasOffset = 25;
  let xOffset = 1;
  beginShape();

  for (let x=-canvasOffset; x < width + canvasOffset; x++) {
    // value from noise [0,1]
    let noiseVal = noise((xOffset+x)*noiseScale, millis()/7000); // let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    let yComp = start*layer*options.layerSpeed;
    let noiseFactor = 80;
    let y = yComp + noiseVal*noiseFactor;

    // draw point if first, if in interval or if last
    if(x == -canvasOffset || x % interval == 0 || x == width+canvasOffset-1){
      if(type == 1 || type == 2){
        /**
         * draw line
         * (from top to bottom --> invert with height - length)
         */
        // line(x, mouseY+noiseVal*80, x, height);
        // stroke(100, 0, 100);y)

        curveVertex(x, y)

        if(type == 1){
          line(x, y, x, height);
        } else {
          line(x, y, x, y + length);
        }
      }else if(type == 3) {
        curveVertex(x,y);

        points.push(createVector(x,y));
        
        strokeWeight(5); // Make the points 10 pixels in size
        point(x, y);
        strokeWeight(1)

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
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");

  // Detect screen density (retina)
  var density = displayDensity();
  console.log(density);
  pixelDensity(density);

  // colorMode(HSB,100);
  background(0,0,0);

  /**
   * generate colorsArray
   */
  // generateColorArray();


  // set initial values
  if(options.direction == -1){
    options.start = height/2;
  }else {
    options.start = height/6;
  }
  options.velocity = height/20000;
}


for(let s=0; s<options.objectsMax; s++){
  noiseBaseX[s] = Math.random() * 10;
  noiseBaseY[s] = Math.random() * 10;
}

function draw() {
  background(0);
  fill(0,options.opacity);
  rect(0,0,width,height);

  // generate layers
  for(let i = 1; i <= options.moutainsLayer; i++){
    stroke(255);
    if(options.mountainsType == 3){
     fill(color(colors[i]));
    }

    /**
     * variables for moutain background - different per layer
     * start is different per line
     */
    let noiseInc = options.mountainsNoiseInc*i;
    let lineHeight = height/3;
    let interval = options.mountainsInterval*i*5;
    options.start += options.velocity*options.direction;
    generateMountainBackground(noiseInc, lineHeight, width, interval, options.mountainsType, i, options.start);
  }
  

  // overlay rectangle to fake fade out
  noStroke();
  fill(0,options.opacity);
  rect(0,0,width,height);

  // options.radius = ((options.radius < options.radiusMax) ? options.radius *1.01 : options.radius *1.01*(-1));

  for(let j=0; j < options.objects; j++){
    //noiseBaseX[j] += noiseIncrement;
    //noiseBaseY[j] += noiseIncrement;

    noiseX = noise(noiseBaseX[j]);
    noiseY = noise(noiseBaseY[j]);

    let x = noiseX * windowWidth;
    let y = noiseY * windowHeight;

    // boxedPolygons(x,y,options.nElements, options.radius, options.baseCorners);
  }

  drawCount++;
}


/**
 * global functions
 */
function keyPressed() {
  if (key == 's' || key == 'S') saveThumb(650, 350);
  if (key == 'c' || key == 'C') generateColorArray();
  if (key == 'd' || key == 'D') destroyGUI();
  if (key == 'g' || key == 'G') initGUI();
  if (keyCode === 32) setup() // 32 = Space
  if (keyCode === 38) options.direction = 1; // 38 = ArrowUp
  if (keyCode === 40) options.direction = -1; // 40 = ArrowDown
}

/**
 * Tools
 */
function initGUI(){
  gui = new dat.GUI();
  gui.add(options, 'baseCorners').min(3).max(25).step(1);
  gui.add(options, 'nElements').min(2).max(30).step(1);
  gui.add(options, 'radius').min(10).max(1000).step(1);
  gui.add(options, 'opacity').min(0).max(50).step(0.2);
  gui.add(options, 'objects').min(1).max(50).step(1);
  gui.add(options, 'velocity').min(0).max(0.1).step(0.005);
  gui.add(options, 'start').min(0).max(1000).step(10);
  gui.add(options, 'moutainsLayer').min(1).max(30).step(1);
  gui.add(options, 'mountainsLength').min(1).max(width).step(1);
  gui.add(options, 'mountainsInterval').min(1).max(50).step(1);
  gui.add(options, 'mountainsType').min(1).max(3).step(1);
  gui.add(options, 'mountainsNoiseInc').min(0.0001).max(10).step(0.01);
  gui.add(options, 'changeColor');
}

function destroyGUI(){
  gui.destroy();
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