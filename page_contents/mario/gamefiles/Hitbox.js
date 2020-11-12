// Hitbox object for simpler collision detection and spatial reference
function Hitbox(pos, img) {
  // top/bottom/left/right sides of the hitbox
  // the position is defined as the middle of the bottom side
  this.b = pos.y;
  this.t = pos.y-img.height;
  this.l = pos.x-img.width/2;
  this.r = pos.x+img.width/2;

  // corners of the hitbox (top-left/right, bottom-left/right)
  this.tl = {x: this.l, y: this.t};
  this.tr = {x: this.r, y: this.t};
  this.bl = {x: this.l, y: this.b};
  this.br = {x: this.r, y: this.b};
}