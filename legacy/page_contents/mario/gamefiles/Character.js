function Character(pos) {
  // initial states
  this.side = "right";
  this.state = "idle";
  this.standing = true;
  this.down = false;
  // initial image
  this.img = document.getElementById(this.state + "_" + this.side);
  // initial pos
  this.pos = pos;
  this.speed = {x:0, y:0};
  // counter for state change
  this.tick = 0;
  // hitbox init
  this.hb = new Hitbox(this.pos, this.img);

  // move function
  this.move = function(dir) {
    // if direction = left/right, change speed to that direction
    // if dir = up, make it jump
    switch(dir) {
      case "left":
        this.speed.x = -7;
        break;
      case "up":
        this.jump();
        break;
      case "right":
        this.speed.x = 7;
        break;
    }
  }

  // jump function
  this.jump = function() {
    // if the character standing on a piece ground
    if(this.standing) {
      // give character y speed
      this.speed.y = -20;
      // play jump sound
      new Sound("jumpAudio").play();
    }
  }

  // stop function (after key release)
  this.stop = function(dir) {
    // if stop direction = left and it is moving to that side, stop
    // avoids stoping if othe key is released that is not that one
    if(dir == "left") {
      if(this.speed.x < 0) {
        // make speed = 0 (stop)
        this.speed.x = 0;
      }
    } else if(dir == "right") {
      if(this.speed.x > 0) {
        this.speed.x = 0;
      }
    }
  }


  // update the position and state of the character
  this.update = function() {
    // reset standing state (will be changed to true if it collides with)
    // something
    this.standing = false;

    // update position based on speed
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
    // update hitbox
    this.hb = new Hitbox(this.pos, this.img);

    // check for collisions with environment
    // bottom collision with the ground
    if(this.hb.b >= map.groundHeight) {
      this.pos.y = map.groundHeight;
      this.speed.y = 0;
      this.standing = true;
    }

    // top collision with ceilling
    if(this.hb.t <= 0) {
      this.pos.y = this.img.height;
      this.speed.y = -this.speed.y/1.3;
    }

    // left collision right limit
    if(this.hb.r >= canvas.width-400) {
      if(map.pos != 0) {
        this.pos.x = canvas.width-this.img.width/2-400;
      } else if(this.hb.r >= canvas.width) {
        this.pos.x = canvas.width-this.img.width/2;
      }

      // right collision left limit
    } else if(this.hb.l <= 200) {
      // if map.pos == 0, the left limit is the beggining of the canvas
      // else, it is the movement limit
      if(map.pos != 0) {
        this.pos.x = this.img.width/2+200;
      } else if(this.hb.l <= 0) {
        this.pos.x = this.img.width/2;
      }
    }

    // check collisions with all the objects of the map
    for (var i = map.objects.length - 1; i >= 0; i--) {
      var obj = map.objects[i];

      // if the object is collidable
      if(obj.col) {
        // check if there was collision (return the side of the collision, 
        // false if doesn't collide)
        switch(collision(this.hb, obj.hb)) {
          // bottom collision
          case "b":
            // if character was moving in that direction
            if(this.speed.y > 0){
              // reduces the hitbox size on bottom to avoid floating off the
              // side of the platform
              if(!(this.hb.l+15 > obj.hb.r || obj.hb.l > this.hb.r-15)) {
                // make position equal to the top of the object, and character
                // make character stand
                this.pos.y = obj.hb.t;
                this.standing = true;
                this.speed.y = 0;
              }
            }
            break;
          case "t":
            // if it is a hit from the bottom, bounce back
            if(this.speed.y < 0){
              this.pos.y = obj.hb.b+this.img.height;
              this.speed.y = -this.speed.y/1.3;
              // if it is a coin cube, call hit() method to start the animation
              if(obj.name == "coin_cube") {
                obj.hit();
              }
            }
            break
          case "r":
            // if it is a right or left collision, adjust the position so that
            // it doesnt overlap
            if(this.speed.x >= 0){
              this.pos.x = obj.hb.l-this.img.width/2;
            }
            break;
          case "l":
            if(this.speed.x <= 0){
              this.pos.x = obj.hb.r+this.img.width/2;
            }
            break;
        }
      }
    }
    // update hitbox after changes
    this.hb = new Hitbox(this.pos, this.img);
  }

  // update state based on position/speed/time
  this.updateState = function() { 
    // increase tick and make it up o 1
    this.tick++;
    this.tick %= 2;

    // face character to the side it is moving
    if(this.speed.x > 0)
      this.side = "right";
    else if(this.speed.x < 0)
      this.side = "left";

    // if it is standing
    if(this.standing) {
      // and it is not stopped
      if(this.speed.x != 0) {
        // on every other tick the state changes for walking animation
        if(this.tick == 0) {
          // switch between walking and standing
          if(this.state == "idle") { 
            this.state = "walk";
          } else {
            this.state = "idle";
          }
        }
        // if it is stopped it can be either ducking or idle
      } else {
        if(this.down) {
          this.state = "down";
        }
        else {
          this.state = "idle";
        }
      }
      // if it is not standing, then it is either jumping or falling
    } else {
      // if speed.y <= 0 it is jumping. If it is > 0 it is falling
      if(this.speed.y <= 0)
        this.state = "jump";
      else
        this.state = "fall";
    }

    // update image according to state
    this.img = document.getElementById(this.state + "_" + this.side);
    // update hitbox
    this.hb = new Hitbox(this.pos, this.img);
  }
}