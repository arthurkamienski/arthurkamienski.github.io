document.title = 'Chess - ' + document.title;

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);

  script.onload = function() {
    start();
  };
}

addScript("/legacy/page_contents/chess/chess.js");
