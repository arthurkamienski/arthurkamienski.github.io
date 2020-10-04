document.title = 'Contact - ' + document.title;

function copyEmail(d) {
    var emailInput = $(d).find("input")[0];
    navigator.clipboard.writeText(emailInput.value.replace('[at]', '@'));
}
