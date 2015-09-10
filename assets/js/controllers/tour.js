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
    console.log(tour);
    $scope.tour.schedules = $scope.tour.schedules || [];
    for(var x in $scope.tour.schedules)
        $scope.tour.schedules[x] = typeof $scope.tour.schedules[x] == 'string'?JSON.parse($scope.tour.schedules[x]):$scope.tour.schedules[x];
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
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        var form = {id:$scope.tour.id,days:$scope.tour.days, schedules : $scope.tour.schedules };
        $http({method: 'POST',url:'/tour/save',params:form}).success(function(tour){
            $scope.tour.days = tour.days;
            $scope.saveClass = 'fa-save';
        });
    };
    $scope.$on('SAVE_ALL', function () {
        save();
    });
    $scope.addSchedule = function(){
        var aux = { from : '' , to : '' };
        $scope.tour.schedules.push(aux);
    };
    $scope.deleteSchedule = function(index){
        $scope.tour.schedules.splice(index,1);
    };
    $scope.updateMarkers = function(markers,cb){
        //console.log($scope.item);
        //console.log(markers);
        var data = { id : $scope.tour.id , departurePoints : markers };
        //console.log(data);
        $http({method: 'POST', url: '/tour/update',params:data}).success(function (item){
            $scope.tour = item;
            cb(null,item);
        });
    };
    $scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 6
    };
});
