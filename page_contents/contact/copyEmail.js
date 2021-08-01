function touchstart() {
  console.log('touch')
}

async function copyEmail() {
      d = $(this);
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
