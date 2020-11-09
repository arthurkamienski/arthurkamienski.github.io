document.title = 'Boids - ' + document.title;

var canvas = $("#canvas");
var ctx = canvas.getContext("2d");
var color = "#000000"

bird = {
  pos: [canvas.width/2, canvas.heigth/2]
}


function drawBird(bird) {
  const [x, y] = bird.pos;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill;
}


drawBird(bird);
