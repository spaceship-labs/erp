(function () {
	var controller = function($scope,$http){
        moment.lang('es');
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.labels = [];
        $scope.periods = [
            {label:'Mensual',slug:'month'},
            {label:'Anual',slug:'year'},
        ];
        $scope.series = ['Tours', 'Hoteles', 'Traslados'];    
        $scope.data = new Array([],[],[]);
        $scope.chartDate = moment().startOf('month').toDate();
        $scope.total = 0;

        $scope.setTimePeriods = function(period){    
            if(period){
                if(period == 'year'){                
                    $scope.format = 'yyyy';                 
                    $scope.labels = [];
                    $scope.chartDate = moment($scope.chartDate).startOf('year').toDate();
                    for(var i=0;i<12;i++){
                        $scope.labels.push(moment().month(i).format("MMMM"));    
                    } 
                }
                else if(period == 'month'){
                    $scope.format = 'yyyy-MM';
                    var firstDay = moment($scope.chartDate);
                    var lastDay = moment(firstDay).endOf('month');
                    var monthDaysCount =  lastDay.diff(firstDay, 'days') + 1; 
                    $scope.labels = [];
                    for(var d=1; d<monthDaysCount+1; d++){
                        $scope.labels.push(d.toString());
                    }
                }
                $scope.onChangeDate($scope.chartDate);
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    minMode: period
                };
            }
        }

        $scope.onChangeDate = function(chartDate){
            if($scope.period.slug == 'year'){
                $scope.fillYearData(chartDate);                             
            }
            else if($scope.period.slug == 'month'){
                $scope.fillMonthData(chartDate);
            }
        }

        $scope.fillYearData = function(chartDate){
            var selectedDate = moment(chartDate);
            var params = {
                year : selectedDate.year()
            };
            $http.post('/reservation/statsCategoriesInYear',params).success(function(response){
                $scope.data = [];
                angular.forEach(response,function(category){
                    $scope.data.push(category);                    
                });
                //$scope.calculateTotal($scope.data);
            });
        }

        $scope.fillMonthData = function(chartDate){
            var selectedDate = moment(chartDate);
            var end = moment(selectedDate).endOf('month');
            var params = {
                start : selectedDate.toDate(),
                end : end.toDate()
            };
            $http.post('/reservation/statsCategoriesInMonth',params).success(function(response){
                $scope.data = new Array([],[],[]);
                for(var i= 0; i<3;i++){
                    for(var j = 0;j<$scope.labels.length;j++){
                        $scope.data[i][j] = 0;
                    }
                }
                var numericIndex = 0;
                angular.forEach(response, function(cat,index) {
                    angular.forEach(cat, function(reservation,i) {
                        if(reservation.order){
                            if(reservation.order.createdAt){
                                for(var d=1; d<$scope.labels.length+1; d++){
                                    var dayOfMonth = moment(reservation.order.createdAt).format('DD');
                                    if(parseInt(dayOfMonth) == d){
                                        $scope.data[numericIndex][d-1] = $scope.data[numericIndex][d-1]+1;
                                    }
                                }
                            }
                        }
                    });
                    numericIndex++;
                });
                //$scope.calculateTotal($scope.data);
            });
        }

        $scope.calculateTotal = function(data){
            $scope.total = 0;
            console.log(data);
            for(var arr in data){
                console.log(arr);
                for (var item in arr){
                    console.log(item);
                    $scope.total+=item;
                }
            }
        }

        $scope.setDefaults = function(){ 
            $scope.period = $scope.periods[0]            
            $scope.setTimePeriods($scope.period.slug);
            $scope.format = 'yyyy-MM';
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1,
                minMode: $scope.period.slug
            }; 
        }

        $scope.openDatePicker = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        }; 

        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };

        $scope.$watch('chartDate', function (newVal, oldVal) {
            if(newVal != oldVal){
                $scope.onChangeDate(newVal);
            }
        });
        $scope.setDefaults();
       
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                object : '=',
                fields : '=', 
                chartTitle : '@',
                onMonthChange : '&'               
        	},
        	templateUrl : '/template/find/timeLineChart.html'          
        };
    };
    app.directive('timeLineChart', directive);

}());