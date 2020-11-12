var canvas;
var ctx;

var dir = [0, 0];
var nextDir = dir;
var snake;
var size = 5;
var food;

var interval;

function start() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext("2d");
        snake = [[canvas.width/2, canvas.height/2]]
        draw(snake[0], "white");
	document.addEventListener('keydown', start);
	document.addEventListener('keydown', turn);
}

function move() {
	front = snake[0];
	newFront = [front[0]+dir[0]*10, front[1]+dir[1]*10];

	if(newFront[0] >= canvas.width) {
		newFront[0] = 0;
	} else if (newFront[0] < 0) {
		newFront[0] = canvas.width-10;
	}

	if(newFront[1] >= canvas.height) {
		newFront[1] = 0;
	} else if (newFront[1] < 0) {
		newFront[1] = canvas.height-10;
	}

	if(hasSnake(newFront)) {
		gameover();
	}

	snake.unshift(newFront);
}

function gameover() {
	window.clearInterval(interval);

	document.addEventListener('keydown', restart);
}

function restart(evt) {
	if (evt.keyCode >=37 && evt.keyCode <= 40) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		snake = [[canvas.width/2, canvas.height/2]];
		size = 5;
		draw(snake[0], "white");

		document.removeEventListener('keydown', restart);
		document.addEventListener('keydown', start);
	}
}

function hasSnake(pos) {
	var isSnake = false;

	for (var i = snake.length - 1; i >= 0 && !isSnake; i--) {
		isSnake = snake[i][0] == pos[0] && snake[i][1] == pos[1];
	}

	return isSnake;
}

function draw(pos, color) {
	ctx.fillStyle = color;
	ctx.fillRect(pos[0], pos[1], 10, 10);
}

function turn(evt) {
	switch(evt.keyCode) {
      //left
      case 37:
        if (dir[0] != 1) {
        	nextDir = [-1, 0];
        }
        break;
      // up
      case 38:
        if (dir[1] != 1) {
        	nextDir = [0, -1];
        }
        break;
      // right
      case 39:
        if (dir[0] != -1) {
        	nextDir = [1, 0];
        }
        break;
      // down
      case 40:
        if (dir[1] != -1) {
        	nextDir = [0, 1];
        }
        break;
      default:
        break;
	}
}

function erase(pos) {
	ctx.fillStyle = "#000000";
	ctx.fillRect(pos[0], pos[1], 10, 10);
}

function makeFood() {
	food = [parseInt(Math.random()*canvas.width/10)*10, parseInt(Math.random()*canvas.height/10)*10];

	while(hasSnake(food)) {
		food = [parseInt(Math.random()*canvas.width/10)*10, parseInt(Math.random()*canvas.height/10)*10];
	}

	draw(food, "grey");
}

function start(evt) {
	if (evt.keyCode >=37 && evt.keyCode <= 40) {
		document.removeEventListener('keydown', start);

		makeFood();

		interval = window.setInterval(function() {
			dir = nextDir;

			if(hasSnake(food)) {
				size++;
				makeFood();
			}

			if(size == snake.length) {
				erase(snake.pop());
			}

			move();

			draw(snake[0], "white");
		}, 100);
	}
}

// prevent scrolling
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
