(function () {
	var controller = function($scope,$http){
        $scope.monthLabels = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
		//$console.log($scope.month,$scope.year);
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                month : '=',
                year : '=',
        	},
        	templateUrl : '/template/find/calendarMonth.html'
        };
    };
    app.directive('calendarMonth', directive);

}());
