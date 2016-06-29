app.controller('hotelCTL',function($scope,$http,$window,$rootScope,$upload){
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
    $scope.WFile = function($files,$e){
        if($files) {
            $scope.fileName = $files[0].name;
            $scope.file = $files;
        }
    };
    $scope.saveFile = function() {
        $scope.loading = true;
        $scope.f = { finish : false };
        $scope.upload = $upload.upload({ url: '/hotel/uploadcvs' , file: $scope.file
        }).progress(function(evt){ $scope.loadingProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
            $scope.loading = false;
            $scope.loadingProgress = 0;
            $scope.f.finish = true;
            $scope.f.success = data.success;
            $scope.f.results = data.result;
            $scope.f.errors = data.errors;
        });
    };

    var block = false;
    $scope.createHotel = function(){
    	if(!block){
		block = true;
		jQuery('#myModal input[type="submit"]').prop('disabled', true);
        $http({method: 'POST', url: '/hotel/create',data:$scope.newHotel}).success(function (result){
            console.log(result);
            $window.location.href = '/hotel/edit/' + result.thehotel.id;
        });
	}
    };
    $scope.getInfo = function(hotel){
        //var phones = hotel.phones ? hotel.phones.join(", ") : "";
        //console.log(hotel.createdAt);
        hotel.createdAt=(moment(hotel.createdAt).format('LL'));
        hotel.updatedAt=(moment(hotel.updatedAt).format('LL'));
        var r = {};
        r[$rootScope.translates.c_population] = hotel.location?hotel.location.name:'';
        r[$rootScope.translates.c_adress] = hotel.address;
        //r[$rootScope.translates.c_phones] = hotel.phones;
        r[$rootScope.translates.c_created] = hotel.createdAt;
        r[$rootScope.translates.c_updated] = hotel.updatedAt;
        r.spaceID = hotel.spaceid;
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
    console.log($scope.hotel);

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
        latitude : parseFloat($scope.hotel.latitude),
        longitude : parseFloat($scope.hotel.longitude)
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
    $scope.hotel.departurePlaces = hotel.departurePlaces || [];
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.$on('SAVE_ALL', function () {
        $scope.saveAll();
        console.log('SAVE_ALL!!!!!!!!');
    });
    $scope.saveGeo = function(marker,cb){
        var obj = {
            id : hotel.id,
            latitude : marker.lat,
            longitude : marker.lng,
            departurePlaces : $scope.hotel.departurePlaces
        };
        $http({method: 'POST', url: '/hotel/update',params:obj}).success(function(hotel){
            $scope.hotel.latitude = hotel.latitude;
            $scope.hotel.longitude = hotel.longitude;
            cb(null,hotel);
        });
    };
    $scope.saveAll = function(){
        var obj = {
            id : hotel.id,
            departurePlaces : $scope.hotel.departurePlaces
        };
        $http({method: 'POST', url: '/hotel/update',params:obj}).success(function(hotel){
            $scope.hotel.departurePlaces = hotel.departurePlaces;
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
    $scope.getZones = function(th){
        var data = {id:$scope.hotel.location};
        console.log(data);
        $http({method: 'POST', url: '/zone/getZones',data: data }).success(function (zones){
            $scope.zones = zones;
        });
    };
    $scope.changeLocations = function(value){
        console.log(value);
    };
    $scope.addDeparturePlace = function(){
        $scope.hotel.departurePlaces.push($scope.newdeparturePlace);
        $scope.newdeparturePlace = '';
    };
    $scope.updateInline = function(data,index){
        $scope.hotel.departurePlaces[index] = data;
    };
    $scope.removePlace = function(index){
        $scope.hotel.departurePlaces.splice(index,1);
    }
});
