app.controller('hotelCTL',function($scope,$http){
    $scope.hotels = hotels;
    $scope.locations = locations;
    $scope.createHotel = function(){
        $http({method: 'GET', url: '/hotel/create',params:$scope.newHotel}).success(function (hotels){
            $scope.hotels = hotels;
           // $scope.searchInputSelect = $scope.newHotel.name[0].toUpperCase();
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
    $scope.selectLetter = function(l){
        if(l) $scope.searchInputSelect = l;
    }
});
app.controller('hotelEditCTL',function($scope,$upload,$http){
    $scope.hotel = hotel;
    if(hotel.phones)
        $scope.phones = JSON.parse(JSON.stringify(hotel.phones));
    if(hotel.services)
        $scope.services = null;
    $scope.locations = locations;
    $scope._content = _content;
    $scope.saveClass = 'fa-save';
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

    $scope.addRoom = function(){
        $scope.room.hotel = $scope.hotel.id;
        $scope.newRoomClass = 'fa-upload';
        $scope.showRoomForm = false;
        $http({method: 'POST', url: '/hotel/addRoom',params:room}).success(function(hotel){
            $scope.hotel.rooms = hotel.rooms;
            $scope.newRoomClass = 'fa-plus';
        });
    };

    $scope.addSeason = function(){
        $scope.newSeason.hotel = $scope.hotel.id;
        $scope.newSeasonClass = 'fa-upload';
        $scope.showSeasonForm = false;
        $http({method: 'POST', url: '/hotel/addSeason',params:$scope.newSeason}).success(function(hotel){
            console.log(hotel);
            $scope.hotel = hotel;
            $scope.phones = JSON.parse(JSON.stringify(hotel.phones));
            $scope.newSeasonClass = 'fa-plus';
        });
    };
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        if($scope.phones.length>0){
            var phones = [];
            $scope.phones.forEach(function(phone){
                phones.push(phone.text);
            });
            $scope.hotel.phones = phones;
        }else{
            $scope.hotel.phones = null;
        }
        $http({method: 'POST', url: '/hotel/update',params:$scope.hotel}).success(function (hotel){
            $scope.hotel = hotel;
            if(hotel.phones)
                $scope.phones = JSON.parse(JSON.stringify(hotel.phones));
            $scope.saveClass = 'fa-save';
        });
    };
    
});