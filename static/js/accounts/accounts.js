//var myApp = angular
//    .module("mainApp", [])


app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

app.controller("bankDetailsCtrl", function ($scope, $http, account) {

    account.getAccountInfo().then(function (data) {
        $scope.accountName = data.acc_name;
        $scope.accountNum = data.acc_num;
        $scope.sortCode = data.sort_code;
        //$scope.bookings = data;
    });
    $scope.submit = function () {
        $http({
            method: 'POST',
            url: '/v1/accounts/user/account',
            data: {
                accountName: $scope.accountName,
                accountNum: $scope.accountNum,
                sortCode: $scope.sortCode,
                //studio: $scope.studio
            }
        })
            .then(function (response) {
                var code = response.data.code;
                var message = response.data.message;
                if (code == 200) {
                    //alert('success');
                    $('#message-bar').empty();
                    $('#message-bar').show().delay(5000).fadeOut();
                    $('#message-bar').append("<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
                    $('#message-bar').append("<strong>Success!</strong> Your changes have been updated.");

                }
            });

    };
});

app.factory('account', function ($http) {
    return {
        getAccountInfo: function () {
            return $http.get("/v1/accounts/get/user-account").then(
                function (result) {
                    return result.data;
                }
            );
        }
    };
});





//$(document).ready(function() { /* Ajax call */
////alert('document ready');
//    ajax_call()
//});
//
//
//
//function ajax_call() {
//    $.ajax({
//        url: '/v1/accounts/get/user-account',
//        type: 'get',
//        data: {req: ''},
//
//        // handle a successful response
//        success: function (json) {
//            //alert(json.acc_name);
//            $('#accountName').val(json.acc_name);
//            $('#accountNum').val(json.acc_num);
//            $('#sortCode').val(json.sort_code);
//        },
//
//        // handle a non-successful response
//        error: function (xhr, errmsg, err) {
//            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
//                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
//            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
//        }
//    })
//}