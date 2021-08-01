async function expandElement(e, t) {
  e.css('transition', `max-height ${t}s ease-in-out`);
  await new Promise(r => setTimeout(r, 10));
  e.css('maxHeight', e.prop('scrollHeight') + 'px');
  await new Promise(r => setTimeout(r, t*1000));
  e.css({transition:''});
  await new Promise(r => setTimeout(r, 10));
  e.css('maxHeight', '100%');
}

async function collapseElement(e, t) {
  e.css({transition:''});
  await new Promise(r => setTimeout(r, 10));
  e.css('maxHeight', e.prop('scrollHeight') + 'px');
  await new Promise(r => setTimeout(r, 10));
  e.css('transition', `max-height ${t}s ease-in-out`);
  await new Promise(r => setTimeout(r, 10));
  e.css('maxHeight', '0px');
  await new Promise(r => setTimeout(r, t*1000));
}

async function toggleInfo(id, info) {
  var parent = $(`#${id}`);
  var infoDir = parent.children('.add-info');
  var content = infoDir.children(`.${info}`);
  var btn = parent.children(`.${info}-btn`);

  parent.children('.button').each(function() {
    $(this).removeClass('selected');
  })

  btn.toggleClass('selected');
  btn.css('pointer-events', 'none');

  infoDir.children().each(function() {
    if ($(this).css('maxHeight') != '0px') {
      collapseElement($(this), 1);
    }
  })

  if (content.css('maxHeight') != '0px') {
    collapseElement(content, 1);
    infoDir.toggleClass('visible');
  } else {
    infoDir.toggleClass('visible');
    expandElement(content, 1);
  }
  
  btn.css('pointer-events', 'auto');
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
    collapseElement(div, 2);
    icon.text('\u2795');
  } else {
    icon.text('\u2796');
    expandElement(div, 2);
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
