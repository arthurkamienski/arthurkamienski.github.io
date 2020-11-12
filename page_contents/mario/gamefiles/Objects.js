// Generic object
function Object(name, id, anchor) {
  // name for reference of what it is
  this.name = name;
  // if it is collidable
  this.col = true;
  // image
  this.img = document.getElementById(id); 
  // speed (for when it moves, zero otherwise)
  this.speed = {x:0, y:0};
  // anchor point (relative to the map, not the screen)
  this.anchor = anchor;
  // position on the canvas
  this.pos = {x: anchor.x, y: anchor.y};
  // hitbox definition for the object (relative to the screen)
  this.hb = new Hitbox(this.pos, this.img);

  // remove this object from the list of objects in the map
  this.remove = function() {
     map.removeObj(this);
  }
}

// Prototype for all objects
// move the object (on the screen) according to the speed and map pos
Object.prototype.move = function() {
  this.pos.x = -map.pos+this.anchor.x+this.speed.x;
  this.pos.y += this.speed.y;
  
  // update the hitbox
  this.hb = new Hitbox(this.pos, this.img);
};

// To be called at each frame, updates status of the objects
Object.prototype.update = function() {
  this.move();
}

// coin cube object
function CoinCube(name, id, pos, coinNum) {
  // call object parent
  Object.call(this, name, id, pos);

  // number of coins in this box
  this.coinNum = coinNum;

  this.tick = 0;
  this.state = 0;

  // function for when it is hit from below
  this.hit = function() {
    // if there are still coins
    // decreases number of coins
    if(this.coinNum-- != 0) {
      // gains upward speed
      this.speed.y = -4;
      // creates a coin object
      map.objects.push(new Coin("coin", "coin1", {x:this.anchor.x, y: this.anchor.y-this.img.height-10}));
      // increases the number of coins gained by the character
      coins++;
    }

    // if there are no more coins, makes a spent cube object
    if(this.coinNum == 0) {
      map.objects.push(new Object("spent_cube","spent_coin_cube", {x:this.anchor.x, y: this.anchor.y}));
    }
  }

  // function to update state after each frame
  this.update = function() {
    // call prototype
    Object.prototype.update.call(this);

    this.tick++;
    this.tick%=5;

    if(this.tick == 0)
      this.state++;

    // change image according to the time to live (makes coin spin)
    this.img = document.getElementById(this.name + (this.state%4+1));


    // if the coin number is zero remove the object
    if(this.coinNum == 0) {
      this.remove();
    }
  }

  // coin cube movement
  this.move = function() {
    // call prototype (add speed and map pos)
    Object.prototype.move.call(this);

    // if it reaches the peak of upward the movement, star going down
    if(this.anchor.y-this.pos.y>=10) {
      this.speed.y = -this.speed.y;
    }
    else if(this.pos.y >= this.anchor.y) {
      // if it reached the anchor point (initial position), stop
      this.speed.y = 0;
    }

    // update the hitbox
    this.hb = new Hitbox(this.pos, this.img);
  }
}

function Coin(name, id, pos) {
  // call parent constructor
  Object.call(this, name, id, pos);

  // play the new coin sound
  new Sound("coinAudio").play();

  // start with an upward speed
  this.speed.y = -4;
  // time to live (number of frames it will be alive)
  this.ttl = 9;
  // not collidable
  this.col = false;

  this.update = function() {
    Object.prototype.update.call(this);

    // change image according to the time to live (makes coin spin)
    this.img = document.getElementById(this.name + (this.ttl%4+1));
    // update hitbox to make it show on the right place
    this.hb = new Hitbox(this.pos, this.img);

    // decreases ttl. If the time to live was 0, remove it
    if(this.ttl-- == 0) {
      this.remove();
    }
  }

  // move function
  this.move = function() {
    // call prototype (add speed and map pos)
    Object.prototype.move.call(this);

    // if it reaches peak of movement, start going down
    if(this.anchor.y-this.pos.y>=20)
      this.speed.y = -this.speed.y;
    // update hitbox
    this.hb = new Hitbox(this.pos, this.img);
  }
}