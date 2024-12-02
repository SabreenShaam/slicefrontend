$('#search-btn').click(function () {
    spanElement = $(this).find('span');
    if (spanElement.hasClass('glyphicon-chevron-up')) {
        spanElement.removeClass('glyphicon-chevron-up');
    }
    else {
        spanElement.addClass('glyphicon-chevron-up');
    }
});
