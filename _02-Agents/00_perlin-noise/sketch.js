var type;
var options ={  
  Background : '#0a0a0a',
  Color1 : '#ffffff',
  Color2 : '#0799f2',
  Color3 : '#45217c',
  Length : 10,
  Nums : 400,
  Size : 2,
  noiseScale: 800,
  ColorMode : 'Normal',
  Random: function () { 
    var Length = random(1,50); 
    LengthControl.setValue(Length);

    var Nums = random(200,1000); 
    NumsControl.setValue(Nums);

    var noiseScale = random(200,4000); 
    noiseControl.setValue(noiseScale);

    var Size= random(1,4); 
    SizeControl.setValue(Size);

    var Cmode = random(['Normal','Linera Gradient','Splice']);
    ColorControl.setValue(Cmode);

    setup();
  },

  Save : function(){
    saveFrames("Perlin-Noise", "png", 1, 1);
  },
}


var text, gui, config,bgcolorControl,color1Control,color2Control,noiseControl,LengthControl,NumsControl,SaveControl,RandomControl,SaveControl, ColorControl;
window.onload = function() {
  document.getElementById('defaultCanvas0').onmousedown = function(e) {
      if(typeof e.preventDefault === 'function') {
        e.preventDefault();
        e.stopPropagation();
      }else {
        e.returnValue = false;
        e.cancelBubble = true;
      }
    }
    gui = new dat.GUI();

  //folder1
  var folder1 = gui.addFolder('Controls');

  bgcolorControl = folder1.addColor(options, 'Background');
  bgcolorControl.onChange(draw);

  ColorControl = folder1.add(options, 'ColorMode', ['Normal','Linera Gradient','Radial Gradient','Splice'] );

  color1Control = folder1.addColor(options, 'Color1');
  color1Control.onChange(draw);

  color2Control = folder1.addColor(options, 'Color2');
  color2Control.onChange(draw);

  color2Control = folder1.addColor(options, 'Color3');
  color2Control.onChange(draw);

  noiseControl = folder1.add(options, 'noiseScale',10,5000);
  noiseControl.onChange(draw);

  LengthControl = folder1.add(options, 'Length',0.1,50);
  LengthControl.onChange(draw);

  NumsControl = folder1.add(options, 'Nums',100,2500);
  NumsControl.onChange(draw);

  SizeControl = folder1.add(options, 'Size',1,5);
  SizeControl.onChange(draw);


  RandomControl = folder1.add(options, 'Random');

  SaveControl = folder1.add(options, 'Save');

  folder1.open();
};


/**
 * P5
 */
var particles = [];
var maxLife;


function setup(){
  backgroundColor = color(options.Background);

  // Canvas setup
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5Container");
  // Detect screen density (retina)
  var density = displayDensity() * 1.5;
  pixelDensity(density);

  background(options.Background);
  for(var i = 0; i < 2500; i++){
      particles[i] = new Particle();
  }
}

function draw(){
    noStroke();
    smooth();  
 
    maxLife = options.Length;
    for(var i = 1; i < options.Nums; i++){
        var iterations = map(i,0,options.Nums,5,1);
        var radius = options.Size;
        
        particles[i].move(iterations);
        particles[i].checkEdge();
        
        var alpha = 255;
        var particleColor;
        var fadeRatio;
        fadeRatio = min(particles[i].life * 5 / maxLife, 1);
        fadeRatio = min((maxLife - particles[i].life) * 5 / maxLife, fadeRatio);
        var lifeRatioGrayscale = min(255, (255 * particles[i].life / maxLife) + red(backgroundColor));
        if(options.ColorMode == 'Normal'){     
            if(i%3==0)particleColor = options.Color1;
            if(i%3==1)particleColor = options.Color2;
            if(i%3==2)particleColor = options.Color3;
        }

        if(options.ColorMode == 'Linera Gradient'){
             var percent1 = norm(particles[i].pos.x,0,width/2);
             var percent2 = norm(particles[i].pos.x,width/2,width);
             from = color(options.Color1);
             middle = color(options.Color2);
             to = color(options.Color3);
             between1 = lerpColor(from, middle, percent1);
             between2 = lerpColor(middle, to, percent2);
             if(particles[i].pos.x > 0 && particles[i].pos.x <width/2){
                particleColor = between1;
            }else{
                particleColor = between2;   
            }    
        }  

        if(options.ColorMode == 'Radial Gradient'){
             var distance = dist(particles[i].pos.x ,particles[i].pos.y, width/2, height/2);
             var percent1 = norm(distance,0,400);
             var percent2 = norm(distance,400,width/2);
             from = color(options.Color1);
             middle = color(options.Color2);
             to = color(options.Color3);
             between1 = lerpColor(from, middle, percent1);
             between2 = lerpColor(middle, to, percent2);
             if(distance < 400){
                particleColor = between1;
            }else{
                particleColor = between2;   
            }    
        }  

        if(options.ColorMode == 'Splice'){ 
            if(particles[i].pos.x >=width/3 && particles[i].pos.x <= width/3*2){
                if(i%3==0)particleColor = options.Color1;
                if(i%3==1)particleColor = options.Color2;
                if(i%3==2)particleColor = options.Color3;
            }else if(particles[i].pos.x < width/3 ){
                if(i%3==0)particleColor = 20;
                if(i%3==1)particleColor = 100;
                if(i%3==2)particleColor = 220;
            }else if(particles[i].pos.x > width/3*2 ){
                if(i%3==0)particleColor = color(255-red(options.Color1),255-green(options.Color1),255-blue(options.Color1));
                if(i%3==1)particleColor = color(255-red(options.Color2),255-green(options.Color2),255-blue(options.Color2));
                if(i%3==2)particleColor = color(255-red(options.Color3),255-green(options.Color3),255-blue(options.Color3));
            }
        }

        fill(red(particleColor), green(particleColor), blue(particleColor), alpha * fadeRatio);
        particles[i].display(radius);
    } 
}

function Particle(){
  this.vel = createVector(0, 0);
  this.pos = createVector(random(-50, width+50), random(-50, height+50));
  this.life = random(0, maxLife);    
  this.move = function(iterations){
    if((this.life -= 0.01666) < 0)
      this.respawn();
    while(iterations > 0){

      var angle = noise(this.pos.x/options.noiseScale, this.pos.y/options.noiseScale)*TWO_PI*options.noiseScale;
      this.vel.x = cos(angle);
      this.vel.y = sin(angle);
      this.vel.mult(0.2);
      this.pos.add(this.vel);
      --iterations;
    }
  }

  this.checkEdge = function(){
  if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
      this.respawn();
  }
  }
  
  this.respawn = function(){
      this.pos.x = random(-50, width+50);
      this.pos.y = random(-50, height+50);
      this.life = maxLife;
  }

  this.display = function(r){
      ellipse(this.pos.x, this.pos.y, r, r);
  }
}

function touchStarted(){
    background(options.Background);
    for(var i = 0; i < options.Nums; i++){
        particles[i].respawn();
        particles[i].life = random(0,maxLife);
    }
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
  background(color(options.Background));
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