document.title = 'Contact - ' + document.title;

function copyEmail(d) {
    var emailInput = $(d).find("input")[0];
    emailInput.select()
    emailInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
}
