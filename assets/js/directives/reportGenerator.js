(function () {
	var controller = function($scope,$http,$rootScope){
        $scope.object = $scope.object || {};
        $scope.label = $rootScope.lang=='es'?'label':'label_en';
        $scope.translates = $rootScope.translates;
	};
	controller.$inject = ['$scope','$http','$rootScope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '='
        	},
        	templateUrl : '/template/find/reportGenerator.html'
        };
    };
    app.directive('reportGenerator', directive);

}());
