app.controller('hotelCTL',function($scope,$http){
    $scope.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
    $scope.hotels = hotels;
    $scope.locations = locations;
    $scope.alphabetIndex = [];
    $scope.hotels.forEach(function(hotel){
        $scope.alphabetIndex.push(hotel.name[0].toUpperCase());
    });
    $scope.searchInputSelect = $scope.alphabetIndex[0];
    $scope.createHotel = function(){
        $http({method: 'GET', url: '/hotel/create',params:$scope.newHotel}).success(function (hotels){
            $scope.hotels = hotels;
            $scope.hotels.forEach(function(hotel){
                $scope.alphabetIndex.push(hotel.name[0].toUpperCase());
            });
            $scope.searchInputSelect = $scope.newHotel.name[0].toUpperCase();
            jQuery('#myModal').modal('hide');
        });
    
    };
    $scope.hotelFilter = function(h){        
        if($scope.searchInputSelect && !$scope.searchInput){
            return $scope.searchInputSelect == h.name[0].toUpperCase();
        }else{
            var regex = new RegExp('^'+$scope.searchInput,'i');
            var name = h.name;
            return name.match(regex);
        }
    }
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
    $scope.room = {};
    $scope.showSeasonForm = false;
    $scope.newSeasonClass = 'fa-plus';
    $scope.newSeason = {};

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    }
    $scope.toggleRoomForm = function(){
        $scope.showRoomForm = !$scope.showRoomForm;
        $scope.newRoomClass = $scope.showRoomForm ? 'fa-minus' : 'fa-plus';
    }

    $scope.toggleSeasonForm = function(){
        $scope.showSeasonForm = !$scope.showSeasonForm;
        $scope.newSeasonClass = $scope.showSeasonForm ? 'fa-minus' : 'fa-plus';
    }
    $scope.addRoom = function(){
        $scope.room.hotel = $scope.hotel.id;
        $scope.newRoomClass = 'fa-upload';
        $scope.showRoomForm = false;
        $http({method: 'POST', url: '/hotel/addRoom',params:$scope.room}).success(function(hotel){
            $scope.hotel = hotel;
            $scope.phones = JSON.parse(JSON.stringify(hotel.phones));
            $scope.newRoomClass = 'fa-plus';
        });
    }

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
    }


    /*$scope.updateIcon = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/hotel/updateIcon',
                data: {userId: $scope.hotel.id,method:"icon"},
                file: file, 
                fileFormDataName: 'icon_input', 
                
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                $scope.hotel.avatar2 = data.avatar2;
            });
        }
    };*/
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
    }
    
});