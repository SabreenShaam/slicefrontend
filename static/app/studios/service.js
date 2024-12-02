app.factory('studio', function ($http) {
    return {

        getAccessList: function () {
            return $http.get("/v1/studios/access-list").then(
                function (result) {
                    return result.data;
                }
            );
        },

        updateStudioAccess: function (id, has_access) {
            updateUrl = "/v1/studios/access/" + id;

            var req = {
                method: 'POST',
                url: updateUrl,
                params: {
                    has_access: has_access
                }
            };

            $http(req).then(function (data) {
                var result = data
                $('#message-alert').append("<div id='message-bar' class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success!</strong> Your changes have been updated.</div>");
                $('#message-alert').show().delay(5000).fadeOut();
            });
        }
    };
});


app.factory('users', function ($http) {
    return {
        getUsers: function (page, parameters) {
            var url = "/v1/studios/user-list";
            if (page != null) {
                url = url + "?page=" + page
            }
            if (parameters != null) {
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

        searchUsers: function (parameters) {
            return $http.get("/v1/studios/user-list?" + parameters).then(
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


app.factory('StudioPriceService', function ($http) {
    return {
        getPrices: function () {
            return $http.get("/v1/studios/price").then(
                function (result) {
                    return result.data;
                }
            );
        },
        updateStudioPrice: function (id, price) {
            updateUrl = "/v1/studios/price";

            var req = {
                method: 'POST',
                url: updateUrl,
                params: {
                    id: id.toString(),
                    price: price.toString(),
                }
            };

            return $http(req).then(function (result) {
                //alert(result.data);
                return result.data;
            });
        }
    };
});
