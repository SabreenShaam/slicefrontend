$('#search-btn').click(function () {
    spanElement = $(this).find('span');
    if (spanElement.hasClass('glyphicon-chevron-up')) {
        spanElement.removeClass('glyphicon-chevron-up');
    }
    else {
        spanElement.addClass('glyphicon-chevron-up');
    }
});


function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = ['email', 'first_name', 'booking_date', 'class_name', 'class_start_date', 'class_start_time', 'cancelled', 'late_cancelled', 'signed_in', 'home_studio', 'class_studio'];

    if (args.option == 'in') {
        keys.pop('email');
    }

    result = '';
    var headers = [];

    for (var i = 0; i < keys.length; i++) {
        headers[i] = keys[i].replace('_', ' ').toUpperCase();
    }
    result += headers.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}
