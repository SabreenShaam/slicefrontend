app.controller("studioAccessListCtrl", function ($scope, $log, studio) {
    //$scope.products = studio.getAccessList();
    studio.getAccessList().then(function (data) {
        $scope.products = data;
    });

    $scope.update = function (product) {
        studio.updateStudioAccess(product.id, product.has_access);
    };

    $scope.toggle = function (item, list) {
        if (!$scope.products[0].has_access)
            $scope.products[0].has_access = false;
        console.log($scope.products[0].name);

        if (!$scope.products[1].has_access)
            $scope.products[1].has_access = false;
        console.log($scope.products[0].name);
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.isChecked = function () {
        return $scope.products[0].has_access == true && $scope.products[1].has_access;
    };

    $scope.isIndeterminate = function () {
        return ($scope.products[0].has_access !== $scope.products[1].has_access);
    };

    $scope.toggleAll = function () {
        if ($scope.products[0].has_access)
            $scope.products[0].has_access = false;

        if ($scope.products[1].has_access)
            $scope.products[1].has_access = false;
    };

    setTimeout(function () {
        $scope.$apply(function () {
            $scope.loading = true;
        });
    }, 200);
});

//app.controller("passportStudioAccessListCtrl", function ($scope, $log, passports) {
//    //$scope.products = studio.getAccessList();
//    passports.getPassportStudioAccessList().then(function (data) {
//        $scope.passport_items = data;
//    });
//
//    $scope.update = function (id, state) {
//        var newVal = false;
//        if (state == true) {
//            //alert('true');
//            newVal = false
//        }
//        if (state == false) {
//            //alert('false');
//            newVal = true
//        }
//        //alert(id);
//        //alert(newVal);
//        passports.updatePassportStudioAccess(id, newVal);
//    };
//
//    $scope.OnclickPassportButton = function ($id) {
//        var x = document.getElementById("#service_studios" + $id);
//        if (x.style.display === 'none') {
//            x.style.display = 'block';
//        } else {
//            x.style.display = 'none';
//        }
//    };
//
//
//});


