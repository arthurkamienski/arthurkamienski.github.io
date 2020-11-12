document.title = 'Mario - ' + document.title;

function addScript(src) {
  var script = document.createElement('script');
  script.src = src;

  document.head.appendChild(script);
}

addScript("/page_contents/gamefiles/Character.js?v=1");
addScript("/page_contents/gamefiles/Objects.js");
addScript("/page_contents/gamefiles/Hitbox.js");
addScript("/page_contents/gamefiles/Sound.js");
addScript("/page_contents/gamefiles/Map.js");
addScript("/page_contents/gamefiles/main.js");
