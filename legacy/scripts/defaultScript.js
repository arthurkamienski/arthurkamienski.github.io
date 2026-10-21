$(function(){
  $("#header").load("/legacy/page_contents/header.html");
  $("#footer").load("/legacy/page_contents/footer.html");
});

function goToTopnav(url) {
    $('.topnav-btn').css('pointer-events', 'none');
    $('.topnav-btn.active').removeClass('active');
    $('.topnav').toggleClass('expanded');
    goTo(url);
}

function goTo(url) {
    $('.main').toggleClass('visible');
    setTimeout(function() {
        window.location.href = url;
    }, 1000);
}
