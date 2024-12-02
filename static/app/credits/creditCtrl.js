app.controller("ExternalCreditListCtrl", function ($scope, $log, services) {

    services.getServices().then(function (data) {

        $scope.services = data;
    });

    setTimeout(function () {
        $scope.$apply(function () {
            $scope.loading = true;
        });
    }, 200);
});


app.controller("ExternalCreditCtrl", function ($scope, $http, $log, $mdDialog, passportStudios) {
    $scope.CreditIncrement = function (id) {
        var newVal = Number($("#qty_service" + id).val()) + 1;
        $("#qty_service" + id).val(newVal);

    };

    $scope.CreditDecrement = function (id) {
        //alert($("#qty_service"+id).val());
        var newVal = Number($("#qty_service" + id).val()) - 1;
        if (newVal < 0) {
            newVal = 0;
        }
        $("#qty_service" + id).val(newVal);
    };

    $scope.MaxIncrement = function (id) {
        //alert($("#qty_service"+id).val());
        var newVal = Number($("#qty_max_per_service" + id).val()) + 1;
        if (newVal <= Number($("#qty_service" + id).val())) {
            $("#qty_max_per_service" + id).val(newVal);
        }
    };
    $scope.MaxDecrement = function (id) {
        //alert($("#qty_service"+id).val());
        var newVal = Number($("#qty_max_per_service" + id).val()) - 1;
        if (newVal < 0) {
            newVal = 0;
        }
        $("#qty_max_per_service" + id).val(newVal);
    };

    $scope.submit = function (id, event) {
        event.target.blur();
        $scope.qty_service = Number($("#qty_service" + id).val());
        $scope.qty_max_per_service = Number($("#qty_max_per_service" + id).val());


        if ($scope.qty_max_per_service <= $scope.qty_service) {
            //alert($scope.qty_max_per_service);
            $http({
                method: 'POST',
                url: '/v1/studios/update/service-list',
                data: {
                    id: Number(id),
                    count: $scope.qty_service,
                    max_per_count: $scope.qty_max_per_service,
                    //studio: $scope.studio
                }
            })
                .then(function (response) {
                    if (response.status == 200) {
                        $('#message-alert').html("");
                        $('#message-alert').append("<div id='message-bar' class='alert alert-success alert-dismissible'" +
                            " role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
                            "<span aria-hidden='true'>&times;</span></button><strong>Success!</strong> " +
                            "Your changes have been updated.</div>");
                        $('#message-alert').show().delay(5000).fadeOut();
                    }
                });
        }
        else {
            $('#message-alert').append("<div id='message-bar' class='alert alert-danger alert-dismissible' " +
                "role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'>" +
                "<span aria-hidden='true'>&times;</span></button>Max Per studio cannot be greater than External Credits!</div>");
            $('#message-alert').show().delay(5000).fadeOut();

        }

    };

    $scope.onChange = function (id) {
        $http({
            method: 'POST',
            url: '/v1/studios/update/service-list',
            data: {
                id: Number(id),
                state: $scope.on_off_switch,
                //studio: $scope.studio
            }
        })
            .then(function (response) {
                if (response.status == 200) {
                    $('#message-alert').append("<div id='message-bar' class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success!</strong> Your changes have been updated.</div>");
                    $('#message-alert').show().delay(5000).fadeOut();
                }
            });
    };


    $scope.init = function (state) {
        if (state == 'true') {
            $scope.on_off_switch = true;
        }
        else {
            $scope.on_off_switch = false;
        }
    };

    $scope.OpenExternalStudioList = function (ev, id, passportName) {

        passportStudios.getPassportStudioAccessList(id).then(function (data) {
            $scope.passportStudioAccessList = data;
            $scope.passportName = passportName;
        });

        $scope.status = '  ';
        $scope.customFullscreen = false;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'passport-studio-access.html',
            scope: $scope,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            preserveScope: true,
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

    $scope.update = function (passport_access_id, has_access) {
        //alert(has_access);

        var newVal = false;
        if (has_access == true) {
            //alert('true');
            newVal = false
        }
        if (has_access == false) {
            //alert('false');
            newVal = true
        }

        passportStudios.updatePassportStudioAccess(passport_access_id, newVal);
    };

});


