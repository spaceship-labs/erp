app.controller('airportCTL',function($scope,$http){
    $scope.airports = airports;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.content = content;

    $scope.createAirport = function(newAirport){
        $http({method: 'POST', url: '/airport/create',params:newAirport}).success(function (airport){
            $scope.airports.push(airport);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(airport){
        airport.createdAt=(moment(airport.createdAt).format('LL'));
        airport.updatedAt=(moment(airport.updatedAt).format('LL'));
        return {
            "Nombre" : airport.name,
            "Creado" : airport.createdAt,
            "Actualizado": airport.updatedAt,
        }
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