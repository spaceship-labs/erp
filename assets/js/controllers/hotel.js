app.controller('hotelCTL',function($scope,$http,$window,$rootScope){
    $scope.hotels = hotels;
    $scope.locations = locations;
    $scope.company = company;
    $scope.zones = zones;
    $scope.schemes = schemes;
    $scope.foodSchemes = foodSchemes;
    $scope.content = content;
    $scope.categories = [
        {id:1,name:'1 '+$rootScope.translates.c_stars},
        {id:2,name:'2 '+$rootScope.translates.c_stars},
        {id:3,name:'3 '+$rootScope.translates.c_stars},
        {id:4,name:'4 '+$rootScope.translates.c_stars},
        {id:5,name:'5 '+$rootScope.translates.c_stars},
        {id:6,name:'6 '+$rootScope.translates.c_stars},
    ];
    
    var block = false;
    $scope.createHotel = function(){
    	if(!block){
		block = true;
		jQuery('#myModal input[type="submit"]').prop('disabled', true);
        $http({method: 'POST', url: '/hotel/create',data:$scope.newHotel}).success(function (result){
            $window.location.href = '/hotel/edit/' + result.thehotel.id;
        });
	}
    };
    $scope.getInfo = function(hotel){
        var phones = hotel.phones ? hotel.phones.join(", ") : "";
        //console.log(hotel.createdAt);
        hotel.createdAt=(moment(hotel.createdAt).format('LL'));
        hotel.updatedAt=(moment(hotel.updatedAt).format('LL'));
        var r = {};
        r[$rootScope.translates.c_population] = hotel.location.name;
        r[$rootScope.translates.c_adress] = hotel.address;
        //r[$rootScope.translates.c_phones] = hotel.phones;
        r[$rootScope.translates.c_created] = hotel.createdAt;
        r[$rootScope.translates.c_updated] = hotel.updatedAt;
        return r;
        
    };
    $scope.getZones = function(){
        $http({method: 'POST', url: '/zone/getZones',data: {id:$scope.newHotel.location} }).success(function (zones){
            $scope.zones = zones;
            //console.log('zones');console.log(zones);
        });
    };
});
app.controller('hotelEditCTL',function($scope,$upload,$http,$rootScope){
    $scope.hotel = hotel;

    $scope.categories = [
        {id:1,name:'1 '+$rootScope.translates.c_stars},
        {id:2,name:'2 '+$rootScope.translates.c_stars},
        {id:3,name:'3 '+$rootScope.translates.c_stars},
        {id:4,name:'4 '+$rootScope.translates.c_stars},
        {id:5,name:'5 '+$rootScope.translates.c_stars},
        {id:6,name:'6 '+$rootScope.translates.c_stars},
    ];

    $scope.location = {
        address : $scope.hotel.address+', '+ ($scope.hotel.location?$scope.hotel.location.name : ''),
        country : $scope.hotel.location?$scope.hotel.location.country:'',
        zipcode : $scope.hotel.zipcode,
        latitude : $scope.hotel.latitude,
        longitude : $scope.hotel.longitude,
    };

    /*$http({method:'POST',url:'/hotel/find/'+hotel.id}).success(function(hotel){
        hotel.location = hotel.location ? hotel.location.id : null;
        hotel.seasonScheme = hotel.seasonScheme ? hotel.seasonScheme.id : null;
        hotel.zone = hotel.zone ? hotel.zone.id : null;
        $scope.hotel = hotel;
    });*/

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
        $http({method: 'POST', url: '/zone/getZones',data: {id:$scope.hotel.location.id} }).success(function (zones){
            $scope.zones = zones;
        });
    };
    $scope.changeLocations = function(value){
        console.log(value);
    };
    
});
