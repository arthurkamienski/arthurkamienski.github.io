var canvas;
var ctx;
var squareSize;


function start() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext("2d");
  canvas.selection = false;
  drawBoard();
}

function drawBoard() {
  squareSize = canvas.width / 8;
  ctx.fillStyle = "black";

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if ((i + j) % 2 == 1) {
        ctx.fillRect(i*squareSize, j*squareSize, squareSize, squareSize);
      }
    }
  }
}
