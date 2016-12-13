$(".banner-text").click(function() {

    var defaultAnchorOffset = 0;

    var anchor = $(this).attr('data-target');

    $('html,body').animate({
        scrollTop: $(anchor).offset().top
    }, 500);
    return false;
});
