document.title = 'Fun! - ' + document.title;
$('#topnav-fun').toggleClass('active');

function goToGame(url) {
  $('.cell').css('pointer-events', 'none');
  goTo(url);
}
