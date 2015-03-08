(function () {
	var controller = function($scope){
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.chartType = $scope.chartType || 'Pie';
        $scope.chartLabels = $scope.chartLabels || ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.chartData = $scope.chartData || [300, 500, 100];
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
                chartTitle : '@',
                chartData : '=',
                chartLabels: '=',               
        	},
        	templateUrl : '/template/find/statisticsChart.html'          
        };
    };
    app.directive('statisticsChart', directive);

}());