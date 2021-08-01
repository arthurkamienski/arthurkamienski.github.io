document.title = 'Ants - ' + document.title;

$('#topnav-fun').toggleClass('active');

var script = document.createElement('script');
script.src = "/page_contents/ants/ants.js";

document.head.appendChild(script);
