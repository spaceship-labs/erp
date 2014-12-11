app.controller('hotelCTL',function($scope,$http){
    $scope.hotels = hotels;
    $scope.locations = locations;
    $scope.company = company;
    $scope.zones = zones;

    $scope.createHotel = function(){
        $http({method: 'GET', url: '/hotel/create',params:$scope.newHotel}).success(function (hotels){
            $scope.hotels = hotels;
            jQuery('#myModal').modal('hide');
        });
    
    };
    $scope.getInfo = function(hotel){
        var phones = hotel.phones ? hotel.phones.join(", ") : "";
        return {
            "Poblacion" : hotel.location.name,
            "Direccion" : hotel.address,
            "Telefonos" : phones,
            "Creado" : hotel.createdAtString,
        }
    };
    $scope.getZones = function(){
        $http({method: 'POST', url: '/hotel/getZones',params: $scope.newHotel.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
});
app.controller('hotelEditCTL',function($scope,$upload,$http){
    $scope.company = company;
    $scope.user = user;
    $scope.hotel = hotel;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.schemes = schemes;
    $scope.content = content;
    $scope.showRoomForm = false;
    $scope.newRoomClass = 'fa-plus';
    $scope.showSeasonForm = false;
    $scope.newSeasonClass = 'fa-plus';
    $scope.newSeason = {};
    $scope.room = {};
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.toggleRoomForm = function(){
        $scope.showRoomForm = !$scope.showRoomForm;
        $scope.newRoomClass = $scope.showRoomForm ? 'fa-minus' : 'fa-plus';
    };

    $scope.toggleSeasonForm = function(){
        $scope.showSeasonForm = !$scope.showSeasonForm;
        $scope.newSeasonClass = $scope.showSeasonForm ? 'fa-minus' : 'fa-plus';
    };

    $scope.addRoom = function(room){
        $scope.room.hotel = $scope.hotel.id;
        $scope.newRoomClass = 'fa-upload';
        $scope.showRoomForm = false;
        $http({method: 'POST', url: '/hotel/addRoom',params:$scope.room}).success(function(hotel){
            $scope.hotel.rooms = hotel.rooms;
            $scope.newRoomClass = 'fa-plus';
        });
    };
    $scope.getZones = function(){
        //console.log($scope.hotel.location);
        $http({method: 'POST', url: '/hotel/getZones',params: $scope.hotel.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
   
    
});