(function () {
	var controller = function($scope){
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.chartType = $scope.chartType || 'Pie';
        $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.data = [300, 500, 100];
        $scope.series = ["Generic serie"];

	};
	controller.$inject = ['$scope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                chartType : '@',
                object : '=',
                fields : '=', 
                chartTitle : '@'               
        	},
        	templateUrl : '/template/find/statisticsChart.html'          
        };
    };
    app.directive('statisticsChart', directive);

}());