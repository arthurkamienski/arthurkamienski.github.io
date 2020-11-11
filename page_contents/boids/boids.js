var canvas, ctx;

var cohesionForce   = 2;
var separationForce = 1;
var alignmentForce  = 0.5;

var birdColor;
var backgroundColor;
var maxSpeed;

var birdNum;
var size;
var visionDistance;
var cohesion;
var alignment;
var separation;

var birds = [];
var fps   = 60;

var randomBirdColor = false;
var isPaused    = false;
var showVision  = false;
var showPath    = false;
var showForce   = false;
var showSpeed   = false;

function normalize(x, y) {
  if(x != 0 || y != 0) {
    var n = Math.sqrt(x**2+ y**2);
    x = x/n;
    y = y/n;
  }
  return [x, y];
}

function makeRandomBird() {
  var x        = Math.random()*canvas.width;
  var y        = Math.random()*canvas.height;
  var [sx, sy] = [Math.random()*5, Math.random()*5];
  var speed    = {x: sx, y: sy};

  var color;

  if(randomBirdColor) {
    color = makeRandomColor();
  } else {
    color = birdColor;
  }

  birds.push(new Bird(x, y, speed, color));
}

function reset() {
  birds = [];
  for(i=0; i < birdNum; i++) {
    makeRandomBird();
  }
}

function pause() {
  if(isPaused) {
    isPaused = false;
    $("#pause").text("Pause");
    $("#pause").css("background-color","");
  } else {
    isPaused = true;
    $("#pause").css("background-color","#DDDDDD");
    $("#pause").text("Paused");
  }
}

function toggleVision() {
  if(showVision) {
    showVision = false;
    $("#vision").css("background-color","");
  } else {
    showVision = true;
    $("#vision").css("background-color","#DDDDDD");
  }
}

function toggleForce() {
  if(showForce) {
    showForce = false;
    $("#force").css("background-color","");
  } else {
    showForce = true;
    $("#force").css("background-color","#DDDDDD");
  }
}

function toggleSpeed() {
  if(showSpeed) {
    showSpeed = false;
    $("#speed").css("background-color","");
  } else {
    showSpeed = true;
    $("#speed").css("background-color","#DDDDDD");
  }
}

function togglePath() {
  if(showPath) {
    showPath = false;
    $("#path").css("background-color","");
  } else {
    showPath = true;
    $("#path").css("background-color","#DDDDDD");
  }
}

function randomColor() {
  if(randomBirdColor) {
    randomBirdColor = false;
    $("#randomBirdColor").css("background-color","");
    birds.forEach(b => b.color = birdColor);
  } else {
    randomBirdColor = true;
    $("#randomBirdColor").css("background-color","#DDDDDD");
    birds.forEach(b => b.color = makeRandomColor());
  }
}

function makeRandomColor() {
  var r = Math.round(Math.random()*255);
  var g = Math.round(Math.random()*255);
  var b = Math.round(Math.random()*255);

  return rgbToHex(r, g, b);
}

function limit(x, lim) {
  return Math.max(Math.min(x, lim), -lim);
}

function changeBirdColor(r, g, b) {
  $("#birdRed").val(r);
  $("#birdGreen").val(g);
  $("#birdBlue").val(b);
}

function updateBirdColor() {
  var r = parseInt($("#birdRed").val());
  var g = parseInt($("#birdGreen").val());
  var b = parseInt($("#birdBlue").val());

  var newColor = rgbToHex(r, g, b);
  
  if(newColor != birdColor) {
    birdColor = newColor;
    $("#birdColorCode").text(birdColor);
    $("#birdColorPreview").css("background-color", birdColor);
    
    if(randomBirdColor) {
      randomColor();
    } else {
      birds.forEach(b => b.color = birdColor);
    }
  }
}

function changeBackgroundColor(r, g, b) {
  $("#backgroundRed").val(r);
  $("#backgroundGreen").val(g);
  $("#backgroundBlue").val(b);
}

function updateBackgroundColor() {
  var r = parseInt($("#backgroundRed").val());
  var g = parseInt($("#backgroundGreen").val());
  var b = parseInt($("#backgroundBlue").val());

  var newColor = rgbToHex(r, g, b);
  
  if(newColor != backgroundColor) {
    backgroundColor = newColor;
    $("#backgroundColorCode").text(backgroundColor);
    $("#backgroundColorPreview").css("background-color", backgroundColor);
  }
}

function updateVars() {
  updateBirdColor();
  updateBackgroundColor()
  
  maxSpeed = $("#maxSpeed").val();

  birdNum  = $("#birdNum").val();
  size     = $("#size").val();

  visionDistance = $("#visionDistance").val();
  
  cohesion   = $("#cohesion").val()*cohesionForce;
  alignment  = $("#alignment").val()*alignmentForce;
  separation = $("#separation").val()*separationForce;
}

function updateNumBirds() {
  if(birds.length != birdNum) {
    while(birds.length > birdNum) {
      birds.pop()
    }

    while(birds.length < birdNum) {
      makeRandomBird();
    }
  }
}

function start() {
  canvas = $("#canvas").get(0);
  ctx = canvas.getContext("2d");
  
  reset();

  setInterval(function() {
    updateVars();
    updateNumBirds();
    updateBirds();
    
    if(!isPaused) {
      updateBirdsPos();
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBirds();
  }, 1000/fps);
}

function Bird(x, y, speed, color) {
  this.color = color;

  this.speed = speed;

  this.x = x;
  this.y = y;
  this.nearby = [];
  this.path   = [];

  this.force = {x: 0, y:0};

  this.right = function() {
    var scale = size/3;
    return {x: this.dir.y*scale+this.x, y: -this.dir.x*scale+this.y};
  };

  this.left = function() {
    var scale = size/3;
    return {x: -this.dir.y*scale+this.x, y: this.dir.x*scale+this.y};
  };

  this.head = function() {
    var scale = size;
    return {x: this.dir.x*scale+this.x, y: this.dir.y*scale+this.y};
  }

  this.distanceTo = function(x, y) {
    return Math.sqrt((this.x-x)**2+(this.y-y)**2);
  }

  this.wallForce = function() {
    var x = 0;
    var y = 0;

    if(this.x >= canvas.width-100) {
      x = -10/this.distanceTo(canvas.width, this.y);
    } else if(this.x <= 100) {
      x = 10/this.distanceTo(0, this.y);
    }

    if(this.y >= canvas.height-100) {
      y = -10/this.distanceTo(this.x, canvas.height);
    } else if(this.y <= 100) {
      y = 10/this.distanceTo(this.x, 0);
    }

    return [x, y];
  }

  this.separationForce = function() {
    var x = 0;
    var y = 0;

    this.nearby.forEach(b => {
        var d = this.distanceTo(b.x, b.y);
        x += (this.x - b.x)/d;
        y += (this.y - b.y)/d;
      }
    );
    
    var s = separation;
    [x, y] = normalize(x, y);

    return [x*s, y*s];
  }

  this.cohesionForce = function() {
    var x = 0;
    var y = 0;
    
    if (this.nearby.length != 0) {
      this.nearby.forEach(b => {
          x += b.x;
          y += b.y;
        }
      );

      x = x/this.nearby.length;
      y = y/this.nearby.length;
      
      var d = this.distanceTo(x, y);

      x = (x - this.x)*d;
      y = (y - this.y)*d;
    }

    var c = cohesion;

    [x, y] = normalize(x, y);

    return [x*c, y*c];
  }

  this.alignmentForce = function() {
    var x = 0;
    var y = 0;


    if (this.nearby.length != 0) {
      this.nearby.forEach(b => {
          x = x + b.dir.x;
          y = y + b.dir.y;
        }
      );

      x = x/this.nearby.length;
      y = y/this.nearby.length;
    }

    var a = alignment;

    [x, y] = normalize(x, y);

    return [x*a, y*a];
  }

  this.getNetForce = function() {
    var [wx, wy] = this.wallForce();
    var netx = wx;
    var nety = wy;

    var [sx, sy] = this.separationForce();
    var [cx, cy] = this.cohesionForce();
    var [ax, ay] = this.alignmentForce();

    var netx = netx+sx+cx+ax;
    var nety = nety+sy+cy+ay;

    return [netx, nety];
  }

  this.addToQueue = function() {
    this.path.push([this.x, this.y]);

    if(this.path.length > 30) {
      this.path.shift();
    }
  }

  this.update = function() {
    this.nearby = birds.filter(b => this.distanceTo(b.x, b.y) < visionDistance && b != this);
    this.updateForce();
  }

  this.updateForce = function() {
    var [x, y] = this.getNetForce();

    this.force.x = x;
    this.force.y = y;
  }

  this.updateSpeed = function(x, y) {
    this.speed.x += this.force.x;
    this.speed.y += this.force.y;

    this.speed.x = limit(this.speed.x, maxSpeed);
    this.speed.y = limit(this.speed.y, maxSpeed);
  }

  this.updatePos = function() {
    this.updateSpeed();
    this.updateDir();

    this.addToQueue();

    this.x += this.speed.x;
    this.y += this.speed.y;
  }

  this.updateDir = function() {
    var [x, y] = normalize(this.speed.x, this.speed.y);

    this.dir = {
      x: x,
      y: y
    }
  }

  this.draw = function() {
    var head  = this.head();
    var left  = this.left();
    var right = this.right();
  
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.fill();
  }
  
  this.drawVision = function() {
    var head = this.head();

    var xCenter = (head.x + this.x)/2;
    var yCenter = (head.y + this.y)/2;


    ctx.fillStyle = "rgba(200, 200, 200, 0.1)";
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, visionDistance, 0, 2 * Math.PI);
    ctx.fill();
  }

  this.drawForce = function() {
    if(this.force.x != 0 || this.force.y != 0) {
      ctx.strokeStyle = "#FF0000";

      var x = limit(this.force.x * 1000, 2*size) + this.x;
      var y = limit(this.force.y * 1000, 2*size) + this.y;

      ctx.beginPath();
      arrow(this.x, this.y, x, y);
      ctx.stroke();
    }
  }

  this.drawSpeed = function() {
    if(this.speed.x != 0 || this.speed.y != 0) {
      ctx.strokeStyle = "#0000FF";

      var x = this.speed.x * 6 * size/10 + this.x;
      var y = this.speed.y * 6 * size/10+ this.y;

      ctx.beginPath();
      arrow(this.x, this.y, x, y);
      ctx.stroke();
    }
  }

  this.drawPath = function() {
    ctx.strokeStyle = hexToRgbA(this.color, 0.5);
    ctx.beginPath();

    ctx.moveTo(this.x, this.y);

    for(i=this.path.length-1; i>=0; i--) {
      var [x, y] = this.path[i];
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  this.updateDir();
}

function arrow(fromx, fromy, tox, toy) {
  var headlen = size/2;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function updateBirds() {
  birds.forEach(b => b.update());
}

function updateBirdsPos() {
  birds.forEach(b => b.updatePos());
}

function drawBirds() {
  if(showVision) {
    birds.forEach(b => b.drawVision());
  }

  if(showForce){
    birds.forEach(b => b.drawForce());
  }

  if(showSpeed){
    birds.forEach(b => b.drawSpeed());
  }

  if(showPath){
    birds.forEach(b => b.drawPath());
  }

  birds.forEach(b => b.draw());
}

function hexToRgbA(hex, alpha){
  var c= hex.substring(1).split('');
  if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c= '0x'+c.join('');
  return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}
