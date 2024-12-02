app.controller('footerCtrl', function ($scope, $mdDialog) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            template: $('#terms').html(),
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function (answer) {
                //$scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                //$scope.status = 'You cancelled the dialog.';
            });
    };


    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
    }
});