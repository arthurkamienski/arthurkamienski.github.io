var holding;

function touchstart(e) {
  holding = true;
  var d = $(this);
  $(this).find('.contact-info-name').addClass('hovered');
  $(this).find('.contact-info-icon').addClass('hovered');

  setTimeout(function () {
    d.find('.contact-info-name').removeClass('hovered');
    d.find('.contact-info-icon').removeClass('hovered');
  }, 5000);

  setTimeout(function () {
    copyEmail(d);
  }, 800);
}

function touchend() {
  holding=false;
}

function click() {
  holding=true;
  copyEmail($(this));
}

async function copyEmail(d) {
  if (holding) {
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
