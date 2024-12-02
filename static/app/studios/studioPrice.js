app.controller("studioPriceCtrl", function ($scope, $log, StudioPriceService) {
    StudioPriceService.getPrices().then(function (data) {
        $scope.studio_pricings = data;
    });

    $scope.initVal = function (price) {
         $scope.price = price;
    };
});


app.directive('priceInput', function ($timeout, StudioPriceService) {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            type: '@type',
            id: '='
        },
        replace: true,
        transclude: false,

        template: '<div class="center-item">' +
        '<h5 ng-show="!editState"><span title="Transfer Price">{{model}}</span></h5>' +
        '<input class="inputText" type="text"  numbers-only ng-model="localModel" step="0.01" required ng-show="editState && type == \'inputText\'" />' +
        '<span ng-click="toggle()" class="edit-pencil glyphicon glyphicon-pencil" title="Edit" ng-show="!editState"></span>' +
        '<span ng-click="cancel()" class="cancel-icon glyphicon glyphicon-remove" title="Cancel" ng-show="editState"></span>' +
        '<span ng-click="save({{id}})" class="save-icon glyphicon glyphicon-ok" title="Save" ng-show="editState"></span>' +
        '</div>',
        link: function (scope, element, attrs) {
            scope.editState = false;

            scope.localModel = scope.model;
            scope.save = function (id) {
                //alert( scope.model);

                scope.model = scope.localModel;
                // alert(scope.model);
                StudioPriceService.updateStudioPrice(id, scope.model).then(function (data) {
                    scope.toggle();
                });
            };

            scope.cancel = function () {
                scope.localModel = scope.model;
                scope.toggle();
            };
            scope.toggle = function () {
                scope.editState = !scope.editState;
                var x1 = element[0].querySelector("." + scope.type);
                $timeout(function () {
                    scope.editState ? x1.focus() : x1.blur();
                }, 0);
            }
        }
    }
});


app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(number) {

                if (number) {
                    if (isNaN(number)) {

                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                    }

                    var transformedInput = number.replace(/[^0-9\.]+(^[0-9]{1,2})?$/, "");

                    var with2Decimals = transformedInput.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];


                    if (with2Decimals !== number) {
                        ngModelCtrl.$setViewValue(with2Decimals);
                        ngModelCtrl.$render();
                    }

                    return with2Decimals.toString();
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});




