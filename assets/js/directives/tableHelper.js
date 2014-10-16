(function () {
	var controller = function($scope,$http){
		$scope.objects = [
            {
                name : 'fml',
                id : '1',
            },
            {
                name : 'fml1',
                id : '2',
            },
        ]
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
