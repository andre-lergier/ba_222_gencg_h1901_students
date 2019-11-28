// Global var
 
function setup() {
  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity();
  pixelDensity(density);

  colorMode(HSB, 1); // sets hsb as color range with max at 100
  background(1,0,.8);
  stroke(.5,1,1);
}

// let width = windowWidth;
// let height = windowHeight;
let time = 0;
let speed = 0.01;

/* will be called allways when the browser is able to draw */
function draw (){
  //fill(000);
  //rect(0,0,width,height);
  time = time + speed;
  
  let x = time%width;
  let y = time%height;
  
  x = random(0, width);
  y = random(0, height);
  
  // x = mouse.x;
  
  stroke(1, noise(time),1);
  fill(255);
  circle(noise(time) * width,noise(time/2)*height,noise(time) * 300);
   /*
  for(let i = 0; i <= height; i++){
    line(noise(time)*width,i,noise(i)*width,noise(time)*height);
  }*/
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