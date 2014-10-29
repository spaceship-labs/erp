app.controller('tourCTL',function($scope,$http){
    $scope.tours = tours;
    $scope.content = content;
    $scope.objects = {locations:locations};
    $scope.user = user;
    $scope.company = company;
    console.log($scope.company,$scope.user);
	$scope.getInfo = function(tour){
		return {
			"Nombre":tour.name,
			"Tarifa Base":tour.fee,
			"Horarios":tour.email,
		}
	};

	$scope.createTour = function(newtour){
        $http({method: 'POST', url: '/tour/create',params:newtour}).success(function (tours){
            $scope.tours = tours;
            jQuery('#myModal').modal('hide');
        });    
    };

});

app.controller('tourEditCTL',function($scope,$http){
    $scope.tour = tour;
	$scope.content = content;
});