(function () {
	var controller = function($scope,$http){
		//$console.log($scope.month,$scope.year);
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                month : '&',
                year : '&',
        	},
        	templateUrl : '/template/find/calendarMonth.html'
        };
    };
    app.directive('calendarMonth', directive);

}());
