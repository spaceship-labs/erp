app.controller('hotelCTL',function($scope,$http){
    $scope.hotels = hotels;
    $scope.locations = locations;
    $scope.company = company;
    $scope.zones = zones;
    
    var block = false;
    $scope.createHotel = function(){
    	if(!block){
		block = true;
		jQuery('#myModal input[type="submit"]').prop('disabled', true);
	        $http({method: 'POST', url: '/hotel/create',data:$scope.newHotel}).success(function (hotels){
	            $scope.hotels = hotels;
		    jQuery('#myModal input[type="submit"]').prop('disabled', false);
	            jQuery('#myModal').modal('hide');
		    block = false;
	        });
	}
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
        $http({method: 'POST', url: '/zone/getZones',data: $scope.newHotel.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
});
app.controller('hotelEditCTL',function($scope,$upload,$http){
    $scope.hotel = hotel;

    $scope.categories = [
        {id:1,name:'1 estrella'},
        {id:2,name:'2 estrellas'},
        {id:3,name:'3 estrellas'},
        {id:4,name:'4 estrellas'},
        {id:5,name:'5 estrellas'},
        {id:6,name:'6 estrellas'},
    ];

    $scope.location = {
        address : $scope.hotel.address+', '+$scope.hotel.location.name || $scope.hotel.location.name,
        country : $scope.hotel.location.country,
        zipcode : $scope.hotel.zipcode,
        latitude : $scope.hotel.latitude,
        longitude : $scope.hotel.longitude,
    };

    $http({method:'POST',url:'/hotel/find/'+hotel.id}).success(function(hotel){
        hotel.location = hotel.location ? hotel.location.id : null;
        hotel.seasonScheme = hotel.seasonScheme ? hotel.seasonScheme.id : null;
        hotel.zone = hotel.zone ? hotel.zone.id : null;
        $scope.hotel = hotel;
    });

    $scope.company = company;
    $scope.user = user;
    $scope.locations = locations;
    $scope.zones = zones;
    $scope.schemes = schemes;
    $scope.foodSchemes = foodSchemes;
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

    
    $scope.saveGeo = function(marker,cb){
        var obj = {
            id : hotel.id,
            latitude : marker.lat,
            longitude : marker.lng,
        }
        $http({method: 'POST', url: '/hotel/update',data:obj}).success(function(hotel){
            $scope.hotel.latitude = hotel.latitude;
            $scope.hotel.longitude = hotel.longitude;
            cb(null,hotel);
        });
    }
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
        $http({method: 'POST', url: '/hotel/addRoom',data:$scope.room}).success(function(hotel){
            $scope.hotel.rooms = hotel.rooms;
            $scope.newRoomClass = 'fa-plus';
        });
    };
    $scope.getZones = function(){
        //console.log($scope.hotel.location);
        $http({method: 'POST', url: '/zone/getZones',data: $scope.hotel.location }).success(function (zones){
            $scope.zones = zones;
        });
    };
   
    
});
