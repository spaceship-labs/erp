(function () {
    var controller = function($scope,$http){
        //
    };

    controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                company : '='
                ,prices : '='
            },
            templateUrl : '/template/find/customTablePrices.html'
        };
    };
    app.directive('customTablePrices', directive);
}());