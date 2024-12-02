app.controller("viewUserListCtrl", function ($scope, $log, users, PagerService) {
    var self = this;
    //users.getUsers().then(function (data) {
    //    $scope.users = data;
    //});

    users.getStudios().then(function (data) {
        $scope.studios = data;
    });

    $scope.submit = function () {

        var query_params = {'email': $scope.useremail, 'first_name': $scope.firstname, 'last_name': $scope.lastname};

        if (typeof $scope.homeselected != 'undefined') {
            //alert($scope.homeselected.name);
            query_params["studio"] = $scope.homeselected.name
        }

        for (var index in query_params) {
            if (typeof query_params[index] == 'undefined') {
                delete query_params[index];
            }
        }

        var querystring = EncodeQueryData(query_params);
        self.queryString = querystring;
        users.getUsers(null, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.users = data.users;
            initPager();
        });


    };

    self.pager = {};
    self.setPage = setPage;

    users.getUsers().then(function (data) {
        self.count = data.count;
        $scope.users = data.users;
        initPager();
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

        // get current page of items
        users.getUsers(page, self.queryString).then(function (data) {
            self.count = data.count;
            $scope.users = data.users;
        });
    }


    setTimeout(function () {
        $scope.$apply(function () {
            $scope.loading = true;
        });
    }, 200);
});


//app.factory('users', function ($http) {
//    return {
//        getUsers: function () {
//            return $http.get("/v1/studios/user-list").then(
//                function (result) {
//                    return result.data;
//                }
//            );
//        },
//        searchUsers: function (parameters) {
//            //alert(parameters);
//            return $http.get("/v1/studios/user-list?" + parameters).then(
//                function (result) {
//                    return result.data;
//                }
//            );
//        },
//        getStudios: function () {
//            return $http.get("/v1/studios/studio-list").then(
//                function (result) {
//                    return result.data;
//                }
//            );
//        }
//    };
//});


function EncodeQueryData(data) {
    var ret = [];
    for (var d in data)
        ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
}