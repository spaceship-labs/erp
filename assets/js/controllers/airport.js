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
        return {
            "Nombre" : airport.name,
            "Creado" : airport.createdAt
        }
    };
    $scope.getZones = function(){
        console.log($scope.newAirport);
        console.log(newAirport);
        $http({method: 'POST', url: '/hotel/getZones',params: $scope.newAirport.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
});
app.controller('airportEditCTL',function($scope,$upload,$http){
    $scope.airport = airport;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.content = content;
    $scope.getZones = function(){
        $http({method: 'POST', url: '/hotel/getZones',params: $scope.airport.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
});