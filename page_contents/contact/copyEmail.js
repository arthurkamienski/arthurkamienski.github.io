var onlongtouch;
var timer = null;
var touchduration = 800; //length of time we want the user to touch before we do something

function touchstart(e) {
    e.preventDefault();
    if (!timer) {
        timer = setTimeout(function() {copyEmail($(this))}, touchduration);
    }
}

function touchend() {
    //stops short touches from firing the event
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}


function click() {
    timer = False;
    copyEmail($(this));
}

async function copyEmail(d) {
    if (timer != null) {
      timer = null;
      var emailInput = d.find("input")[0];
      navigator.clipboard.writeText(emailInput.value.replace('[at]', '@'));

      var originalText = d.find("span.copy-text");
      var copied = d.find("span.email-copied");

      originalText.removeClass('fadein');
      copied.addClass('fadeout');

      setTimeout(function (){
          originalText.addClass('fadein');
          copied.removeClass('fadeout');
      }, 3000);
  }
}
