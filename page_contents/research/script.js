document.title = 'Research - ' + document.title;
$('#topnav-research').toggleClass('active');

var script = document.createElement('script');
script.src = "/page_contents/research/animations.js";

document.head.appendChild(script);

script.onload = function() {
  setTimeout(function() {
    expand('publications');
    $(".collapse-button").css('pointer-events', 'auto');
  }, 700);
};
