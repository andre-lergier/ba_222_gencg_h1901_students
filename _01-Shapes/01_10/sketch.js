// Global var
const capture = false;

var options = {
  opacity: 2,
  direction: 1,
  increase: 10,
  noiseScale: 0.005,
};

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

  if(capture) {
    canvasWidth = 6480 / density;
    canvasHeight = 3840 / density

    // Capture settings
    fps = 60;
    capturer = new CCapture({
      format: 'png',
      framerate: fps,
      verbose: true,
    });

    // this is optional, but lets us see how the animation will look in browser.
    frameRate(fps);

    // start the recording
    capturer.start();
  } else {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
  }

  // Canvas setup
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("p5Container");

  loop();
  background(0,0,0);

  startTime = millis();
  // noLoop();
}

function draw() {
  console.log('draw');
  background(0);
   /*fill(0,options.opacity);
  rect(0,0,width,height);*/

  // duration in seconds
  var rideDuration = 20;
  var t = (millis() - startTime)/1000;

  // if we have passed t=duration then end the animation.
  if(capture){
    if (t > rideDuration) {
      console.log('finished recording.');
      if(capture){
        noLoop();
        capturer.stop();
        capturer.save();
      }
      return;
    }
  }

  // const increase = 10;
  // const noiseScale = 0.005;
  /*for(let x = 1; x < width + increase; x+=increase){
    for(let y = 1; y < height + increase; y+=increase){
      let color = 255 * noise(x * noiseScale + millis(), y * noiseScale + millis());
      noStroke();
      fill(color);
      circle(x, y, increase);
    }
  }*/
  for (var x = 0; x < width; x+=options.increase) {
		for (var y = 0; y < height; y+=options.increase) {
      // var c = 255 * noise(options.noiseScale * x + millis()/10000 + mouseX/1000, options.noiseScale * y - millis()/10000 + mouseY/1000);
      var c = 255 * noise(options.noiseScale * x, options.noiseScale * y);
      noStroke();
			fill(c);
			rect(x, y, options.increase, options.increase);
		}		
  }

  if(capture){
    // handle saving the frame
    console.log('capturing frame');
    capturer.capture(document.getElementById('defaultCanvas0'));
  }
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
  gui.add(options, 'noiseScale').min(0.0001).max(1).step(0.001);
  gui.add(options, 'increase').min(1).max(100).step(1);g
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
