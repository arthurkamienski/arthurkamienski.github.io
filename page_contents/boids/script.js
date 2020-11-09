document.title = 'Boids - ' + document.title;

var canvas = $("#canvas").get(0);
var ctx = canvas.getContext("2d");
var color = "#000000"

bird = {
  x: canvas.width/2,
  y: canvas.heigth/2,
  speed: {x: 1, y: 0},
  right: function() {
    var dir = this.dir();
    return {x: dir.y, y: -dir.x};
  },
  left: function() {
    var dir = this.dir();
    return {x: -dir.y, y: dir.x};
  },
  dir: function() {
    return {x: this.x+this.speed.x, y: this.y+this.speed.y};
  },

};


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


drawBird(bird);
