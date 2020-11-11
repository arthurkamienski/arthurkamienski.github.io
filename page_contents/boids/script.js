document.title = 'Boids - ' + document.title;

var script = document.createElement('script');
script.src = "/page_contents/boids/boids.js";

document.head.appendChild(script);

script.onload = function() {
  start();
};

