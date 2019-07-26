$(".banner-text").click(function() {

    let defaultAnchorOffset = 0;

    const anchor = $(this).attr('data-target');

    $('html,body').animate({
        scrollTop: $(anchor).offset().top
    }, 500);
    return false;
});
