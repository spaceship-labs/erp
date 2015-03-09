(function () {
	var controller = function($scope,$http){
        moment.lang('es');
        /*
            Available chartTypes : Line, Bar, Radar, Doughnut, Pie, PolarArea
        */
        $scope.labels = [];
        $scope.chartType = $scope.chartType || 'Line';
        $scope.periods = [
            {label:'Mensual',slug:'month'},
            {label:'Anual',slug:'year'},
        ];
        $scope.series = $scope.chartSeries || ['Serie A', 'Serie B', 'Serie C'];    
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
                $scope.pickerPeriod = period || 'month';
                $scope.onChangeDate($scope.chartDate);
                $scope.dateOptions = {
                    formatYear: 'yyyy',
                    startingDay: 1,
                    minMode: $scope.pickerPeriod
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
            $http.post($scope.chartDataMethodYear,params).success(function(response){
                $scope.data = [];
                console.log(response);
                angular.forEach(response,function(category){
                    $scope.data.push(category);                    
                });
                //$scope.calculateTotal($scope.data);
            });
        }

        $scope.fillMonthData = function(chartDate){
            var params = {
                start : chartDate,
            };
            $http.post($scope.chartDataMethodMonth,params).success(function(response){
                $scope.data = new Array([],[],[]);
                $scope.data = response;
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
                chartType : '@',
                chartDataMethodMonth : '@',
                chartDataMethodYear : '@',               
                chartLabels : '=',
                chartSeries : '='              
        	},
        	templateUrl : '/template/find/timeLineChart.html'          
        };
    };
    app.directive('timeLineChart', directive);

}());