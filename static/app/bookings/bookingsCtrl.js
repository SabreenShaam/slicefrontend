app.controller("bookingsCtrl", function ($scope, $log, bookings, PagerService) {
    var self = this;
    self.readonly = true;
    self.removable = true;

    this.addedColumns = [];
    $scope.columnsPool = ['home_studio', 'class_name', 'class_studio', 'booking_date', 'class_start_date', 'class_start_time'];

    this.addColumn = function (index) {
        $log.info('Added ' + index);
        this.addedColumns.push($scope.columnsPool[index]);
        $scope.columnsPool.splice(index, 1);
    };

    self.removeColumn = function (chip) {
        $log.info('Removed ' + chip);
        $scope.columnsPool.push(chip);
    };

    $scope.showCell = function (field) {
        var found = false;
        for (var i = 0; i < self.addedColumns.length; i++) {
            if (self.addedColumns[i] == field) {
                found = true;
            }
        }
        return found;
    };

    $scope.getColumnValue = function (booking, column) {
        return booking[column];
    };


    //bookings.getBookings().then(function (data) {
    //    $scope.bookings = data;
    //});

    //bookings.getStudios().then(function (data) {
    //    $scope.studios = data;
    //});

    bookings.getStudios().then(function (data) {
        $scope.studios = data;
    });

    $scope.submit = function () {

        var query_params = {
            'user_email': $scope.useremail,
            'first_name': $scope.firstname,
            'last_name': $scope.lastname,
            'is_cancelled': $scope.iscancelled,
            'late_cancelled': $scope.islatecancelled,
            'signed_in': $scope.issignedin,
        };

        if ($scope.start_date != null){
            query_params["start_date"] = get_date($scope.start_date);
        }

        if ($scope.end_date != null){
            query_params["end_date"] = get_date($scope.end_date);
        }

        if (typeof $scope.homeselected != 'undefined') {
            //alert($scope.homeselected.name);
            query_params["home_studio"] = $scope.homeselected.name
        }

        if (typeof $scope.otherselected != 'undefined') {
            //alert($scope.otherselected.name);
            query_params["class_studio"] = $scope.otherselected.name

        }

        for (var index in query_params) {
            if (typeof query_params[index] == 'undefined') {
                delete query_params[index];
            }
            if (query_params[index] == true) {

                query_params[index] = 1;
            }

            if (query_params[index] == false) {
                delete query_params[index];
            }
        }

        var querystring = EncodeQueryData(query_params);
        self.queryString = querystring;
        //alert(self.queryString);
        $scope.activated = true;
        bookings.getBookings(null, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.bookings = data.bookings;
            initPager();
            $scope.activated = false;
        });
    };


    function get_date(d){
        var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        return date;
    }

    self.pager = {};
    self.setPage = setPage;
    $scope.activated = true;
    bookings.getBookings().then(function (data) {
        self.count = data.count;
        $scope.bookings = data.bookings;
        initPager();
        $scope.activated = false;
    });

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
        $scope.activated = true;
        // get current page of items
        bookings.getBookings(page, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.bookings = data.bookings;
            $scope.activated = false;
        });
    }
});

function EncodeQueryData(data) {
    var ret = [];
    for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
}

app.filter('removeUnderscores', function () {
    return function (input) {
        var Uscore = input.replace(/_/g, ' ');
        return (!!Uscore) ? Uscore.charAt(0).toUpperCase() + Uscore.substr(1).toLowerCase() : '';

    };
});
