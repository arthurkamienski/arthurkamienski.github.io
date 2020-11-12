function Map(canvas) {
  // map position
  this.pos = 0;
  // ground element (image)
  this.ground = document.getElementById("ground");
  // height of the ground on the canvas
  this.groundHeight = canvas.height - this.ground.height;
  // background image
  this.background = document.getElementById("background");

  // list of objects on the map
  this.objects = [
    new Object("greenTube", "green_tube", {x:200, y:this.groundHeight}),
    new CoinCube("coin_cube", "coin_cube1", {x:750, y:canvas.height-180}, 5),
    new CoinCube("coin_cube", "coin_cube1", {x:750+document.getElementById('coin_cube1').width, y:canvas.height-180}, 5)
  ];

  // remove an object from the object list (it seizes to exist)
  this.removeObj = function(object) {
    // finds object in list and removes it
    // backwards search: chances of the object being recently added are greater
    for (var i = this.objects.length - 1; i >= 0; i--) {
      if(this.objects[i] == object) {
        this.objects.splice(i, 1);
      }
    }
  }
}