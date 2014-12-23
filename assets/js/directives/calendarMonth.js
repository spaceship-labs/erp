(function () {
	var controller = function($scope,$http){   
        $scope.getLineClass = function(line){
            return 'start'+line.start+' end'+line.end;
        }
        $scope.isDayInSeason = function(day){
            var d = new Date($scope.year,$scope.month,day);
            for(x in $scope.seasons){
                var season = $scope.seasons[x];
                var s = new Date(season.start);
                var e = new Date(season.end);
                //console.log(d.getTime(),$scope.year,$scope.month,day);
                if((d.getTime() >= s.getTime()) && (d.getTime() <= e.getTime())){
                    //console.log('match'+d.getTime()+' : '+e.getTime());
                    return x;
                }
            }
            return false;
        }
        $scope.insertDay = function(week,day){
            week.days.push(day);
            var season = $scope.isDayInSeason(day);
            if(season){
                season = parseInt(season);
                var lineIndex = false;
                for(x in week.lines){
                    if(season === week.lines[x].season) lineIndex = x;
                };
                if(!lineIndex){
                    //var index = week.lines[0].season ? week.lines.length || 0;
                    week.lines[week.lines.length] = {
                        season : season,
                        start : week.days.length-1, 
                        end : week.days.length-1,
                    }
                }else{
                    week.lines[lineIndex].end = week.days.length-1;
                }
            }
        }
        $scope.initialize = function(){
            var monthLabels = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
            var monthEnds = [31,28,31,30,31,30,31,31,30,31,30,31];
            var dateObj =  new Date($scope.year,$scope.month,1);  
            $scope.label = monthLabels[$scope.month];
            $scope.monthEnd = monthEnds[$scope.month];
            $scope.firstDay = dateObj.getDay(); 
            $scope.weeks = [];
            var prevMonthEnd = monthEnds[$scope.month -1] || 31;
            var prevMonthStart = prevMonthEnd - $scope.firstDay + 1;
            var d = 1;
            var w = 0;
            //Aqui armamos un arreglo multi-dimensional "$scope.weeks" que representa nuestro mes
            while(d < $scope.monthEnd){
                var week = {days:[],lines:[]};
                //si es la primera semana rellenamos primero con los dias libres
                if(w == 0){
                    for(var i=prevMonthStart; i<=prevMonthEnd;i++) week.days.push(i);  
                    for(var i=1;i< 8-($scope.firstDay);i++) $scope.insertDay(week,i);
                    d = week.days[6];
                }else{
                    var start = $scope.weeks[w-1].days[$scope.weeks[w-1].days.length-1]+1;
                    var end = start + 6;
                    //si nos pasamos del fin del mes recortamos
                    end = end <= $scope.monthEnd ? end : $scope.monthEnd;
                    for(var i=start;i<=end;i++) $scope.insertDay(week,i);
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

        }
        $scope.initialize();
        $scope.$watch('year',function(){
            $scope.initialize();
        });       

	}

	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
                month : '=',
                year : '=',
                seasons : '=',
        	},
        	templateUrl : '/template/find/calendarMonth.html'
        };
    };
    app.directive('calendarMonth', directive);

}());
