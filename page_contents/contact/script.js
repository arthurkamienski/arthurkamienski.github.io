document.title = 'Contact - ' + document.title;

function copyEmail(d) {
  var email = $(d).text();
  email.select();
  email.setSelectionRange(0, 99999);

}
