document.title = 'Draw - ' + document.title;

var script = document.createElement('script');
script.src = "/page_contents/draw/draw.js";

document.head.appendChild(script);

script.onload = function() {
  start();
};
