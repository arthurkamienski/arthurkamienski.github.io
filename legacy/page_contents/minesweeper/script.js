document.title = 'Minesweeper - ' + document.title;
$('#topnav-fun').toggleClass('active');

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);

  script.onload = function() {
    start();
  };
}

addScript("/legacy/page_contents/minesweeper/minesweeper.js");
