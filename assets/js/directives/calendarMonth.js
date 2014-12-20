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
            $scope.weeks[w] = [];
            //si es la primera semana rellenamos primero con los dias libres
            if(w == 0){
                for(var i=prevMonthStart; i<=prevMonthEnd;i++)
                    $scope.weeks[w].push(i);  
                for(var i=1;i< 8-($scope.firstDay);i++) 
                    $scope.weeks[w].push(i);
                d = $scope.weeks[w][$scope.weeks[w].length-1];
            }else{
                var start = $scope.weeks[w-1][$scope.weeks[w-1].length-1]+1;
                var end = start + 6;
                //si nos pasamos del fin del mes recortamos
                end = end <= $scope.monthEnd ? end : $scope.monthEnd;
                for(var i=start;i<=end;i++) $scope.weeks[w].push(i);
                //si llegamos a fin de mes metemos los dias del mes que sigue para rellenar
                if(end == $scope.monthEnd){
                    var end2 = 7 - $scope.weeks[w].length;
                    for(var i=1;i<=end2;i++) $scope.weeks[w].push(i);
                    d = $scope.monthEnd;
                }else{
                    d = $scope.weeks[w][$scope.weeks[w].length-1];
                }
            }
            w++;
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
