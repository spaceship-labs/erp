app.controller('seasonsCTL',function($scope,$http){
    $scope.schemes = schemes;
    $scope.content = content;
    $scope.company = company;
	$scope.addScheme = function(newscheme){
        $http({method: 'POST', url: '/seasonScheme/create',params:newscheme}).success(function (scheme){
            $scope.schemes.push(scheme);
            jQuery('#myModal').modal('hide');
        });    
    };

});
app.controller('seasonsEditCTL',function($scope,$http){
    $scope.content = content;
    $scope.company = company;
    $scope.scheme = scheme;
    $scope.hotels = hotels;
    $scope.newSeason = {scheme:$scope.scheme.id};
    $scope.scheme.seasons.forEach(function(season){
        season.title = season.title || 'sin titulo';
    });
    $scope.events = [$scope.scheme.seasons];
    $scope.createSeason = function(){
        console.log($scope.newSeason);
        $http({method: 'POST', url: '/season/create',params:$scope.newSeason}).success(function (season){
            season.title = season.title || 'sin titulo';
            $scope.scheme.seasons.push(season);
            jQuery('#myModal').modal('hide');
        });    
    }
});
app.controller('calendarCTL',function($scope,$http){
    $scope.content = content;
    $scope.company = company;
    $scope.scheme = scheme;
    $scope.hotels = hotels;
    $scope.year = 2014;
    $scope.newSeason = {scheme:$scope.scheme.id};
    $scope.scheme.seasons.forEach(function(season){
        season.title = season.title || 'sin titulo';
        season.seasonStart = new Date(season.start);
    });

   $scope.createSeason = function(){
        $http({method: 'POST', url: '/season/create',params:$scope.newSeason}).success(function (season){
            season.title = season.title || 'sin titulo';
            $scope.scheme.seasons.push(season);
            jQuery('#myModal').modal('hide');
            $scope.$broadcast('UPDATE SEASONS');
        });    
    }

});