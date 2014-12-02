app.controller('seasonsCTL',function($scope,$http){
    $scope.schemes = schemes;
    $scope.content = content;
    $scope.company = company;
	$scope.addScheme = function(newscheme){
        $http({method: 'POST', url: '/seasonScheme/create',params:newscheme}).success(function (scheme){
        	console.log(scheme)
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
    $scope.events = [$scope.scheme.seasons];
    //$scope.events = [];
    console.log($scope.events);
   /* $scope.createSeason = function(){
    	console.log($scope.newSeason);
		$http({method: 'POST', url: '/season/create',params:$scope.newSeason}).success(function (season){
			$scope.scheme.seasons.push(season);
			jQuery('#myModal').modal('hide');
		});    
    }*/
});