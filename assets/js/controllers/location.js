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
    $scope.airports = airports;
    $scope.relatedLocations = [];
    $scope.content = content;
    $scope.test = '';
    $scope.showZoneForm = false;
    $scope.zone = {};
    $scope.newZoneClass = 'fa-plus';
    $scope.typeAddZone = "1";
    console.log('$scope.location_o');console.log($scope.location_o);
    $scope.toggleZoneForm = function(){
        $scope.showZoneForm = !$scope.showZoneForm;
        $scope.newZoneClass = $scope.showZoneForm ? 'fa-minus' : 'fa-plus';
    };
    $scope.addZone = function(zone){
        $scope.zone.location = $scope.location_o.id;
        $scope.newZoneClass = 'fa-upload';
        $scope.showZoneForm = false;
        $http({method: 'POST', url: '/location/addZone',params:$scope.zone}).success(function(zone){
            $scope.location_o.zones.push(zone);
            $scope.newZoneClass = 'fa-plus';
        });
    };
    $scope.allZones = [];
    var getAllZones = function(){
        var ids = [];
        for(var x in $scope.location_o.zones) ids.push( $scope.location_o.zones[x].id );
        var params = { 'id' : { '!' : ids } };
        console.log(params);
        $http.post('/zone/find',params,{}).success(function(result) {
            console.log(result);
            if( result.result ) $scope.allZones = result.result;
            console.log( $scope.allZones );
        });
    }
    getAllZones();
    $scope.addExistingZone = function(){
        var params = { zone : $scope.existingZone, location : $scope.location_o.id };
        $http({method: 'POST', url: '/zone/addLocation',params:params}).success(function(result){
            if( result.result ){
                $scope.location_o.zones.push(result.result);
                $scope.newZoneClass = 'fa-plus';
                getAllZones();
            }
        });
    };
    var updateAirports = function(){
        console.log('updateAirports function');
        $scope.notaddedAirports = [];
        angular.forEach($scope.airports,function(a){
            if ( _.pluck($scope.location_o.airportslist , 'id').indexOf(a.id) == -1)
                $scope.notaddedAirports.push(a);
        });
    };
    $scope.addAirport = function(){
        var params = { location : $scope.location_o.id, airport : $scope.airportToAdd.id };
        $http({method: 'POST', url: '/location/addairport',params:params}).success(function(result){
            console.log(result);
            if( !result.err ){
                $scope.location_o.airportslist = result.result;
                updateAirports();
            }
        });
    };
    $scope.removeAirport = function(a){
        var params = { id : $scope.location_o.id , airport : a.id }
        $http({method: 'POST', url: '/location/removeAirport',params:params }).success(function(location_){
            if( !result.err ){
                $scope.location_o.airportslist = result.result;
                updateAirports();
            }
        });
    };
    updateAirports();
    //Funciones que ya no se usan ( por ahora )
    var updateLocations = function(){
        $scope.notRelatedLocations = [];
        $scope.relatedLocations = [];
        angular.forEach($scope.locations,function(l){
            if ( _.pluck($scope.location_o.locations,'id').indexOf(l.id) == -1) {
                $scope.notRelatedLocations.push(l);
            } else {
                $scope.relatedLocations.push(l);
            }
        });
    };
    $scope.removeLocation = function(l){
        var params = { id : $scope.location_o.id , loc : l.id }
        $http({method: 'POST', url: '/location/removeLoc',params:params }).success(function(location_){
            $scope.location_o = location_;
            updateLocations();
        });
    };
    $scope.addLocation = function(l){
        var params = { id : $scope.location_o.id , loc : l.id }
        $http({method: 'POST', url: '/location/addLoc',params:params }).success(function(location_){
            $scope.location_o = location_;
            updateLocations();
        });
    };
    updateLocations();
});