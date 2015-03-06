(function () {
	var controller = function($scope){
        moment.lang('es');

        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.labels = [];
        $scope.periods = [
            {label:'Mensual',slug:'monthly'},
            {label:'Anual',slug:'yearly'},
        ];

        $scope.series = ['Tours', 'Hoteles', 'Traslados'];    
        $scope.data = new Array([],[],[]);


        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.setTimePeriods = function(period){    
            if(period == 'yearly'){
                $scope.labels = [];
                for(var i=0;i<12;i++){
                    $scope.labels.push(moment().month(i).format("MMMM"));    
                }                 
            }
            else if(period == 'monthly'){
                var monthDaysCount = new Date(2015, 2, 0).getDate();
                $scope.labels = [];
                for(var d=1; d<monthDaysCount+1; d++){
                    $scope.labels.push(d.toString());
                }                              
            }

            //TODO llenar con valores reales
            var randomN;
            var maximum = 20;
            var minimum = 0;
            $scope.data = new Array([],[],[]);
            angular.forEach($scope.series, function(serie,index) {
                for(var d=1; d<$scope.labels.length+1; d++){
                    randomN = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                    $scope.data[index].push(randomN);
                }
            });
        }

        $scope.setDefaults = function(){ 
            $scope.selectedDate = moment().month(2).format('MMMM YYYY');          
            $scope.defaultPeriod = $scope.periods[0]            
            $scope.setTimePeriods($scope.defaultPeriod.slug);

            //Provisional
            $scope.minDate = $scope.minDate ? null : new Date();
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };            
        }

        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
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