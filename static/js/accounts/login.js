var myApp = angular
    .module("mainApp", [])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .controller("loginCtrl", function ($scope, $http, $window, $log) {
        $scope.submit = function () {
            //$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
            $('#message-bar').remove();
            var is_valid = validate_login_fields($scope.username, $scope.password);

            if (is_valid) {
                $http({
                    method: 'POST',
                    url: '/v1/accounts/login',
                    data: {
                        email: $scope.username,
                        password: $scope.password,
                        //studio: $scope.studio
                    }
                })
                    .then(function (response) {
                        var code = response.data.code;
                        var message = response.data.message;
                        $('#message-bar').remove();
                        if (code == 400) {
                            $('<div id="message-bar" class="alert alert-danger" role="alert">' + message + '</div>').hide().prependTo('#staff-login-form').slideDown();
                        }
                        else if (code == 200) {
                            //alert($window.location.href)
                            //$("#studio-name").append("<br><p style='color:#ffffff; font-weight: bold;'>"+name+"</p>");
                            $log.log($window.location.href);
                            $window.location.href = '/'
                        }
                    });
            }
        };
    });

//$(function(){
//    $('#staff-login-form').on('submit', function(event){
//        event.preventDefault();
//        console.log('form submitted');
//        login()
//    });
//});

$('#staff-login-modal').on('hidden.bs.modal', function () {
    $('#staff-login-email').val("");
    $('#staff-login-password').val("");
    $('#id_studios').val("");
    $('#message-bar').remove();
});

function login() {
    var email = $('#staff-login-email').val();
    var password = $('#staff-login-password').val();
    var studio = $('#id_studios').val();
    $('#message-bar').remove();
    var is_valid = validate_login_fields(email, password)

    if (is_valid) {
        ajax_call(email, password, studio);
    }
}


function ajax_call(email, password, studio) {
    var bad_request = 400;
    var success_request = 200;

    $.ajax({
        url: '../login/',
        type: 'POST',
        data: {email: email, password: password, studio: studio},

        // handle a successful response
        success: function (json) {
            $('#message-bar').remove();
            if (json.code == bad_request) {
                $('<div id="message-bar" class="alert alert-danger" role="alert">' + json.message + '</div>').hide().prependTo('#staff-login-form').slideDown();
            } else if (json.code == success_request) {
                window.location.href = 'classes'
            }
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    })
}

function validate_login_fields(email, password) {
    if (typeof email == 'undefined') {
        $('<div id="message-bar" class="alert alert-danger" role="alert">' + "User name needed" + '</div>').hide().prependTo('#staff-login-form').slideDown();
        return false;
    }
    else if (typeof password == 'undefined') {
        $('<div id="message-bar" class="alert alert-danger" role="alert">' + "Password needed" + '</div>').hide().prependTo('#staff-login-form').slideDown();
        return false;
    }
    return true;
}