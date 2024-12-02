var app = angular.module("mainApp", ['ngMaterial', 'ngMessages']);

app.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .accentPalette('blue');
});

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);