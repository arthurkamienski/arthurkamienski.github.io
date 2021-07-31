document.title = 'Research - ' + document.title;

var script = document.createElement('script');
script.src = "/page_contents/research/animations.js";

document.head.appendChild(script);

script.onload = function() {
  expand('publications');
};
