document.title = 'Research - ' + document.title;
$('#topnav-research').toggleClass('active');

var script = document.createElement('script');
script.src = "/page_contents/research/animations.js";

document.head.appendChild(script);

script.onload = function() {
  setTimeout(function() {
    expand('publications');
  }, 700);
  btn.css('pointer-events', 'auto');
};
