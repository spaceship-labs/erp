(function () {
	var controller = function($scope, $http){
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.chartType = $scope.chartType || 'Pie';
        $scope.notFound = $scope.notFound || 'No results found';
        $scope.format = 'dd-MM-yyyy';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
        };
        $scope.opened = false;

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
        $scope.toggleDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = !$scope.opened;
        }; 

        $scope.$watch('chartDate', function (newVal, oldVal) {
            if(newVal != oldVal){
                $scope.getData();
            }
        });

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
                notFound : '@'                                             
        	},
        	templateUrl : '/template/find/dayStatsChart.html'          
        };
    };
    app.directive('dayStatsChart', directive);

}());