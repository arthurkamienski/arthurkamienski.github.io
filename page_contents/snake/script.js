document.title = 'Snake - ' + document.title;

var script = document.createElement('script');
script.src = "/page_contents/snake/snake.js";

document.head.appendChild(script);

script.onload = function() {
  setup();
};

