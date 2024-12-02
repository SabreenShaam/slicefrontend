$(document).ready(function () {
    set_date();
    set_current_date_heading();
});


function get_class_list(input_text) {

    waitingDialog.show();
    var input_string = input_text;
    $.ajax({
        url: "/class-list/",
        type: "GET",
        dataType: "json",
        data: {
            search_date: input_string,
            csrfmiddlewaretoken: '{{ csrf_token }}'
        },
        success: function (data) {
            $('#classListDiv').empty();
            if (data.response_list.length == 0) {
                $("#classList-ul").append("<h3 class='list-group-item-heading alert alert-info '>No Classes Found</h3>");

            }

            for (i = 0; i < data.response_list.length; i++) {
                id = 'classList-div' + i
                var start_time = formatAMPM(data.response_list[i].start_time);

                var end_time = formatAMPM(data.response_list[i].end_time);

                $('#classListDiv').append("<div class='ng-scope ng-isolate-scope'><div class='panel panel-class'><div class='row panel-heading'>" + "<div id=" + id + "  class='row panel-heading'></div></div></div>");
                id_pointer = "#" + id
                $(id_pointer).append("<div class='col-time'><p class='start-time ng-binding'>" + start_time + "</p>" + "<p class='end-time ng-binding'>" + end_time + "</p></div>");
                $(id_pointer).append("<div class='col-name'><div class='inline-block-name'><p class='class-name ng-binding'>" + data.response_list[i].name + "</p><p class='teacher-name ng-binding'>" + data.response_list[i].staff.name + "</p></div></div>");

                if (data.response_list[i].cancellation == 1) {
                    $(id_pointer).append("<div class='col-actions'> <div class='btn-group pull-right'>" + "<a  class='btn btn-rounded btn-thin btn-cancel'  href='/delete/" + data.response_list[i].id + "/date/" + data.response_list[i].start_date + "' data-confirm='Are you sure you want to delete?'>Cancel</a></div></div>");
                }
                else {
                    $(id_pointer).append("<div class='col-actions'> <div class='btn-group pull-right'>" + "<a class='btn btn-rounded btn-thin btn-cancel'  disabled='disabled' role=button>Cancel</a></div></div>");
                }

            }

            waitingDialog.hide()


        },
        error: function (xhr, errmsg, err) {
            alert(err)
            alert(xhr.status + ": " + xhr.responseText);
        }
    });
}


function set_date() {
    var selected_date = getToday();
    $("#date-picker").attr("data-date", selected_date);
    var date_str = month_date(new Date());
    $("#date-picker").val(date_str);
    if (location.href != null) {
        var url_spilt = location.href.split('/');
        date_value = url_spilt[url_spilt.length - 1];
        var regexNum = /\d/g;// Global check for numbers
        var c = regexNum.test(date_value);
        if (c) {
            $("#date-picker").val(date_str);
        }
    }
}
function get_next_date() {
    var date_str = $("#date-picker").attr("data-date");
    var cur_date = new Date(date_str);
    var next_date = getTomorrow(cur_date, 1);
    var next_date_str = convertDate(next_date);

    $("#date-picker").attr("data-date", next_date_str);
    $("#date-picker").val(month_date(next_date));
    set_current_date_heading(next_date);
    get_class_list(next_date_str);
}

function get_prev_date() {
    var date_str = $("#date-picker").attr("data-date");
    var cur_date = new Date(date_str);
    var prev_date = getYesterday(cur_date, 1);
    var prev_date_str = convertDate(prev_date);

    $("#date-picker").attr("data-date", prev_date_str);
    $("#date-picker").val(month_date(prev_date));
    set_current_date_heading(prev_date);
    get_class_list(prev_date_str);
}

function getTomorrow(d, offset) {
    if (!offset) {
        offset = 1;
    }
    if (typeof(d) === "string") {
        var t = d.split("-");
        /* splits dd-mm-year */
        d = new Date(t[2], t[1] - 1, t[0]);
        //  d = new Date(t[2],t[1] - 1, t[0] + 2000); /* for dd-mm-yy */
    }
    return new Date(d.setDate(d.getDate() + offset));
}

function getYesterday(d, offset) {
    if (!offset) {
        offset = 1;
    }
    if (typeof(d) === "string") {
        var t = d.split("-");
        /* splits dd-mm-year */
        d = new Date(t[2], t[1] - 1, t[0]);
        //  d = new Date(t[2],t[1] - 1, t[0] + 2000); /* for dd-mm-yy */
    }
    return new Date(d.setDate(d.getDate() - offset));
}

function convertDate(inputFormat) {
    function pad(s) {
        return (s < 10) ? '0' + s : s;
    }

    var d = new Date(inputFormat);
    return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/');
}

function getToday() {
    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = d.getFullYear() + '/' +
        (month < 10 ? '0' : '') + month + '/' +
        (day < 10 ? '0' : '') + day;
    return output;
}

$(function () {
    $("#date-picker").datepicker({
        format: 'M d',
        orientation: 'top right',
        immediateUpdates: 'true',
        todayHighlight: 'true'
    });

    $("#date-picker").on('changeDate', function (ev) {
        if (ev != null) {
            get_class_list(convertDate(ev.date));
        }
        $(this).datepicker('hide');
    });
});

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function set_current_date_heading(d) {
    if (!d) {
        d = new Date();
    }
    var date = d.getDate();
    var day = days[d.getDay()];
    var month = months[d.getMonth()];
    var year = d.getFullYear()

    var date_str = day + " " + month + " " + pad(date) + ", " + year;
    $(".current-date span").text(date_str);
}

function pad(s) {
    return (s < 10) ? '0' + s : s;
}

function month_date(d) {
    var month = months[d.getMonth()];
    var date = d.getDate();
    var str = month + " " + pad(date);
    return str;
}


function formatAMPM(date) {
    //alert(date);
    var dsplit = date.split(":");
    //alert(dsplit[0]);
    //alert(dsplit[1]);
    var hours = dsplit[0];
    var minutes = dsplit[1];
    var ampm = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 && minutes != 0 ? '0' + minutes : minutes;
    var strTime = hours < 10 ? '0' + hours + ':' + minutes + ' ' + ampm : hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

