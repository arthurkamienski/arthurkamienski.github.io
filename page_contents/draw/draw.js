var canvas = document.getElementById('canvas');
var sizeText = document.getElementById('sizeText');
var redText = document.getElementById('redText');
var blueText = document.getElementById('blueText');
var greenText = document.getElementById('greenText');
var colorText = document.getElementById('colorText');
var colorPrev = document.getElementById('color');

var ctx = canvas.getContext("2d");

var red = "00";
var green = "00";
var blue = "00";

var color = "#000000";

var tool = 'fill';
var size = 10;

var prevPos = [0, 0];

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

//TODO: add alert before download
document.getElementById('save').onclick = function() {
  var link = document.getElementById('link');
  var href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  link.setAttribute('href', href);
  link.click();
}

document.getElementById('size').oninput = function() {
  size = this.value;
  sizeText.innerHTML = this.value-1;
}

document.getElementById('red').oninput = function() {
  red = toHex(this.value);
  redText.innerHTML = this.value;
  updateColor();
}

document.getElementById('green').oninput = function() {
  green = toHex(this.value);
  greenText.innerHTML = this.value;
  updateColor();
}
document.getElementById('blue').oninput = function() {
  blue = toHex(this.value);
  blueText.innerHTML = this.value;
  updateColor();
}

function clear() {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeColor(r, g, b) {
  document.getElementById('red').value = r;
  red = toHex(r);
  redText.innerHTML = r;
  document.getElementById('green').value = g;
  green = toHex(g);
  greenText.innerHTML = g;
  document.getElementById('blue').value = b;
  blue = toHex(b);
  blueText.innerHTML = b;
  
  updateColor();
}

function updateColor() {
  color = "#"+red+green+blue;
  colorPrev.style.backgroundColor = color;
  colorText.innerHTML = color.toUpperCase();
}

function mouseEvtPos(evt) {
  return {x: evt.clientX, y: evt.clientY};
}

function touchEvtPos(evt, mouseEventName) {
  return {x: evt.touches[0].clientX, y: evt.touches[0].clientY}
}

function canvasMouseClick(evt) {
  var tool = 'brush';
  if(tool == 'brush') {
    brushStartMouse(evt);
 } 
}

function canvasTouch(evt) {
  var tool = 'brush';
  if(tool == 'brush') {
    brushStartTouch(evt);
 } 
}

function canvasPos(evtPos) {
  var rect = canvas.getBoundingClientRect();
  var x = parseInt(evtPos.x-rect.left);
  var y = parseInt(evtPos.y-rect.top);
  
  var canvasX = x/rect.width*500;
  var canvasY = y/rect.height*500;

  return [canvasX, canvasY];
}

function drawPoint(evtPos) {
  const [x, y] = canvasPos(evtPos);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, 2 * Math.PI);
  ctx.fill();
  
  prevPos = [x, y]
}

function drawLine(evtPos) {
  const [x, y] = canvasPos(evtPos);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  
  ctx.beginPath();
  ctx.moveTo(prevPos[0], prevPos[1]);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(x, y, size/2, 0, 2 * Math.PI);
  ctx.fill();
  
  prevPos = [x, y];
}

function brushStartMouse(evt) {
  document.addEventListener('mouseup', brushEndMouse);
  document.addEventListener('selectstart', disableSelect);

  var evtPos = mouseEvtPos(evt);

  drawPoint(evtPos);

  canvas.addEventListener('mousemove', drawLineMouse);
}

function brushStartTouch(evt) {
  document.addEventListener('touchend', brushEndTouch, {passive: false});
  document.addEventListener('touchcancel', brushEndTouch, {passive: false});

  var evtPos = touchEvtPos(evt);

  drawPoint(evtPos);

  canvas.addEventListener('touchmove', drawLineTouch, {passive: false});
}

function brushEndMouse(evt) {
  var evtPos = mouseEvtPos(evt);
  
  drawPoint(evtPos);

  canvas.removeEventListener('mousemove', drawLineMouse);

  document.removeEventListener('mouseup', brushEndMouse);
  document.removeEventListener('selectstart', disableSelect);
}

function brushEndTouch(evt) {
  canvas.removeEventListener('touchmove', drawLineTouch);

  document.removeEventListener('touchend', brushEndTouch);
  document.removeEventListener('touchcancel', brushEndTouch);
}

function drawLineMouse(evt) {
  var evtPos = mouseEvtPos(evt);

  drawLine(evtPos);
}

function drawLineTouch(evt) {
  var evtPos = touchEvtPos(evt);

  drawLine(evtPos);
}

function disableSelect(evt) {
    evt.preventDefault();
}
