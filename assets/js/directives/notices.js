(function () {
	var controller = function($scope,$upload,$http){
		
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
                app : '=',
                apps : '=',
        	},
        	templateUrl : '/template/find/notices.html'
        };
    };
    app.directive('notices', directive);

}());
