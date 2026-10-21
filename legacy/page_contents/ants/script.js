document.title = 'Ants - ' + document.title;

$('#topnav-fun').toggleClass('active');

var script = document.createElement('script');
script.src = "/legacy/page_contents/ants/ants.js";

document.head.appendChild(script);
