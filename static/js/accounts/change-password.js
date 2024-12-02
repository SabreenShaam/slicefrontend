$('#message-bar').hide();


//var app = angular.module('mainApp', []);
//app.config(['$httpProvider', function ($httpProvider) {
//        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
//        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
//    }]);

app.controller('changePasswordCtrl', ['$scope', function ($scope) {
    $scope.password = null;
    $scope.confirmPassword = null;
    }
]);

//app.controller('bankDetailsCtrl', ['$scope', function ($scope) {
//    $scope.accountName = null;
//    $scope.accountNum = null;
//    $scope.sortCode = null;
//    }
//]);


app.controller("changePasswordCtrl", function ($scope, $http, $window, $log) {
    $scope.submit = function () {

        $http({
            method: 'POST',
            url: '/v1/accounts/change-password',
            data: {
                password: $scope.password,
            }
        })
            .then(function (response) {
                $('#message-bar').empty();
                $('#message-bar').show();
                $('#message-bar').append("<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
                $('#message-bar').append("<strong>Success!</strong> Your changes have been updated.");
                //$log.log($window.location.href);
                //$window.location.href = '/logout';
            });


}});

app.directive('passwordConfirm', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        scope: {
            matchTarget: '=',
        },
        require: 'ngModel',
        link: function link(scope, elem, attrs, ctrl) {
            var validator = function (value) {
                ctrl.$setValidity('match', value === scope.matchTarget);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);

            // This is to force validator when the original password gets changed
            scope.$watch('matchTarget', function (newval, oldval) {
                validator(ctrl.$viewValue);
            });

        }
    };
}]);
