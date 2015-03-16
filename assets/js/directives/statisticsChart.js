(function () {
	var controller = function($scope){
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.chartType = $scope.chartType || 'Pie';
        $scope.notFound = $scope.notFound || 'No results found';        
        $scope.chartLabels = $scope.chartLabels || ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
        $scope.chartData = $scope.chartData || [300, 500, 100];
        $scope.series = ["Generic serie"];
        
        $scope.isEmpty = function(arr){
            if(arr && arr instanceof Array){
                for(var i=0;i<arr.length;i++){
                    if(arr[i] && arr[i]!=0){
                        return false;
                    }
                }
            }
            return true;
        }  
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
                notFound : '@'                       	
            },
        	templateUrl : '/template/find/statisticsChart.html'          
        };
    };
    app.directive('statisticsChart', directive);

}());
