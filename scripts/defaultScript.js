$(function(){
  $("#header").load("/page_contents/header.html");
  $("#footer").load("/page_contents/footer.html");
});

function goTo(url) {
    $('.topnav-btn').css('pointer-events', 'none');
    $('.topnav-btn.active').removeClass('active');
    $('.topnav').toggleClass('expanded');
    $('.main').toggleClass('visible');
    setTimeout(function() {
        window.location.href = url;
    }, 1000);
}
