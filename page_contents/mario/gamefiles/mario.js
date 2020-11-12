// canvas global variables
var canvas;
var canvasContext;

// global parameters for the game
var gravity = 1;
var fps = 30;
var coins = 0;

// global character reference
var mario;

// global map variable
var map;

// method called after all the elements on the window are loaded
window.onload = function() {
  // get the canvas reference by ID
  canvas = document.getElementById('canvas');
  // get context (for drawing)
  canvasContext = canvas.getContext('2d');

  // focus the canvas (avoids having to click on it)
  canvas.focus();

  // initializes map
  map = new Map(canvas);

  // creates the main character at given position
  mario = new Character({x:canvas.width/2, y:map.groundHeight});
  
  // calls given function each 1000/fps ms ('fps' frames per second)
  setInterval(iteration, 1000/fps);

  // listeners for key down/up
  document.addEventListener('keydown', keyDown);
  document.addEventListener('keyup', keyUp);

  $(".up").on({'click': moveUp()});
  $(".left").on({'touchstart': moveLeft()});
  $(".down").on({'touchstart': duck()});
  $(".right").on({'touchstart': moveRight()});

  $(".left").on({'touchend': stopLeft()});
  $(".down").on({'touchend': unduck()});
  $(".right").on({'touchend': stopRight()});

  $(".left").on({'touchcancel': stopLeft()});
  $(".down").on({'touchcancel': unduck()});
  $(".right").on({'touchcancel': stopRight()});
}

function moveUp() {
  mario.move("up");
}

function duck() {
  mario.down = true;
}

function moveLeft() {
  mario.move("left");
}

function moveRight() {
  mario.move("right");
}

function unduck() {
  mario.down=false;
}

function stopLeft() {
  mario.stop("left");
}

function stopRight() {
  mario.stop("right");
}

// keydown event
function keyDown(evt) {
  switch(evt.keyCode) {
    //left
    case 37:
      // moves mario on given direction
      mario.move("left");
      break;
    // up
    case 38:
      mario.move("up");
      break;
    // right
    case 39:
      mario.move("right");
      break;
    // right
    case 40:
      // makes mario duck
      mario.down = true;
      break;
    default:
      break;
  }

}

// key up event
function keyUp(evt) {
  if(evt.keyCode == 37) {
    // stops mario if it is moving in that direction
    mario.stop("left")
  } else if (evt.keyCode == 39) {
    mario.stop("right")
  }
  else if(evt.keyCode == 40) {
    // makes mario stand up
    mario.down = false;
  }
}

// one iteration of the game, executed for every frame ('fps' time per second)
function iteration() {
  // apply gravity to everything
  applyGravity();
  // move all of the elements
  moveAll();
  // update character state (changes state variables, hitbox and image)
  mario.updateState();
  // draws everything
  draw();

  // updates feedback text
  // document.getElementById("coins").textContent = coins;
  // document.getElementById("marioPosx").textContent = parseInt(mario.pos.x);
  // document.getElementById("marioPosy").textContent = parseInt(mario.pos.y);
  // document.getElementById("map.pos").textContent = map.pos;
}

// applies gravity to all elements that are affected by it
function applyGravity() {
    mario.speed.y += gravity;
}

// moves all elements
function moveAll() {
  // updates the character's position and state
  mario.update();

  // if the character has reached the maps' boundaries it stops and map moves
  // if right side of hitbox is igual to the boundary
  if(mario.hb.r == canvas.width-400 && map.pos <= 300) {
    // move map character.speed.x pixels
    // map.pos += mario.speed.x;
  }
  // if left side of hitbox is igual to the boundary
  if(mario.hb.l == 200 && map.pos > 0) {
    map.pos += mario.speed.x;
  }

  // moves all of the objects (if they have a speed)
  for (var i = map.objects.length - 1; i >= 0; i--) {
    map.objects[i].update();
  }
}

// calculates whether there was a collision and if so where
function collision(sqr1, sqr2) {
  var collision;

  // if the left side of a square is farther to the left than the right side
  // or if the top side of a square is farther down than the bottom side
  // of the other, there is no collision
  if(sqr1.l > sqr2.r ||
    sqr2.l > sqr1.r ||
    sqr1.t > sqr2.b ||
    sqr2.t > sqr1.b) {
    collision = false;
  } else {
    // if there is no collision, calculate where the borders are the closest
    // (to push the character away to the right side)
    var b = Math.abs(sqr1.b-sqr2.t);
    var t = Math.abs(sqr1.t-sqr2.b);
    var l = Math.abs(sqr1.l-sqr2.r);
    var r = Math.abs(sqr1.r-sqr2.l);

    // see which is the minimum and return the corresponding side
    switch(Math.min(l, r, b, t)) {
      case l:
        collision = "l";
        break;
      case r:
        collision = "r";
        break;
      case b:
        collision = "b";
        break;
      case t:
        collision = "t";
        break;
    }      
  }

  return collision;
}

// draw everything from the game
// order is important for relative position
function draw() {
  // background
  drawBackground();
  // ground
  drawGround();
  // objects
  drawObjects();

  // character
  canvasContext.drawImage(mario.img, mario.hb.l, mario.hb.t);
}

// draw the ground tiles
function drawGround() {
  // define where to start drawing
  // as the map position grows, the start must shift backwards
  // if it grows larger than the width of a tile, it would draw a tile that is
  // not shown
  var start = -map.pos%map.ground.width;

  // while the starting position for an image is smaller than the width
  // draws until all of the canvas is filled
  while(start < canvas.width) {
    // draw image for map.ground from the start point and at the ground height
    canvasContext.drawImage(map.ground, start, map.groundHeight);
    // adds the new tile width that was drawn to the start point
    start += map.ground.width;
  }
}

// draw background tile
// same as drawGround() but with the background image
function drawBackground() {
  var start = -map.pos%map.background.width;

  while(start < canvas.width) {
    canvasContext.drawImage(map.background, start, 0);
    start += map.background.width;
  }
}

// draw each object on the map that is on the canvas area
function drawObjects() {
  // for each object on the map
  for (var i = map.objects.length - 1; i >= 0; i--) {
    var obj = map.objects[i];

    // if the right side of the hitbox is further to the right than the mapPos
    // and the left side is further to left than the width it must be drawn
    if(obj.hb.r > map.pos || obj.hb.l < map.pos+canvas.width) {
      // draw obj image from the top left corner from the hitbox
      canvasContext.drawImage(obj.img, obj.hb.l, obj.hb.t);
    }
  }
}

// stops the screen from scrolling when using arrow keys
window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    // preven default behavior
    e.preventDefault();
  }
}, false);


