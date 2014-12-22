(function () {
	var controller = function($scope,$http){
        var monthLabels = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        var monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];
        var dateObj =  new Date($scope.year,$scope.month,1);  
        $scope.label = monthLabels[$scope.month];
        $scope.monthEnd = monthEnds[$scope.month];
        $scope.firstDay = dateObj.getDay(); 
        $scope.weeks = [];
        
        var prevMonthEnd = monthEnds[$scope.month -1] || 31 ;
        var prevMonthStart = prevMonthEnd - $scope.firstDay + 1;
        var d = 1;
        var w = 0;
        //Aqui armamos un arreglo multi-dimensional "$scope.weeks" que representa nuestro mes
        while(d < $scope.monthEnd){
            var week = {days:[]};
            //si es la primera semana rellenamos primero con los dias libres
            if(w == 0){
                for(var i=prevMonthStart; i<=prevMonthEnd;i++)
                    week.days.push(i);  
                for(var i=1;i< 8-($scope.firstDay);i++) 
                    week.days.push(i);
                d = week.days[6];
            }else{
                var start = $scope.weeks[w-1].days[$scope.weeks[w-1].days.length-1]+1;
                var end = start + 6;
                //si nos pasamos del fin del mes recortamos
                end = end <= $scope.monthEnd ? end : $scope.monthEnd;
                for(var i=start;i<=end;i++) week.days.push(i);
                //si llegamos a fin de mes metemos los dias del mes que sigue para rellenar
                if(end == $scope.monthEnd){
                    var end2 = 7 - week.days.length;
                    for(var i=1;i<=end2;i++) week.days.push(i);
                    d = $scope.monthEnd;
                }else{
                    d = week.days[6];
                }
            }
            $scope.weeks[w++] = week;
        }


        /*
        
        for (var i=$scope.secondWeek[$scope.secondWeek.length-1]+1;i< $scope.secondWeek[$scope.secondWeek.length-1]+8;i++) $scope.thirdWeek.push(i);
        for (var i=$scope.thirdWeek[$scope.thirdWeek.length-1]+1;i< $scope.thirdWeek[$scope.thirdWeek.length-1]+8;i++) $scope.fourthWeek.push(i);*/
        

        
        //Scope Functions


	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                month : '=',
                year : '=',
        	},
        	templateUrl : '/template/find/calendarMonth.html'
        };
    };
    app.directive('calendarMonth', directive);

}());
