app.controller('airportCTL',function($scope,$http){
    $scope.airports = airports;
    $scope.locations = locations;
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
});
app.controller('airportEditCTL',function($scope,$upload,$http){
    $scope.airport = airport;
    $scope.locations = locations;
    $scope.content = content;
});