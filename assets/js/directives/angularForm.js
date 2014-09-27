(function () {
	var controller = function($scope,$upload,$http){
		
	};
	controller.$inject = ['$scope', '$upload','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
        		updateMethod : '@',
        		deleteMethod : '@',
        		imageAttr : '@',
        		dir : '@',
        	},
        	templateUrl : '/template/find/angularForm.html'
        };
    };
    app.directive('angularForm', directive);

}());
