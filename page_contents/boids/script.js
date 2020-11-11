document.title = 'Boids - ' + document.title;

var canvas, ctx;
var color = "#000000";
var fps = 60;

var birds = [];

function normalize(x, y) {
  if(x != 0 || y != 0) {
    var n = Math.sqrt(x**2+ y**2);
    x = x/n;
    y = y/n;
  }
  return [x, y];
}

function makeRandomBird() {
  var x = Math.random()*canvas.width;
  var y = Math.random()*canvas.height;
  var [sx, sy] = [Math.random()*5, Math.random()*5];

  birds.push(new Bird(x, y, {x: sx, y: sy}));
}

function reset() {
  birds = [];
  for(i=0; i<70; i++) {
    makeRandomBird();
  }
}

function limit(x, lim) {
  return Math.max(Math.min(x, lim), -lim);
}

window.onload = function () {
  canvas = $("#canvas").get(0);
  ctx = canvas.getContext("2d");
  
  reset();

  //birds.push(new Bird(canvas.width/2, canvas.height/2, {x: 1, y: 0}));

  
  setInterval(function() {
    updateBirds();
    if(!$("#pause").is(":checked")) {
      updateBirdsPos();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBirds();
  }, 1000/fps);
}

function Bird(x, y, speed) {
  this.maxSpeed = 5;
  this.minSpeed = 1;
  this.visionLength = $("#visionLength").val();

  this.size = 10;
  this.speed = speed;

  this.x = x;
  this.y = y;
  this.nearby = [];

  this.force = {x: 0, y:0};

  this.right = function() {
    var scale = this.size/3;
    return {x: this.dir.y*scale+this.x, y: -this.dir.x*scale+this.y};
  };

  this.left = function() {
    var scale = this.size/3;
    return {x: -this.dir.y*scale+this.x, y: this.dir.x*scale+this.y};
  };

  this.head = function() {
    var scale = this.size;
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
        x = x + (this.x - b.x)/d;
        y = y + (this.y - b.y)/d;
      }
    );
    
    var s = $("#separation").val()/50;
    [x, y] = normalize(x, y);

    return [x*s, y*s];
  }

  this.cohesionForce = function() {
    var x = 0;
    var y = 0;
    
    if (this.nearby.length != 0) {
      this.nearby.forEach(b => {
          x = x + b.x;
          y = y + b.y;
        }
      );

      x = x/this.nearby.length;
      y = y/this.nearby.length;

      x = x - this.x;
      y = y - this.y;
    }

    var c = $("#cohesion").val()/40;

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

    var a = $("#alignment").val()/1000;

    [x, y] = normalize(x, y);

    return [x*a, y*a];
  }

  this.update = function() {
    this.visionLength = $("#visionLength").val();
    this.nearby = birds.filter(b => this.distanceTo(b.x, b.y) < this.visionLength && b != this);
    this.updateForce();
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

  this.updateForce = function() {
    var [x, y] = this.getNetForce();

    this.force.x = x;
    this.force.y = y;
  }

  this.updateSpeed = function(x, y) {
    this.speed.x += this.force.x;
    this.speed.y += this.force.y;

    this.speed.x = Math.max(Math.min(this.maxSpeed, this.speed.x), -this.maxSpeed);
    this.speed.y = Math.max(Math.min(this.maxSpeed, this.speed.y), -this.maxSpeed);
  }

  this.updatePos = function() {
    this.updateSpeed();
    this.updateDir();

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
  this.updateDir();
}


function draw(bird) {
  var head = bird.head();
  var left = bird.left();
  var right = bird.right();


  if($("#showForce").is(":checked")){
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    
    var x = limit(bird.force.x * 1000, 10);
    var y = limit(bird.force.y * 1000, 10);

    ctx.lineTo(x + bird.x, y + bird.y);
    ctx.stroke();
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.fill();
}

function drawVision(bird) {
  ctx.fillStyle = "rgba(200, 200, 200, 0.1)";
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.visionLength, 0, 2 * Math.PI);
  ctx.fill();
}

function updateBirds() {
  birds.forEach(b => b.update());
}

function updateBirdsPos() {
  birds.forEach(b => b.updatePos());
}

function drawBirds() {
  if($("#showVision").is(":checked")) {
    birds.forEach(b => drawVision(b));
  }
  birds.forEach(b => draw(b));
}

