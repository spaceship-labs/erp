app.controller('locationCTL',function($scope,$http){
    $scope.locations = locations;
    $scope.company = company;
    $scope.content = content;

    $scope.createLocation = function(newLocation){
        $http({method: 'POST', url: '/location/create',params:newLocation}).success(function (location){
            $scope.locations.push(location);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(location){
        return {
            "Nombre" : location.name,
            "Creado" : location.createdAt
        }
    };
});
app.controller('locationEditCTL',function($scope,$upload,$http){
    $scope.location_o = location_o;
    $scope.content = content;
});