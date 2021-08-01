async function expandElement(e, t) {
  e.css('maxHeight', e.prop('scrollHeight') + 'px');
  await new Promise(r => setTimeout(r, t*1000));
}

async function collapseElement(e, t) {
  e.css('maxHeight', '0px');
  await new Promise(r => setTimeout(r, t*1000));
}

async function toggleInfo(id, info) {
  var parent = $(`#${id}`);
  var infoDir = parent.children('.add-info');
  var content = infoDir.children(`.${info}`);
  var buttonCont = parent.find('.button-container');

  buttonCont.children('.button').each(function() {
    if (!$(this).hasClass(`${info}-btn`)) {
      $(this).removeClass('selected');
    } else {
      $(this).toggleClass('selected');
    }
    $(this).css('pointer-events', 'none');
  });

  var toClose = null;

  infoDir.children().each(function() {
    if (!$(this).hasClass(`${info}`)) {
      if ($(this).css('maxHeight') != '0px') {
        toClose = $(this);
      }
    }
  });

  if (toClose !== null) {
    await collapseElement(toClose, 1);
  } else {
    infoDir.toggleClass('visible');
  }

  if (content.css('maxHeight') != '0px') {
    await collapseElement(content, 1);
  } else {
    await expandElement(content, 1);
  }

  buttonCont.children('.button').each(function() {
    $(this).css('pointer-events', 'auto');
  });
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
  var div = $(`#${id}`);
  var icon = $(`#${id}-icon`);
  var btn = $(`#${id}-expand-button`);

  btn.css('pointer-events', 'none');

  if (div.css('maxHeight') != '0px') {
    div.css('transition', '');
    await new Promise(r => setTimeout(r, 20));
    div.css('maxHeight', div.prop('scrollHeight') + 'px');
    await new Promise(r => setTimeout(r, 20));
    div.css('transition', `max-height 2s ease-in-out`);
    await new Promise(r => setTimeout(r, 20));
    await collapseElement(div, 2);
    icon.text('\u2795');
  } else {
    icon.text('\u2796');
    await expandElement(div, 2);
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
