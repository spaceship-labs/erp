app.controller('tourproviderCTL',function($scope,$http,$rootScope){
    $scope.providers = providers;
    $scope.content = content;
    $scope.locations = locations;
    $scope.company = company;
	$scope.getInfo = function(provider){
        provider.createdAt=(moment(provider.createdAt).format('LL'));
        provider.updatedAt=(moment(provider.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = provider.name;
        r[$rootScope.translates.c_created] = provider.createdAt;
        r[$rootScope.translates.c_updated] = provider.updatedAt;
		return r;
	};
	$scope.createTourProvider = function(newprovider){
        $http({method: 'POST', url: '/tourprovider/create',params:newprovider}).success(function (result){
            $scope.providers.unshift(result);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.currencies = currencies;
});
app.controller('tourproviderEditCTL',function($scope,$http){
    $scope.locations = locations;
    $scope.provider = provider;
    $scope.provider.tours = $scope.provider.tours || [];
    $scope.user = user;
    $scope.content = content;
    $scope.interactions = interactions;
    $scope.company = company;
    $scope.currencies = currencies;
    $scope.tourcategories = tourcategories;

    $scope.saveTour = function(data,tour,index){
        var aux = parseFloat(data.commission_agency);
        if( !isNaN(aux) ){
            angular.extend(data, { id : tour.id });
            data.fee_base = (tour.fee-(tour.fee*(data.commission_agency/100)));
            data.feeChild_base = (tour.feeChild-(tour.feeChild*(data.commission_agency/100)));
            data.fee_baseMX = (tour.feeMX-(tour.feeMX*(data.commission_agencyMX/100)));
            data.feeChild_baseMX = (tour.feeChildMX-(tour.feeChildMX*(data.commission_agencyMX/100)));
            console.log(data);
            $scope.saveClass = 'fa-upload';
            $http.post('/tour/update', data).then(function(t){ 
            //$http({method: 'POST',url:'/tour/update',params:data}).success(function(t){
                $scope.saveClass = 'fa-save';
                console.log(t.data);
                $scope.provider.tours[index] = t.data;
            });
        }else{
            console.log('error, valor no válido');
        }
    };
    $scope.saveTourMX = function(data,tour,index){
        var aux = parseFloat(data.commission_agencyMX);
        if( !isNaN(aux) ){
            angular.extend(data, { id : tour.id });
            
            console.log(data);
            $scope.saveClass = 'fa-upload';
            $http.post('/tour/update', data).then(function(t){ 
            //$http({method: 'POST',url:'/tour/update',params:data}).success(function(t){
                $scope.saveClass = 'fa-save';
                console.log(t.data);
                $scope.provider.tours[index] = t.data;
            });
        }else{
            console.log('error, valor no válido');
        }
    };
    $scope.createTour = function(newtour){
        newtour.provider = $scope.provider.id;
        $http({method: 'POST', url: '/tour/create',params:newtour}).success(function (result){
            jQuery('#myModal').modal('hide');
            $scope.provider.tours.push(result.thetour);
        });    
    };
    $scope.getTours = function(term){
        return $http.get('/tour/find', { params: { 'name': term , provider : 'null' , 'limit': 10 , 'sort' : 'name asc' }
        }).then(function(response){ 
            console.log('tours');
            console.log(response);
            return response.data.results.map(function(item){ return item; });
        });
    };
    $scope.addTour = function(t){
        var params = t;
        params.provider = $scope.provider.id;
        $http.post('/tour/update', params).then(function(response){ 
            if(response.data)
                $scope.provider.tours.push(response.data);
        });
    };
    $scope.removeTour = function(t){
        var params = t;
        params.provider = ' ';
        $http.post('/tour/update', params).then(function(response){
            console.log( response.data );
            if(response.data){
                for(x in $scope.provider.tours){
                    if( $scope.provider.tours[x].id == t.id )
                        $scope.provider.tours.splice(x,1);
                }
            }
        });
    };
    $scope.changePricesTable = function(){
        console.log('on change');
    };
    $scope.updateMarkers = function(markers,cb){
        //console.log($scope.item);
        //console.log(markers);
        var data = { id : $scope.provider.id , departurePoints : markers };
        //console.log(data);
        $http({method: 'POST', url: '/tourprovider/update',data:data}).success(function (item){
            //$scope.tour = item;
            cb(null,item);
        });
    };
    $scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 6
    };
    $scope.getLocationHotels = function(){
        $scope.locationHotels = [];
        for(var i in $scope.locations){
            if ($scope.locations[i].id == $scope.provider.location ) {
                var item = $scope.locations[i];
                for(var x in item.hotels) {
                    if (item.hotels[x].latitude && item.hotels[x].longitude) {
                        var auxPoint = {
                            name : item.hotels[x].name,
                            message : item.hotels[x].name,
                            type : 'hotel',
                            lat : parseFloat(item.hotels[x].latitude),
                            lng : parseFloat(item.hotels[x].longitude),
                            identifier : item.hotels[x].id
                        };
                        $scope.locationHotels.push(auxPoint);
                    }
                }
            }
        }
        //console.log($scope.locationHotels);
    };
    $scope.getLocationZones = function(){
        $scope.locationZones = [];
        var center = { lat : 21.1667, lng : -86.8333, zoom : 5 };
        for(var i in $scope.locations){
            if ($scope.locations[i].id == $scope.provider.location ) {
                var item = $scope.locations[i];
                for(var x in item.zones) {
                    var auxPoint = {
                        name : item.zones[x].name,
                        message : item.zones[x].name,
                        type : 'zone',
                        lat : center.lat,
                        lng : center.lng,
                        identifier : item.zones[x].id
                    };
                    $scope.locationZones.push(auxPoint);
                }
            }
        }
    };

    $scope.getLocationHotels();

    $scope.$watch('provider.location', function(t) {
        $scope.getLocationHotels();
        $scope.getLocationZones();
    });
});