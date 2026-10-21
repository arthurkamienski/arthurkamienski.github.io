var canvas, ctx;
var g = 0.1;
var center;
var pendulum;

$(document).ready(function() {
  canvas = $('#canvas')[0];
  ctx = canvas.getContext("2d");
  canvas.selection = false;
  center = new Pendulum(canvas.width/2, canvas.height/2, null, 1);
  pendulum = new Pendulum(canvas.width/2 + 100, canvas.height/2, center, 3);

  interval = window.setInterval(function() {
    updateScreen();
  }, 1000/30);
});

function updateScreen() {
    blank();
    draw(center);
    draw(pendulum);
    update(pendulum);
}

function Pendulum(x, y, attach, r){
  if (attach == null) {
    this.attach = this;
  } else {
    this.attach = attach;
  }

  this.r = r;
  this.x = x;
  this.y = y;
  this.mass = 1;
  this.speed = 0;
}

function vecLength(p1, p2) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)
}

function rotationAngle(p) {
  var c  = p.attach;
  var ground  = {x: c.x, y: 0};
  var cp = vecLength(c, p);
  var cg = vecLength(c, ground);
  var gp = vecLength(ground, p);

  var cos = (cp**2 + cg**2 - gp**2) / (2*cp*cg);
  var sin = Math.sqrt(1-cos**2);
  
  if (p.x - c.x > 0) {
    p.speed += g * sin;
  } else {
    p.speed -= g * sin;
  }
  

  return p.speed / p.r;
}

function update(p) {
  var angle = rotationAngle(p);
  var sin = Math.sin(angle);
  var cos = Math.cos(angle);

  p.x -= p.attach.x;
  p.y -= p.attach.y;

  var x = p.x * cos - p.y * sin;
  var y = p.x * sin + p.y * cos;

  p.x = x + p.attach.x;
  p.y = y + p.attach.y;
}

function blank() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw(p) {
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.attach.x, p.attach.y);
  ctx.stroke();
}
