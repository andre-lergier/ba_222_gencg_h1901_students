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
}

function draw() {

}

function keyPressed() {

  if (keyCode === 32) setup() // 32 = Space
  if (keyCode === 38) direction = 'up' // 38 = ArrowUp
  if (keyCode === 40) direction = 'down' // 40 = ArrowDown
  if (keyCode >= 48 && keyCode <= 57) rideDuration = getRideDuration(toInt(key)) // 48...57 = Digits
  //
  if (key === 's' || key === 'S') saveThumb(650, 350);

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