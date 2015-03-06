app.controller('tourCTL',function($scope,$http,$window){
    $scope.tours = tours;
    $scope.content = content;
    $scope.locations = locations;
    $scope.schemes = schemes;
    $scope.company = company;
	$scope.getInfo = function(tour){
        tour.createdAt=(moment(tour.createdAt).format('LL'));
        tour.updatedAt=(moment(tour.updatedAt).format('LL'));
		return {
			"Nombre":tour.name,
			"Tarifa Base":tour.fee,
			"Horarios":tour.email,
            "Creado" : tour.createdAt,
            "Actualizado": tour.updatedAt,
		}
	};

	$scope.createTour = function(newtour){
        $http({method: 'POST', url: '/tour/create',params:newtour}).success(function (result){
            $scope.tours = result.tours;
            jQuery('#myModal').modal('hide');
            $window.location =  "/tour/edit/" + result.thetour.id;
        });    
    };

});

app.controller('tourEditCTL',function($scope,$http,$window){
    $scope.schemes = schemes;
    $scope.locations = locations;
    $scope.tour = tour;
    $scope.user = user;
    io.socket.get('/tour/find/'+tour.id,function(data,jwres){
        $scope.tour = data;
	$scope.tour.seasonScheme = data.seasonScheme && data.seasonScheme.id || null;
	$scope.tour.location = data.location && data.location.id || null;
        $scope.$apply();
    });
	$scope.content = content;
    $scope.company = company;
    $scope.saveClass = 'fa-save';
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        var form = {id:$scope.tour.id,days:$scope.tour.days};
        $http({method: 'POST',url:'/tour/save',params:form}).success(function(tour){
            $scope.tour.days = tour.days;
            $scope.saveClass = 'fa-save';
        });
    }
});
