app.factory('services', function ($http) {
    return {
        getServices: function () {
            return $http.get("/v1/studios/service-list").then(
                function (result) {
                    return result.data;
                }
            );
        },
    };
});


app.factory('passportStudios', function ($http) {
    return {
        getPassportStudioAccessList: function (id) {
            //alert(id);
            return $http.get("/v1/studios/passport/"+id+"/studio-list").then(
                function (result) {
                    //alert('data:' + result.data);
                    return result.data;
                    //alert('data:' + result.data);
                }
            );
        },

        updatePassportStudioAccess: function (passportStudioAccessId, isAccessible) {
            updateUrl = "/v1/studios/passport/" + passportStudioAccessId + "/studio-list";

            var req = {
                method: 'POST',
                url: updateUrl,
                params: {
                    is_accessible: isAccessible,
                }
            };

            $http(req).then(function(data){
                var result = data;
                //$('#message-alert').append("<div id='message-bar' class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success!</strong> Your changes have been updated.</div>");
                //$('#message-alert').show().delay(5000).fadeOut();
            });
        }
    };
});
