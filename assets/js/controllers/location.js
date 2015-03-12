app.controller('locationCTL',function($scope,$http,$rootScope){
    $scope.locations = locations;
    $scope.company = company;
    $scope.content = content;

    $scope.createLocation = function(newLocation){
        $http({method: 'POST', url: '/location/create',params:newLocation}).success(function (location){
            $scope.locations.push(location);
            jQuery('#myModal').modal('hide');
            window.location.reload();
        });
    };
    $scope.getInfo = function(location){
        location.createdAt=(moment(location.createdAt).format('LL'));
        location.updatedAt=(moment(location.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = location.name;
        r[$rootScope.translates.c_created] = location.createdAt;
        r[$rootScope.translates.c_updated] = location.updatedAt;
        return r;
    };
});
app.controller('locationEditCTL',function($scope,$upload,$http){
    $scope.user = user;
    $scope.location_o = location_o;
    $scope.locations = locations;
    $scope.relatedLocations = [];
    $scope.content = content;
    $scope.test = '';
    $scope.showZoneForm = false;
    $scope.zone = {};
    $scope.newZoneClass = 'fa-plus';
    /*$scope.getRelatedLocations = function(){
        var result = [];
        if($scope.location_o.locations.length > 0){
            for(var x=0;x<$scope.location_o.locations.length;x++){
                result.push( $scope.location_o.locations[x].id );
            }
        }
        $scope.relatedLocations = result;
    };
    $scope.getRelatedLocations();*/
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
            //console.log('zone');console.log(zone);
            $scope.location_o.zones.push(zone);
            $scope.newZoneClass = 'fa-plus';
        });
    };
    /*$scope.saveClass2 = 'fa-save';
    $scope.updateRelatedCities = function(){
        $scope.saveClass2 = 'fa-upload';
        $scope.location_o.locations = $scope.relatedLocations;
        $http({method: 'POST', url: '/location/update',params:$scope.location_o }).success(function(location_){
            $scope.location_o = location_;
            $scope.getRelatedLocations();
            $scope.saveClass2 = 'fa-save';
        });
    }*/
    var updateLocations = function(){
        $scope.notRelatedLocations = [];
        $scope.relatedLocations = [];
        angular.forEach($scope.locations,function(l){
            //if ($scope.location_o.locations.indexOf(l.id) == -1) {
            if ( _.pluck($scope.location_o.locations , 'id').indexOf(l.id) == -1) {
                $scope.notRelatedLocations.push(l);
            } else {
                $scope.relatedLocations.push(l);
            }
        });
        console.log($scope.relatedLocations);
        console.log($scope.notRelatedLocations);
    };

    $scope.removeLocation = function(l){
        var params = { id : $scope.location_o.id , loc : l.id }
        $http({method: 'POST', url: '/location/removeLoc',params:params }).success(function(location_){
            $scope.location_o = location_;
            updateLocations();
            //$scope.$apply();
        });
    };
    $scope.addLocation = function(l){
        var params = { id : $scope.location_o.id , loc : l.id }
        $http({method: 'POST', url: '/location/addLoc',params:params }).success(function(location_){
            $scope.location_o = location_;
            updateLocations();
            //$scope.$apply();
        });
    };
    updateLocations();
});