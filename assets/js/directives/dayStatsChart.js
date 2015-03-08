(function () {
	var controller = function($scope, $http){
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.chartType = $scope.chartType || 'Pie';
        //$scope.format = 'dd-MM-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
        }; 

        $scope.chartDate = $scope.dayDate || new Date();

        $scope.getData = function(){
            $scope.chartLabels = $scope.chartLabels || ["Label A", "Label B", "Label C"];
            $scope.chartData = $scope.chartData || [300, 500, 100];
            $scope.series = ["Generic serie"];
            if($scope.chartDataMethod){
                params = {day : $scope.chartDate}
                $http.post($scope.chartDataMethod,params).success(function(response){
                    $scope.chartData = response;
                }).error(function(data, status, headers, config) {
                    console.log(status);
                });
            }
        }
        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        }; 

        $scope.$watch('chartDate', function (newVal, oldVal) {
            if(newVal != oldVal){
                $scope.getData();
            }
        });        

        $scope.getData();
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                chartType : '@',
                object : '=',
                fields : '=', 
                chartTitle : '@',
                chartDataMethod : '@',
                chartLabels : '=',
                dayDate : '=',
                dayPicker : '=',              
        	},
        	templateUrl : '/template/find/dayStatsChart.html'          
        };
    };
    app.directive('dayStatsChart', directive);

}());