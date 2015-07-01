app.controller('tourCTL',function($scope,$http,$window,$rootScope){
    $scope.tours = tours;
    $scope.content = content;
    $scope.locations = locations;
    $scope.schemes = schemes;
    $scope.company = company;
    $scope.providers = providers;
	$scope.getInfo = function(tour){
        tour.createdAt=(moment(tour.createdAt).format('LL'));
        tour.updatedAt=(moment(tour.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = tour.name;
        r[$rootScope.translates.c_baseRate] = tour.fee;
        r[$rootScope.translates.c_created] = tour.createdAt;
        r[$rootScope.translates.c_updated] = tour.updatedAt;
		return r;
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
    $scope.providers = providers;
    $scope.tour = tour;
    $scope.user = user;
    $scope.tourcategories = tourcategories;
    console.log(tourcategories);
    /*io.socket.get('/tour/find/'+tour.id,function(data,jwres){
        $scope.tour = data;
	    $scope.tour.seasonScheme = data.seasonScheme && data.seasonScheme.id || null;
        $scope.tour.location = data.location && data.location.id || null;
	    $scope.tour.provider = data.provider && data.provider.id || null;
        $scope.$apply();
    });*/
	$scope.content = content;
    $scope.company = company;
    $scope.saveClass = 'fa-save';
    var save = function(){
        $scope.saveClass = 'fa-upload';
        var form = {id:$scope.tour.id,days:$scope.tour.days};
        $http({method: 'POST',url:'/tour/save',params:form}).success(function(tour){
            $scope.tour.days = tour.days;
            $scope.saveClass = 'fa-save';
        });
    };
    $scope.$on('SAVE_ALL', function () {
        save();
    });
});
