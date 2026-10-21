// class for playing sound
// taken from https://www.w3schools.com/graphics/game_sound.asp
function Sound(id) {
  // clone the audio from the html page by id
  // so that it can be played with overlap
  this.sound = document.getElementById(id).cloneNode(true);
  // set properties (autoload, no controls)
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  // play/pause functions
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }
}
