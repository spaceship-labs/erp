app.controller('airlineCTL',function($scope,$http,$rootScope){
    $scope.airlines = airlines;
    $scope.content = content;
    $scope.createAirline = function(newAirline){
        $http({method: 'POST', url: '/airline/create',params:newAirline}).success(function (airline){
            $scope.airlines.push(airline);
            jQuery('#myModal').modal('hide');
            //window.location.reload();
        });
    };
    $scope.getInfo = function(airline){
        airline.createdAt=(moment(airline.createdAt).format('LL'));
        airline.updatedAt=(moment(airline.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = airline.name;
        r[$rootScope.translates.c_created] = airline.createdAt;
        r[$rootScope.translates.c_updated] = airline.updatedAt;
        return r;
    };
});
app.controller('airlineEditCTL',function($scope,$upload,$http,$window){
    $scope.airline = airline;
    $scope.content = content;
});