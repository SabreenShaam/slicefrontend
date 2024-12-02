app.factory('classes', function ($http) {
    return {

        getClasses: function ($scope) {
            $scope.activated = true;
            return $http.get("/v1/studios/class-list").then(
                function (result) {
                    return result.data;
                }
            );
        },

        getFilteredClasses: function (date) {
            return $http.get("/v1/studios/class-list?date=" + date).then(
                function (result) {
                    return result.data;
                }
            );
        },

        cancelClass: function (id, $scope) {
            $scope.activated = true;
            $url = "/v1/studios/class/" + id + "/cancel";
            return $http.post($url).then(
                function (result) {
                    return result.data;
                }
            );
        },
    };
});