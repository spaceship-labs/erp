(function () {
	var controller = function($scope){

    $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    $scope.data = [300, 500, 100];
    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

	};
	controller.$inject = ['$scope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        	},
        	templateUrl : '/template/find/statisticsChart.html'
        };
    };
    app.directive('statisticsChart', directive);

}());