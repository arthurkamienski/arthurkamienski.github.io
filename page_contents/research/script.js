document.title = 'Research - ' + document.title;

function showAbstract(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex");
  var bibBtn  = $("#" + id + " .bib-btn");
  var absBtn  = $("#" + id + " .abstract-btn");
  
  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "block");
    bibtex.css("display", "none");
    absBtn.css("background-color", "lightgrey");
    bibBtn.css("background-color", "");
  } else {
    if(abst.css("display") == "none") {
      abst.css("display", "block");
      bibtex.css("display", "none");
      absBtn.css("background-color", "lightgrey");
      bibBtn.css("background-color", "");
    } else {
      abst.css("display", "none");
      infoDir.css("display", "none");
      absBtn.css("background-color", "");
    }
  }
}

function showBib(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var abst    = $("#" + id + " .abstract"); 
  var bibtex  = $("#" + id + " .bibtex"); 
  var bibBtn  = $("#" + id + " .bib-btn");
  var absBtn  = $("#" + id + " .abstract-btn");

  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    abst.css("display", "none");
    bibtex.css("display", "block");
    absBtn.css("background-color", "");
    bibBtn.css("background-color", "lightgrey");
  } else {
    if(bibtex.css("display") == "none") {
      abst.css("display", "none");
      bibtex.css("display", "block");
      absBtn.css("background-color", "");
      bibBtn.css("background-color", "lightgrey");
    } else {
      bibtex.css("display", "none");
      infoDir.css("display", "none");
      bibBtn.css("background-color", "");
    }
  }
}

function showInfo(id) {
  var infoDir = $("#" + id + " .add-info"); 
  var btn     = $("#" + id + " .info-btn");

  if (infoDir.css("display") == "none") {
    infoDir.css("display", "block");
    btn.css("background-color", "lightgrey");
  } else {
    infoDir.css("display", "none");
    btn.css("background-color", "");
  }
}

function moveTo(id) {
  $([document.documentElement, document.body]).animate({
    scrollTop: $("#" + id + "-anchor").offset().top
  }, 1000);


  setTimeout(function() {
    $("#" + id).toggleClass("hovered");

    setTimeout(function() {
      $("#" + id).toggleClass("hovered");
      $("#" + id).toggleClass("unhover");

      setTimeout(function() {
        $("#" + id).toggleClass("unhover");
      }, 1000);
    }, 3000);
  }, 500);
}

function expand(id) {
  var div = $('#' + id);
  var icon = $('#' + id + "-icon")

  if (div.css('maxHeight') != '0%') {
    div.css('maxHeight', '0%');
    icon.text('&#2796;')
  } else {
    div.css('maxHeight', "100%");
    icon.text('&#02795;')
  }
}
