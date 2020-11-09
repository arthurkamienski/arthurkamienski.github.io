document.title = 'Boids - ' + document.title;

var canvas = $("#canvas").get(0);
var ctx = canvas.getContext("2d");
var color = "#000000"

function Bird(x, y, speed) {
  this.x = canvas.width/2;
  this.y = canvas.heigth/2;

  this.speed = speed;

  this.right = function() {
    var dir = this.dir();
    return {x: dir.y, y: -dir.x};
  };

  this.left = function() {
    var dir = this.dir();
    return {x: -dir.y, y: dir.x};
  };

  this.dir = function() {
    return {x: this.x+this.speed.x, y: this.y+this.speed.y};
  }
}


function drawBird(bird) {
  var dir = bird.dir();
  var left = bird.left();
  var right = bird.right();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(dir.x, dir.y);
  ctx.lineTo(left.x, left.y);
  ctx.lineTo(right.x, right.y);
  ctx.fill();
}
