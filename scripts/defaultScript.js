$(function(){
  $("#header").load("/page_contents/header.html");
  $("#footer").load("/page_contents/footer.html");
});

function goto(url) {
    $('.topnav-btn.active').removeClass('active');
    $('.topnav').toggleClass('expanded');
    setTimeout(function() {
        window.location.href = url;
    }, 1000);
}
