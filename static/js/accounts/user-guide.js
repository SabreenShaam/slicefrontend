$(document).ready(function () {

    /* ===== Affix Sidebar ===== */
    /* Ref: http://getbootstrap.com/javascript/#affix-examples */


    $('#doc-menu').affix({
        offset: {
            //top: ($('#header').outerHeight(true) + $('#doc-header').outerHeight(true)) + 45,
            top: 10,
            //bottom: ($('#footer').outerHeight(true) + $('#promo-block').outerHeight(true)) + 75
        }
    });

    /* Activate scrollspy menu */
    $('body').scrollspy({target: '#doc-nav', offset: 120});

    /* Smooth scrolling */
    $('a.scrollto').on('click', function (e) {
        //store hash
        var target = this.hash;
        e.preventDefault();
        $('body').scrollTo(target, 800, {offset: -100, 'axis': 'y'});
    });

    /* Hack related to: https://github.com/twbs/bootstrap/issues/10236 */
    $(window).on('load resize', function () {
        $(window).trigger('scroll');
    });
});