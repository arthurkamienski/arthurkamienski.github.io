document.title = 'Mario - ' + document.title;
$('#topnav-fun').toggleClass('active');

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);
}

addScript("/legacy/page_contents/mario/gamefiles/Character.js?v=1");
addScript("/legacy/page_contents/mario/gamefiles/Objects.js");
addScript("/legacy/page_contents/mario/gamefiles/Hitbox.js");
addScript("/legacy/page_contents/mario/gamefiles/Sound.js");
addScript("/legacy/page_contents/mario/gamefiles/Map.js");
addScript("/legacy/page_contents/mario/gamefiles/mario.js");
