var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

app.config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return shortMonths[date.getMonth()] + " " + pad(date.getDate());
        };
    }
);

app.controller("classListCtrl", function ($scope, $mdDialog, $log, classes) {
        $scope.currentDate = set_current_date_heading();
        var d = new Date();
        $scope.date = d;


        $scope.activated = false;
        $scope.onDateChange = function () {
            $scope.activated = true;
            load_classes();
        };


        classes.getClasses($scope).then(function (result_data) {
            $scope.classes = result_data;
            $scope.activated = false;
        });

        $scope.GetPrevClass = function () {
            $scope.activated = true;
            var d = new Date($scope.date);
            d.setDate($scope.date.getDate() - 1);
            $scope.date = d;
            load_classes();
        };

        $scope.GetNextClass = function () {
            $scope.activated = true;
            var d = new Date($scope.date);
            d.setDate($scope.date.getDate() + 1);
            $scope.date = d;
            load_classes();
        };


        function load_classes() {
            var date = $scope.date.getFullYear() + '-' + ($scope.date.getMonth() + 1) + '-' + $scope.date.getDate();
            //alert(date);
            $scope.classes = [];
            $scope.currentDate = '';
            classes.getFilteredClasses(date).then(function (data) {
                $scope.classes = data;
                $scope.activated = false;
                $scope.currentDate = set_current_date_heading($scope.date);
            });

            //$("#current_date").text(set_current_date_heading($scope.date));
        }


        $scope.cancel = function (ev, $id, $date) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Confirmation')
                .textContent('Are you sure want to cancel this class?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function (ev) {
                $scope.activated = true;
                classes.cancelClass($id, $scope).then(function (result_data) {
                    if (result_data.code == 100010) {
                        $('#but_' + $id).attr("disabled", "true");

                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Succcess')
                                .textContent("Class has been successfully cancelled from fitopia")
                                .ariaLabel('Fitopia Alert')
                                .ok('Ok!')
                                .targetEvent(ev)
                        );

                        $scope.activated = false;
                    }
                    else if(result_data.code == 100020){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .clickOutsideToClose(true)
                                .title('Fitopia Alert!')
                                .textContent(result_data.message)
                                .ariaLabel('Fitopia Alert')
                                .ok('Ok')
                                .targetEvent(ev)
                        );
                        $scope.activated = false;
                    };
                });
                $scope.currentDate = set_current_date_heading(new Date($date));
            }, function () {

            });

        };

        setTimeout(function () {
            $scope.$apply(function () {
                //$scope.activated = true;
            });
        }, 200);
    }
);

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function set_current_date_heading(d) {
    if (!d) {
        d = new Date();
    }
    var date = d.getDate();
    var day = days[d.getDay()];
    var month = months[d.getMonth()];
    var year = d.getFullYear()

    var date_str = day + " " + month + " " + pad(date) + ", " + year;
    return date_str;
}


function pad(s) {
    return (s < 10) ? '0' + s : s;
}