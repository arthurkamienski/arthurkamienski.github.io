document.title = 'Research - ' + document.title;

function showAbstract(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex"); 
  
  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "block");
    bibtex.css("display", "none");
  } else {
    if(abst.css("display") == "none") {
      abst.css("display", "block");
      bibtex.css("display", "none");
    } else {
      abst.css("display", "none");
    }
  }
}

function showBibtex(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex"); 

  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "none");
    bibtex.css("display", "block");
  } else {
    if(bibtex.css("display") == "none") {
      abst.css("display", "none");
      bibtex.css("display", "block");
    } else {
      bibtex.css("display", "none");
    }
  }
}

function showInfo(id) {
  var infoDir = $("#" + id + " .add-info"); 
}
