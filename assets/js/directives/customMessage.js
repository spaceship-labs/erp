(function () {
    var controller = function($scope,$http){
        $scope.saveClass = 'fa-save';
        $scope.reverseClass = 'fa-search';
        $scope.messages = $scope.messages || [];
        $scope.closethis = function(message){
            message.show = false;
        };
        $scope.getExtraMessage = function(message){
            if(message.type=='alert')
                return "Favor de revisar los campos antes de continuar";
            if(message.tyoe=='warning')
                return "Si todo está correcto ignora este mensage";
        }
    };

    controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                messages : '=',
            },
            templateUrl : '/template/find/customMessage.html'
        };
    };
    app.directive('customMessage', directive);
}());