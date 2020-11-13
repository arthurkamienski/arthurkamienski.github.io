var canvas;
var ctx;
var field;


function start() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext("2d");
        canvas.selection = false;
	canvas.removeEventListener('click', start);
	field = new Field();
	canvas.width = field.gridSize.x*(field.sqrSize+1)+1;
	canvas.height = field.gridSize.y*(field.sqrSize+1)+1;
	drawField();
	canvas.addEventListener('click', scan);
	canvas.addEventListener('contextmenu', mark);
}

function gameOver() {
	canvas.removeEventListener('click', scan);
	canvas.removeEventListener('contextmenu', mark);
	canvas.addEventListener('click', start);
	drawBombs();
}

function Field() {
	this.sqrSize = 15;
	this.gridSize = {x:20, y:20};
	this.bombNum = 70;
	this.tiles = [];
	this.revealed = 0;

	this.tileAt = function(x, y) {
		return this.tiles[x][y];
	};

	this.neighboursOf = function(tile) {
		var x = tile.x;
		var y = tile.y;

		var neighbours = [];
		for(var i=x-1; i<=x+1; i++) {
			for(var j=y-1; j<=y+1; j++) {
				if(i>=0 && j>=0 && i<this.gridSize.x && j<this.gridSize.y) {
					if(i!=x || j!=y) {
						neighbours.push(this.tileAt(i, j));
					}
				}
			}
		}

		return neighbours;
	}

	this.countTiles = function(tiles, property) {
		var count = 0;

		for (var i=tiles.length-1; i>=0; i--) {
			if(tiles[i][property]) {
				count++;
			}
		}

		return count;
	}

	for(var i=0; i<this.gridSize.x; i++) {
		this.tiles[i] = [];
		for(var j=0; j<this.gridSize.y; j++) {
			this.tiles[i][j] = new Tile(i, j);
		}
	}

	var bombs = 0;

	while(bombs < this.bombNum) {
		var x = parseInt(Math.random()*this.gridSize.x);
		var y = parseInt(Math.random()*this.gridSize.y);

		if(!this.tileAt(x, y).isBomb) {
			this.tileAt(x, y).isBomb = true;
			bombs++;
		}
	}

	for(var i=0; i<this.gridSize.x; i++) {
		for(var j=0; j<this.gridSize.y; j++) {
			var tile = this.tileAt(i, j);
			if(!tile.isBomb) {
				tile.nb = this.countTiles(this.neighboursOf(tile), "isBomb");
			}
		}
	}
}

function Tile(x, y) {
	this.x = x;
	this.y = y;
	this.nb = null;
	this.isBomb = false;
	this.isMarked = false;
	this.isRevealed = false;
}

function scan(evt) {
	var rect = canvas.getBoundingClientRect();
	var x = parseInt((evt.clientX-rect.left)/(field.sqrSize+1));
	var y = parseInt((evt.clientY-rect.top)/(field.sqrSize+1));

	var tile = field.tileAt(x, y);

	if(!tile.isMarked) {
		if(tile.isRevealed) {
			var neighbours = field.neighboursOf(tile);
			if(field.countTiles(neighbours, "isMarked") == tile.nb) {
				for (var i = neighbours.length-1; i>=0; i--) {
					if(!neighbours[i].isMarked) {
						reveal(neighbours[i]);
					}
				}
			}
		} else {
			reveal(tile);
		}
	}
}

function mark(evt) {
	evt.preventDefault()
	var rect = canvas.getBoundingClientRect();
	var x = parseInt((evt.clientX-rect.left)/(field.sqrSize+1));
	var y = parseInt((evt.clientY-rect.top)/(field.sqrSize+1));

	var tile = field.tileAt(x, y);

	if(!tile.isRevealed) {
		if(!tile.isMarked) {
			tile.isMarked = true;
			drawSquare(tile, "orange");
		} else {
			tile.isMarked = false;
			drawSquare(tile, "silver");
		}
	}
}

function reveal(tile) {
	if(!tile.isRevealed) {
		tile.isRevealed = true;
		field.revealed++;

		if(tile.isBomb) {
			gameOver();
		} else {
			if(tile.nb==0) {
				var neighbours = field.neighboursOf(tile);

				for (var i = neighbours.length-1; i>=0; i--) {
					reveal(neighbours[i]);
				}

				drawSquare(tile, "lightgrey");

			} else {
				drawNum(tile);
			}
		}

		if(field.revealed == field.gridSize.x*field.gridSize.y-field.bombNum) {
			gameOver();
		}
	}
}

function collapse(pos) {
	for(var i=pos[0]-1; i<=pos[0]+1; i++) {
		for(var j=pos[1]-1; j<=pos[1]+1; j++) {
			if(i>=0 && j>=0 && i<gridSize && j<gridSize) {
				reveal([i, j]);
			}
		}
	}
}

function drawField() {
	for (var i = 0; i < canvas.width-2; i+=field.sqrSize+1) {
		for (var j = 0; j < canvas.height-2; j+=field.sqrSize+1) {
			ctx.fillStyle = "black";
			ctx.fillRect(i, j, (field.sqrSize+2), (field.sqrSize+2));
			ctx.fillStyle = "silver";
			ctx.fillRect(i+1, j+1, field.sqrSize, field.sqrSize);
		}
	}
}

function drawSquare(tile, color) {
	ctx.fillStyle = color;
	ctx.fillRect(tile.x*(field.sqrSize+1)+1, tile.y*(field.sqrSize+1)+1, field.sqrSize, field.sqrSize);
}

function drawNum(tile) {
	drawSquare(tile, "lightgrey")

	switch(tile.nb) {
		case 1:
			ctx.fillStyle = "blue";
		break;
		case 2:
			ctx.fillStyle = "green";
		break;
		case 3:
			ctx.fillStyle = "red";
		break;
		case 4:
			ctx.fillStyle = "darkblue";
		break;
		default:
			ctx.fillStyle = "black";
		break;
	}

	ctx.font = "17px Arial";
	ctx.textAlign = "center";
	ctx.fillText(tile.nb, (tile.x+0.45)*(field.sqrSize+1)+1, (tile.y+0.9)*(field.sqrSize+1)+1);
}

function drawBombs() {
	for (var i = 0; i < field.gridSize.x; i++) {
		for (var j = 0; j < field.gridSize.y; j++) {
			var tile = field.tileAt(i, j);
			if(tile.isBomb && !tile.isMarked) {
				drawSquare(tile, "red");
			}
		}
	}
}
