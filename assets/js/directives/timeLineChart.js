(function () {
	var controller = function($scope){
    /*
        Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
    */
    $scope.labels = [];
    var monthDaysCount = new Date(2015, 3, 0).getDate();
    console.log(monthDaysCount);
    for(var d=1; d<monthDaysCount+1; d++){
        $scope.labels.push(d.toString());
    }
    $scope.series = ['Tours', 'Hoteles', 'Traslados'];    
    $scope.data = new Array([],[],[]);
    var randomN;
    var maximum = 20;
    var minimum = 0;
    angular.forEach($scope.series, function(serie,index) {
        for(var d=1; d<monthDaysCount+1; d++){
            randomN = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
            $scope.data[index].push(randomN);
        }
    });

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

	};
	controller.$inject = ['$scope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                object : '=',
                fields : '=', 
                chartTitle : '@'               
        	},
        	templateUrl : '/template/find/timeLineChart.html'          
        };
    };
    app.directive('timeLineChart', directive);

}());