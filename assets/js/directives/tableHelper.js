(function () {
	var controller = function($scope,$http){
		
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		objects : '=',
                columns : '=',
                route : '@'
        	},
        	templateUrl : '/template/find/tableHelper.html'
        };
    };
    app.directive('tableHelper', directive);

}());
