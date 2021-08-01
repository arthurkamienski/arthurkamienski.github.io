async function toggleInfo(id, info) {
  var infoDir = $("#" + id + " .add-info");
  var content = $("#" + id + " .add-info ." + info);

  if (content.css('maxHeight') != '0px') {
    content.css({transition:''});
    await new Promise(r => setTimeout(r, 10));
    content.css('maxHeight', content.prop('scrollHeight') + 'px');
    await new Promise(r => setTimeout(r, 10));
    content.css('transition', 'max-height 1s ease-in-out');
    await new Promise(r => setTimeout(r, 10));
    content.css('maxHeight', '0px');
    infoDir.toggleClass('visible');
    await new Promise(r => setTimeout(r, 1000));
  } else {
    infoDir.toggleClass('visible');
    content.css('transition', 'max-height 1s ease-in-out');
    await new Promise(r => setTimeout(r, 10));
    content.css('maxHeight', content.prop('scrollHeight') + 'px');
    await new Promise(r => setTimeout(r, 1000));
    content.css({transition:''});
    content.css('maxHeight', '100%');
  }
}

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

async function expand(id) {
  var div = $('#' + id);
  var icon = $('#' + id + "-icon")
  var btn = $('#' + id + "-expand-button");

  btn.css('pointer-events', 'none');

  if (div.css('maxHeight') != '0px') {
    div.css({transition:''});
    await new Promise(r => setTimeout(r, 10));
    div.css('maxHeight', div.prop('scrollHeight') + 'px');
    await new Promise(r => setTimeout(r, 10));
    div.css('transition', 'max-height 2s ease-in-out');
    div.css('maxHeight', '0px');
    await new Promise(r => setTimeout(r, 2000));
    icon.text('\u2795');
  } else {
    icon.text('\u2796');
    div.css('transition', 'max-height 2s ease-in-out');
    await new Promise(r => setTimeout(r, 10));
    div.css('maxHeight', div.prop('scrollHeight') + 'px');
    await new Promise(r => setTimeout(r, 2000));
    div.css({transition:''});
    div.css('maxHeight', '100%');
  }

  btn.css('pointer-events', 'auto');
}

async function moveTo(id) {
  var toFocus = $('#' + id);

  if(toFocus.closest('.collapsible').css('maxHeight') == '0px') {
    expand(toFocus.closest('.collapsible').attr('id'));
    await new Promise(r => setTimeout(r, 500));
  }

  $([document.documentElement, document.body]).animate({
    scrollTop: $("#" + id + "-anchor").offset().top
  }, 1000);


  setTimeout(function() {
    toFocus.toggleClass("hovered");

    setTimeout(function() {
      toFocus.toggleClass("hovered");
      toFocus.toggleClass("unhover");

      setTimeout(function() {
        toFocus.toggleClass("unhover");
      }, 1000);
    }, 3000);
  }, 500);
}
