document.title = 'Mario - ' + document.title;
$('#topnav-fun').toggleClass('active');

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);
}

addScript("/page_contents/mario/gamefiles/Character.js?v=1");
addScript("/page_contents/mario/gamefiles/Objects.js");
addScript("/page_contents/mario/gamefiles/Hitbox.js");
addScript("/page_contents/mario/gamefiles/Sound.js");
addScript("/page_contents/mario/gamefiles/Map.js");
addScript("/page_contents/mario/gamefiles/mario.js");
