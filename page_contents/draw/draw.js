var canvas = document.getElementById('canvas');
var sizeText = document.getElementById('sizeText');
var redText = document.getElementById('redText');
var blueText = document.getElementById('blueText');
var greenText = document.getElementById('greenText');
var colorText = document.getElementById('colorText');
var ctx = canvas.getContext("2d");

var colorPrev = document.getElementById('color');

var red = "00";
var green = "00";
var blue = "00";

var color = "#000000";

var tool = 'fill';
var size = 10;

var pos = [0, 0];

function toHex(num) {
	var hex = Number(num).toString(16);
	  if (hex.length < 2) {
	       hex = "0" + hex;
	  }
	return hex;
}

document.getElementById('clear').onclick = function() {
  clear();
}

document.getElementById('save').onclick = function() {
	var link = document.getElementById('link');
	var href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	link.setAttribute('href', href);
	link.click();
}

document.getElementById('size').oninput = function() {
  size = this.value;
  sizeText.text = this.value-1;
}

document.getElementById('red').oninput = function() {
  red = toHex(this.value);
  redText.text = this.value;
  updateColor();
}

document.getElementById('green').oninput = function() {
  green = toHex(this.value);
  greenText.text = this.value;
  updateColor();
}
document.getElementById('blue').oninput = function() {
  blue = toHex(this.value);
  blueText.text = this.value;
  updateColor();
}

function clear() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeColor(r, g, b) {
	document.getElementById('red').value = r;
	red = toHex(r);
	redText.text = r;
	document.getElementById('green').value = g;
	green = toHex(g);
	greenText.text = g;
	document.getElementById('blue').value = b;
	blue = toHex(b);
	blueText.text = b;

	updateColor();
}

function updateColor() {
	color = "#"+red+green+blue;
	colorPrev.style.backgroundColor = color;
	colorText.text = color.toUpperCase();
}

window.onload = function() {
	clear();
	canvas.addEventListener('mousedown', action);
}

function action(evt) {
	var tool = 'brush';
	if(tool == 'brush') {
		on(evt);
	} else {
		fill(evt);
	}
}

function on(evt) {
	canvas.addEventListener('mouseup', off);

	var rect = canvas.getBoundingClientRect();
	var x = parseInt(evt.clientX-rect.left);
	var y = parseInt(evt.clientY-rect.top);

	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, size/2, 0, 2 * Math.PI);
	ctx.fill();

	pos = [x, y];

	canvas.addEventListener('mousemove', draw);
}

function off(evt) {
	var rect = canvas.getBoundingClientRect();
	var x = parseInt(evt.clientX-rect.left);
	var y = parseInt(evt.clientY-rect.top);

	ctx.beginPath();
	ctx.arc(x, y, size/2, 0, 2 * Math.PI);
	ctx.fill();

	canvas.removeEventListener('mousemove', draw);
	canvas.removeEventListener('mouseup', off);
}

function draw(evt) {
	var rect = canvas.getBoundingClientRect();
	var x = parseInt(evt.clientX-rect.left);
	var y = parseInt(evt.clientY-rect.top);
	
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.lineWidth = size;

	ctx.beginPath();
	ctx.moveTo(pos[0], pos[1]);
	ctx.lineTo(x, y);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(x, y, size/2, 0, 2 * Math.PI);
	ctx.fill();

	pos = [x, y];
}
