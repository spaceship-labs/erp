app.controller('airportCTL',function($scope,$http,$rootScope){
    $scope.airports = airports;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.content = content;

    $scope.createAirport = function(newAirport){
        $http({method: 'POST', url: '/airport/create',params:newAirport}).success(function (airport){
            $scope.airports.push(airport);
            jQuery('#myModal').modal('hide');
            window.location.reload();
        });
    };
    $scope.getInfo = function(airport){
        airport.createdAt=(moment(airport.createdAt).format('LL'));
        airport.updatedAt=(moment(airport.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = airport.name;
        r[$rootScope.translates.c_created] = airport.createdAt;
        r[$rootScope.translates.c_updated] = airport.updatedAt;
        return r;
    };
    $scope.getZones = function(thelocation){
        $http({method: 'POST', url: '/zone/getZones',data: {id:thelocation} }).success(function (zones){
            $scope.zones = zones;
        });
    };
});
app.controller('airportEditCTL',function($scope,$upload,$http,$window){
    $scope.airport = airport;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.content = content;
    $scope.user = user;
    $scope.getZones = function(thelocation){
        $http({method: 'POST', url: '/zone/getZones',data: {id:thelocation} }).success(function (zones){
            $scope.zones = zones;
        });
    };
});