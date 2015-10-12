app.controller('seasonshemeCTL',function($scope,$http){
    $scope.schemes = schemes;
    $scope.content = content;
    $scope.company = company;
	$scope.addScheme = function(newscheme){
        $http({method: 'POST', url: '/seasonScheme/create',params:newscheme}).success(function (scheme){
            $scope.schemes.push(scheme);
            jQuery('#myModal').modal('hide');
        });    
    };
    $scope.cloneScheme = function(scheme){
        console.log('clone function');
        $http.post('/seasonscheme/cloneScheme',{ id : scheme.id },{}).success(function(scheme){
            console.log(scheme);
            if( scheme.result )
                $scope.schemes.push(scheme.result);
        });
    }
});
app.controller('calendarCTL',function($scope,$http){
    $scope.content = content;
    $scope.company = company;
    $scope.scheme = scheme;
    $scope.hotels = hotels;
    $scope.year = 2015;
    $scope.newSeason = {scheme:$scope.scheme.id};
    $scope.editingSeason = false;
    var formatDates = function(d){
        var result = false;
        console.log(d);
        if( d ){
            var dateFormat = new Date(d);
            result = dateFormat.getDate() + "/" + (dateFormat.getMonth()+1) +"/" + dateFormat.getFullYear();
        }
        console.log(result);
        return result;
    };
    $scope.scheme.seasons.forEach(function(season){
        season.title = season.title || 'sin titulo';
        season.newStart = formatDates( season.start );
        season.newEnd = formatDates( season.end );
    });
   $scope.createSeason = function(){
        $http({method: 'POST', url: '/season/create',params:$scope.newSeason}).success(function (season){
            season.title = season.title || 'sin titulo';
            season.newStart = formatDates( season.start );
            season.newEnd = formatDates( season.end );
            $scope.scheme.seasons.push(season);
            jQuery('#myModal').modal('hide');
            $scope.$broadcast('UPDATE SEASONS');
        });
    };
    $scope.editSeason = function(){
        delete $scope.editingSeason.newStart;
        delete $scope.editingSeason.newEnd;
        $http.post('/season/update/'+$scope.editingSeason.id,$scope.editingSeason,{}).success(function(season){
            console.log(season);
            season.title = season.title || 'sin titulo';
            season.newStart = formatDates( season.start );
            season.newEnd = formatDates( season.end );
            for( var x in $scope.scheme.seasons ){
                if( $scope.scheme.seasons[x].id == season.id ) $scope.scheme.seasons[x] = season;
            }
            $scope.editingSeason = false;
            jQuery('#myModalEdit').modal('hide');
        });
    }
    $scope.setEditSeason = function(season){
        if(season){
            $scope.editingSeason = season;
        }
    };
});