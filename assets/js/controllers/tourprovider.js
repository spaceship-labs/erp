app.controller('tourproviderCTL',function($scope,$http,$rootScope){
    $scope.providers = providers;
    $scope.content = content;
    $scope.locations = locations;
    $scope.company = company;
	$scope.getInfo = function(provider){
        provider.createdAt=(moment(provider.createdAt).format('LL'));
        provider.updatedAt=(moment(provider.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = provider.name;
        r[$rootScope.translates.c_created] = provider.createdAt;
        r[$rootScope.translates.c_updated] = provider.updatedAt;
		return r;
	};
	$scope.createTourProvider = function(newprovider){
        $http({method: 'POST', url: '/tourprovider/create',params:newprovider}).success(function (result){
            $scope.providers.unshift(result);
            jQuery('#myModal').modal('hide');
        });
    };
});
app.controller('tourproviderEditCTL',function($scope,$http){
    $scope.locations = locations;
    $scope.provider = provider;
    $scope.user = user;
    $scope.content = content;
    $scope.company = company;
    $scope.currencies = currencies;
    $scope.saveTour = function(data,tour){
        angular.extend(data, { id : tour.id });
        $scope.saveClass = 'fa-upload';
        $http({method: 'POST',url:'/tour/save',params:data}).success(function(t){
            $scope.saveClass = 'fa-save';
            tour = t;
        });
    };
});