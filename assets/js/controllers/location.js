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
    $scope.locations = locations;
    $scope.content = content;
    $scope.showZoneForm = false;
    $scope.zone = {};
    $scope.newZoneClass = 'fa-plus';

    $scope.toggleZoneForm = function(){
        $scope.showZoneForm = !$scope.showZoneForm;
        $scope.newZoneClass = $scope.showZoneForm ? 'fa-minus' : 'fa-plus';
    };
    $scope.addZone = function(zone){
        $scope.zone.location = $scope.location_o.id;
        $scope.newZoneClass = 'fa-upload';
        $scope.showZoneForm = false;
        $http({method: 'POST', url: '/location/addZone',params:$scope.zone}).success(function(zone){ //location_o
            //$scope.location_o.zones = location_o.zones;
            console.log('zone');
            console.log(zone);
            $scope.location_o.zones.push(zone);
            $scope.newZoneClass = 'fa-plus';
        });
    };
});