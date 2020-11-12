document.title = 'Minesweeper - ' + document.title;

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);
}

addScript("/page_contents/minesweeper/minesweeper.js");
