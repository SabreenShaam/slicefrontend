var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

app.config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return shortMonths[date.getMonth()] + " " + pad(date.getDate());
        };
    }
);


app.controller("studioBookingsCtrl", function ($scope, $log, studioBookings, PagerService) {
    var self = this;
    self.pager = {};
    self.setPage = setPage;
    var query_params = {};

    var today = new Date();
    self.today = today;
    var tempDate = new Date();

    $scope.start_date = new Date(today.getFullYear(), today.getMonth(), 1);
    tempDate.setDate(today.getDate() - 365);
    $scope.startMinDate = tempDate;//alert(tempDate);
    tempDate.setDate(today.getDate() - 1);
    $scope.startMaxDate = today;//alert(tempDate);
    tempDate.setDate(today.getDate() - 10);
    $scope.endMinDate = tempDate;//alert(tempDate);

    var d = new Date();
    d.setDate(today.getDate());
    $scope.endMaxDate = today;
    $scope.end_date = d;
    $scope.init = function (name) {
        $scope.activated = true;
        //self.studio_name = name;
        //alert(studio_name);
        query_params["home_studio"] = name;
        query_params["class_studio"] = name;

        if ($scope.start_date != null) {
            query_params["start_date"] = get_date($scope.start_date);
        }

        if ($scope.end_date != null) {
            query_params["end_date"] = get_date($scope.end_date);
        }


        setBookings();

    };

    $scope.initExternalBookings = function (name) {
        $scope.activated = true;
        //self.studio_name = name;
        //alert(studio_name);
        query_params["ex_home_studio"] = name;
        query_params["class_studio"] = name;

        if ($scope.start_date != null) {
            query_params["start_date"] = get_date($scope.start_date);
        }

        if ($scope.end_date != null) {
            query_params["end_date"] = get_date($scope.end_date);
        }

        $scope.InitInOutVal = 'in';
        self.selected_val = 'in';
        $scope.isIn = 1;
        setBookings();
    };


    $scope.GetExternalBookings = function ($studio_name) {
        //alert($scope.InitInOutVal);
        $scope.activated = true;
        query_params = {};
        $val = $scope.InitInOutVal;
        //alert($val);
        self.selected_val = $val;
        if ($val == 'in') {
            $scope.isIn = 1;
            if ($scope.start_date != null) {
                query_params["start_date"] = get_date($scope.start_date);
            }

            if ($scope.end_date != null) {
                query_params["end_date"] = get_date($scope.end_date);
            }

            //alert(studio_name);
            query_params["ex_home_studio"] = $studio_name;
            query_params["class_studio"] = $studio_name;
            //$('#th_email').hide();
            //$('#td_email').hide();

        }

        if ($val == 'out') {
            //alert('out');
            $scope.isIn = 0;
            if ($scope.start_date != null) {
                query_params["start_date"] = get_date($scope.start_date);
            }

            if ($scope.end_date != null) {
                query_params["end_date"] = get_date($scope.end_date);
            }
            //alert(studio_name);
            query_params["home_studio"] = $studio_name;
            query_params["ex_class_studio"] = $studio_name;
            query_params["is_out"] = true;
            //$('#th_email').show();
            //$('#td_email').show();
        }

        setBookings();
    };

    $scope.Search = function (name) {
        $scope.activated = true;
        query_params = {};
        query_params["home_studio"] = name;
        query_params["class_studio"] = name;
        if ($scope.start_date != null) {
            query_params["start_date"] = get_date($scope.start_date);
        }

        if ($scope.end_date != null) {
            query_params["end_date"] = get_date($scope.end_date);
        }

        setBookings();
    };

    $scope.onStartDateChange = function () {
        var date = new Date($scope.start_date);
        $scope.endMinDate = date;//alert(tempDate);
        $scope.endMaxDate = self.today;
    };

    $scope.SearchExternalBookings = function ($studio_name) {
        $scope.activated = true;
        query_params = {};
        if ($scope.start_date != null) {
            query_params["start_date"] = get_date($scope.start_date);
        }

        if ($scope.end_date != null) {
            query_params["end_date"] = get_date($scope.end_date);
        }

        if (self.selected_val == 'in') {
            $scope.isIn = 1;
            //alert(studio_name);
            query_params["ex_home_studio"] = $studio_name;
            query_params["class_studio"] = $studio_name;
            //$('#th_email').hide();
            //$('#td_email').hide();

        }

        if (self.selected_val == 'out') {
            $scope.isIn = 0;
            //alert(studio_name);
            query_params["home_studio"] = $studio_name;
            query_params["ex_class_studio"] = $studio_name;
            query_params["is_out"] = true;
            //$('#th_email').show();
            //$('#td_email').show();
        }
        setBookings();
    };


    function get_date(d) {
        var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        return date;
    }

    function setBookings() {
        query_params['is_cancelled'] = '0'; // always get is_canceled= False bookings
        var querystring = EncodeQueryData(query_params);
        self.queryString = querystring;
        //alert(self.queryString);
        studioBookings.getBookings(null, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.bookings = data.bookings;
            self.bookings = data.bookings;
            initPager();
            $scope.activated = false;
        });
    }

    function initPager() {
        // initialize to page 1
        self.pager = PagerService.GetPager(self.count, 1);
    }

    function setPage(page) {
        if (page < 1 || page > self.pager.totalPages) {
            return;
        }

        // get pager object from service
        self.pager = PagerService.GetPager(self.count, page);

        // get current page of items
        studioBookings.getBookings(page, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.bookings = data.bookings;
            self.bookings = data.bookings;
        });
    }


    $scope.downloadCSV = function (args) {
        $scope.activated = true;
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: self.bookings,
            option: self.selected_val,
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        $scope.activated = false;
    };

    function get_table_valid_source(cln_source2){
        var deleterows = [];
            $(cln_source2.childNodes[1].rows).each(function (ri, row) {
                var deletecells = [];
                $(row.cells).each(function (ci, cell) {
                    if ($(cell).hasClass('no_export'))
                        deletecells.push(ci);
                });
                $.each(deletecells.reverse(), function (i, ii) {
                    row.deleteCell(ii);
                });
                if ($(row).hasClass('omitted-row'))
                    deleterows.push(ri);

            });
            $.each(deleterows.reverse(), function (i, ii) {
                cln_source2.childNodes[1].deleteRow(ii);
            });
    };

    $scope.downloadPdf = function (args) {
        $scope.activated = true;
        filename = args.filename || 'export.pdf';
        var pdf = new jsPDF('p', 'pt', 'a4');
        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.

        if (self.selected_val == 'in') {
            //alert(self.selected_val);
            source = $('#booking_tbl')[0];
            copied_source = source.cloneNode(true);
            get_table_valid_source(copied_source);
        }

        else if (self.selected_val == 'out') {
            source = $('#booking_tbl2')[0];
            copied_source = source.cloneNode(true);
            get_table_valid_source(copied_source);

        }
        else{
            copied_source = $('#booking_tbl')[0];
        }
        // we support special element handlers. Register them with jQuery-style
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors
        // (class, of compound) at this time.
        specialElementHandlers = {
            'printHeaders': true,
        };
        margins = {
            top: 50,
            bottom: 160,
            left: 20,
            width: 600
        };
        imgData = "data:image/png;base64,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";

        pdf.addImage(imgData, 'PNG', 5, 5, 20, 20);

        pdf.setFontSize(10);
        if (args.type == 'in') {
            pdf.text(20, 40, "Internal Bookings");
        }

        else if (args.type == 'ext') {
            pdf.text(10, 40, "External Bookings");
        }
        pdf.setFontSize(8);
        pdf.text(385, 40, self.today.toString() + "  Page " + args.page);
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            copied_source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, { // y coord
                'width': margins.width, // max width of content on PDF
                'elementHandlers': specialElementHandlers
            },

            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                pdf.save(filename + '.pdf');
            }, margins);
        $scope.activated = false;
    };

});


function EncodeQueryData(data) {
    var ret = [];
    for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
}

function pad(s) {
    return (s < 10) ? '0' + s : s;
}