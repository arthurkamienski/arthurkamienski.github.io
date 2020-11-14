document.title = 'Research - ' + document.title;

function showAbstract(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex");
  var btn     = $("#" + id + " .abstract-btn");
  
  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "block");
    bibtex.css("display", "none");
    btn.css("background-color", "lightgrey");
  } else {
    if(abst.css("display") == "none") {
      abst.css("display", "block");
      bibtex.css("display", "none");
      btn.css("background-color", "lightgrey");
    } else {
      abst.css("display", "none");
      infoDir.css("display", "none");
      btn.css("background-color", "");
    }
  }
}

function showBib(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex"); 
  var btn     = $("#" + id + " .bibtex-btn");

  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "none");
    bibtex.css("display", "block");
    btn.css("background-color", "lightgrey");
  } else {
    if(bibtex.css("display") == "none") {
      abst.css("display", "none");
      bibtex.css("display", "block");
      btn.css("background-color", "lightgrey");
    } else {
      bibtex.css("display", "none");
      infoDir.css("display", "none");
      btn.css("background-color", "");
    }
  }
}

function showInfo(id) {
  var infoDir = $("#" + id + " .add-info"); 
}
