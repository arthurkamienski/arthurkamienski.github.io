var canvas, ctx;
var g = 9.8;
var center;
var pendulum;

$(document).ready(function() {
  canvas = $('#canvas')[0];
  ctx = canvas.getContext("2d");
  canvas.selection = false;
  center = new Pendulum(canvas.width/2, canvas.height/2, null, 1);
  pendulum = new Pendulum(canvas.width/2 + 50, canvas.height/2, center, 3);

  interval = window.setInterval(function() {
    blank();
    draw(center);
    draw(pendulum);
    update(pendulum);
  }, 1000/1);
});

function Pendulum(x, y, attach, r){
  this.attach = attach;
  this.r = r;
  this.x = x;
  this.y = y;
  this.mass = 1;
  this.speed = {x: 0, y: 0};
}

function vecLength(p1, p2) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2)
}

function cosBetween(c, p) {
  var g  = {x: c.x, y: 0}
  var cp = vecLength(c, p);
  var cg = vecLength(c, g);
  var gp = vecLength(g, p);

  return (cp**2 + cg**2 - gp**2) / (2*cp*cg)
}

function update(p) {
  var cos = cosBetween(p.attach, p);
  var sin = Math.sqrt(1-cos**2);

  var f = pendulum.mass * g * sin;

  p.speed.x += cos * f / pendulum.mass;
  p.speed.y += sin * f / pendulum.mass;

  p.x += p.speed.x;
  p.y += p.speed.y;
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
}
