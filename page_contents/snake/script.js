document.title = 'Snake - ' + document.title;
$('#topnav-fun').toggleClass('active');

var script = document.createElement('script');
script.src = "/page_contents/snake/snake.js";

document.head.appendChild(script);

script.onload = function() {
  setup();
};

