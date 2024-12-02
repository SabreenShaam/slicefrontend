app.factory('bookings', function ($http) {
    return {
        getBookings: function (page, parameters) {
            var url = "/v1/bookings/booking-list";
            if (page != null) {
                url = url + "?page=" + page
            }
            if (parameters != null){
                if (page != null) {
                    url = url + "&" + parameters;
                } else {
                    url = url + "?" + parameters;
                }

            }
            return $http.get(url).then(
                function (result) {
                    return result.data;
                }
            );
        },

        searchBookings: function (parameters) {
            return $http.get("/v1/bookings/booking-list?" + parameters).then(
                function (result) {
                    return result.data;
                }
            );
        },
        getStudios: function () {
            return $http.get("/v1/studios/studio-list").then(
                function (result) {
                    return result.data;
                }
            );
        }
    };
});

app.factory('PagerService', PagerService);

function PagerService() {
    // service definition
    var service = {};

    service.GetPager = GetPager;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 25;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 5 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 4) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 3;
                endPage = currentPage + 2;
            }
        }
        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize + 1;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems);

        // create an array of pages to ng-repeat in the pager control
        //var pages = _.range(startPage, endPage + 1);
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages,
        };
    }
};




app.factory('studioBookings', function ($http) {
    return {
        getBookings: function (page, parameters) {
           // alert(parameters);
            var url = "/v1/bookings/booking-list";
            if (page != null) {
                url = url + "?page=" + page
            }
            if (parameters != null){
                if (page != null) {
                    url = url + "&" + parameters;
                } else {
                    url = url + "?" + parameters;
                }

            }
            return $http.get(url).then(
                function (result) {
                    return result.data;
                }
            );
        },
    };
});





