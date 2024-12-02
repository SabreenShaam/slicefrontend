app.filter('removeSeconds', [function(){
    return function(time) {
        var lastIndex = time.lastIndexOf(":");
        formatedTime = time.substring(0, lastIndex);
        return formatedTime
    };
}]);