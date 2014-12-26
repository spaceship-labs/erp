(function () {
    var controller = function($scope,$http){
        console.log('Hello world');
    };
    controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                object : '=',
                resourceURL : '&',
            },
            templateUrl : '/template/find/deleteButton.html'
        };
    };
    app.directive('deleteButton', directive);

}());