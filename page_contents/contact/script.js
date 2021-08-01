document.title = 'Contact - ' + document.title;
$('#topnav-contact').toggleClass('active');

var script = document.createElement('script');
script.src = "/page_contents/contact/copyEmail.js";

document.head.appendChild(script);

script.onload = function() {
  var divs = $('.gmail, .ualberta');

  divs.on('click', click);
  divs.on('touchstart', touchstart);
  divs.on('touchend', touchend);
};
