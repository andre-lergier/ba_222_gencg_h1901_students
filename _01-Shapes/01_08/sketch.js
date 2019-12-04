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
  direction: -1,
  velocity: 0.05,
  start: 100,
  layerSpeed: 0.5,
  noiseScale: 0.01,
  mountainsLength: 300,
  mountainsInterval: 5,
  moutainsLayer: 7,
  mountainsType: 2,
  mountainsNoiseInc: 0.01,
};

var colors = [
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

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(options, 'baseCorners').min(3).max(25).step(1);
  gui.add(options, 'nElements').min(2).max(30).step(1);
  gui.add(options, 'radius').min(10).max(1000).step(1);
  gui.add(options, 'opacity').min(0).max(50).step(0.2);
  gui.add(options, 'objects').min(1).max(50).step(1);
  gui.add(options, 'velocity').min(0).max(10).step(0.01);
  gui.add(options, 'moutainsLayer').min(1).max(50).step(1);
  gui.add(options, 'mountainsLength').min(1).max(width).step(1);
  gui.add(options, 'mountainsInterval').min(1).max(50).step(1);
  gui.add(options, 'mountainsType').min(1).max(3).step(1);
  gui.add(options, 'mountainsNoiseInc').min(0.0001).max(10).step(0.01);
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
 * @param length length of line
 * @param interval every x from with it draws a line / point
 * @param {1,2,3} type 1: draw with lines, 2: draw flächen, 3: draw with lines and floating bottom
 */
function generateMountainBackground(noiseScale, length, width, interval, type, layer, start){
  xOffset = Math.random(0);

  beginShape();

  if(type == 1 || type == 2){
    // vertex(0, height);
  }

  for (let x=0; x < width; x++) {
    // let noiseVal = noise((mouseX+x)*noiseScale, mouseY*noiseScale);
    let noiseVal = noise((xOffset+x)*noiseScale);
    let y = start*layer*options.layerSpeed+noiseVal*80;

    if(x % interval == 0 || x == width-1){
      if(type == 1 || type == 3){
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
      }else if(type == 2) {
        curveVertex(x,y);
      }
    }
  }

  if(type == 1 || type == 2){
    curveVertex(width, height);
    curveVertex(width, height);
    vertex(0, height);
    vertex(0, height);
    endShape(CLOSE);
  } else {
    endShape();
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
  console.log(density);
  pixelDensity(density);

  colorMode(HSB,100);
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


let drawCount = 0;
let noiseBaseX = [];
let noiseBaseY = [];
let noiseIncrement = 0.01;


for(let s=0; s<options.objectsMax; s++){
  noiseBaseX[s] = Math.random() * 10;
  noiseBaseY[s] = Math.random() * 10;
}

function draw() {
  background(0);

  for(let i = 1; i <= options.moutainsLayer; i++){
    stroke(100, 5, 100);
    noStroke();
    if(options.mountainsType == 2){
     fill(60, 33/(options.moutainsLayer - (i -1)), 72/(options.moutainsLayer - (i-1)));
     // fill(60, 33, 72);
     // fill(color(colors[(i-1)%options.moutainsLayer]));
    }
    let interval = options.mountainsInterval*i*5;
    let noiseInc = options.mountainsNoiseInc*i;
    options.start += options.velocity*options.direction;
    generateMountainBackground(noiseInc, height/3, width, interval, options.mountainsType, i, options.start);
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
  if (keyCode === 32) setup() // 32 = Space
  if (keyCode === 38) options.direction = 1; // 38 = ArrowUp
  if (keyCode === 40) options.direction = -1; // 40 = ArrowDown
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