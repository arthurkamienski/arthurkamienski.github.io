document.title = 'Boids - ' + document.title;

var canvas, ctx;
var color = "#000000";
var fps = 60;

var birds = []

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
  var [sx, sy] = normalize(Math.random(), Math.random());

  birds.push(new Bird(x, y, {x: sx, y: sy}));
}

window.onload = function () {
  canvas = $("#canvas").get(0);
  ctx = canvas.getContext("2d");

  for(i=0; i<70; i++) {
    makeRandomBird();
  }
  
  setInterval(function() {
    updateBirds();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBirds();
  }, 1000/fps);
}

function Bird(x, y, dir) {
  this.maxTurnAngle = 2;
  this.maxTurnAngleRad = Math.PI/180*this.maxTurnAngle;
  this.visionLength = $("#visionLength").val();
  this.size = 10;
  this.speed = 2;
  this.x = x;
  this.y = y;
  this.nearby = [];

  this.newTurn = true;
  this.turnLeft = Math.random() > 0.5;

  this.dir = dir;
  this.newDir = dir;

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

  this.updatePos = function() {
    this.dir = this.newDir;
    this.x = this.x+this.dir.x*this.speed;
    this.y = this.y+this.dir.y*this.speed;
  }

  this.angleBetween = function(x, y) {
    var dirx = this.dir.x;
    var diry = this.dir.y;

    var dotProduct = dirx*x + diry*y;
    var mag        = Math.sqrt((x**2+y**2)*(dirx**2+diry**2));

    var cos = Math.max(Math.min(dotProduct/mag, 1), -1);

    return Math.acos(cos);
  }

  this.distanceTo = function(x, y) {
    return Math.sqrt((this.x-x)**2+(this.y-y)**2);
  }

  this.turn = function(x, y) {
    if(x != 0 || y != 0) {
      var angle = this.angleBetween(x, y);

      angle = Math.max(Math.min(this.maxTurnAngleRad, angle), -this.maxTurnAngleRad);

      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      var x = this.dir.x;
      var y = this.dir.y;

      if(isNaN(cos)) {
        console.log(x, y, angle);
      }

      this.newDir = {
        x: x*cos-y*sin,
        y: x*sin+y*cos
      };
    }
  }

  this.wallForce = function() {
    var x = 0;
    var y = 0;

    if(this.x >= canvas.height-100) {
      x = -1;
    } else if(this.x <= 100) {
      x = 1;
    }

    if(this.y >= canvas.height-100) {
      y = -1;
    } else if(this.y <= 100) {
      y = 1;
    }

    return normalize(x, y);
  }


  this.separationForce = function() {
    var x = 0;
    var y = 0;

    this.nearby.forEach(b => {
        x = x + this.x - b.x;
        y = y + this.y - b.y;
      }
    );

    return normalize(x, y);
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

    return normalize(x, y);
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

    return normalize(x, y);
  }

  this.update = function() {
    this.visionLength = $("#visionLength").val();
    
    this.nearby = birds.filter(b => this.distanceTo(b.x, b.y) < this.visionLength && b != this);

    var [wx, wy] = this.wallForce();
    var netx = wx;
    var nety = wy;

    if(wx == 0 && wx == 0) {
      var s = $("#separation").val();
      var c = $("#cohesion").val();
      var a = $("#alignment").val();


      var [sx, sy] = this.separationForce();
      var [cx, cy] = this.cohesionForce();
      var [ax, ay] = this.alignmentForce();

      var netx = netx+s*sx+c*cx+a*ax;
      var nety = nety+s*sy+c*cy+a*ay;
    }


    this.turn(netx, nety);
  }
}


function draw(bird) {
  var head = bird.head();
  var left = bird.left();
  var right = bird.right();

  if($("#showVision").is(":checked")) {
    ctx.fillStyle = "rgba(100, 100, 100, 0.1)";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.visionLength, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(head.x, head.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.fill();
}

function updateBirds() {
  birds.forEach(b => b.update());
  birds.forEach(b => b.updatePos());
}

function drawBirds() {
  birds.forEach(b => draw(b));
}

