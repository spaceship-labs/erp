(function () {
	var controller = function($scope,$http){
		$scope.breadcrumb =  breadcrumb;
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        	},
        	templateUrl : '/template/find/breadcrumb.html'
        };
    };
    app.directive('breadcrumb', directive);

}());
