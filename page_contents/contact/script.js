document.title = 'Contact - ' + document.title;

var onlongtouch;
var timer = null;
var touchduration = 800; //length of time we want the user to touch before we do something

function touchstart(e) {
    e.preventDefault();
    if (!timer) {
        timer = setTimeout(copyEmail, touchduration);
    }
}

function touchend() {
    //stops short touches from firing the event
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}

async function copyEmail() {
    timer = null;
    var emailInput = $(this).find("input")[0];
    navigator.clipboard.writeText(emailInput.value.replace('[at]', '@'));

    var originalText = $(this).find("span.copy-text");
    var copied = $(this).find("span.email-copied");

    originalText.removeClass('fadein');
    copied.addClass('fadeout');

    setTimeout(function (){
        originalText.addClass('fadein');
        copied.removeClass('fadeout');
    }, 3000);
}

$(document).ready(function() {
  var divs = $('gmail, ualberta');

  divs.on('click', copyEmail)
});
