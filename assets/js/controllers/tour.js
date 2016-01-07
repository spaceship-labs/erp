app.controller('tourCTL',function($scope,$http,$window,$rootScope){
    $scope.tours = tours;
    $scope.content = content;
    $scope.locations = locations;
    $scope.schemes = schemes;
    $scope.company = company;
    $scope.providers = providers;
    $scope.tourcategories = tourcategories;
    $scope.types = [ { id : 'single', name : 'por persona' },{ id : 'group',name : 'por grupo' } ];
    $scope.maxpax = [{id:0,name:'No aplica'}];
    for(var x=1;x<30;x++)
        $scope.maxpax.push({ id: x , name: x+' persona'+( x>1?'s':'' ) });
	$scope.getInfo = function(tour){
        tour.createdAt=(moment(tour.createdAt).format('LL'));
        tour.updatedAt=(moment(tour.updatedAt).format('LL'));
        var r = {}
        r[$rootScope.translates.c_name] = tour.name;
        r[$rootScope.translates.c_baseRate] = tour.fee;
        r[$rootScope.translates.c_created] = tour.createdAt;
        r[$rootScope.translates.c_updated] = tour.updatedAt;
        r['Proveedor'] = tour.provider?tour.provider.name:'Sin proveedor asignado.';
		return r;
	};
	$scope.createTour = function(newtour){
        //console.log(newtour);
        //$http({method: 'POST', url: '/tour/create',params:newtour}).success(function (result){
        $http.post('/tour/create',newtour,{}).success(function(result) {
            //console.log(result);
            $scope.tours = result.tours;
            jQuery('#myModal').modal('hide');
            $window.location =  "/tour/edit/" + result.thetour.id;
        });    
    };
    $scope.setTimes = function(){
        $http({method: 'POST', url: '/tour/formatTimes',params : {} }).success(function (result){
            console.log(result);
        });
    };
});

app.controller('tourEditCTL',function($scope,$http,$window){
    $scope.schemes = schemes;
    $scope.locations = locations;
    $scope.providers = providers;
    $scope.tour = tour;
    $scope.extra_price = {
        fee : 0,
        feeChild : 0,
        description : '',
        tour : $scope.tour.id,
        type : 'extra_hour',
        hour : 0
    };
    //console.log(tour);
    $scope.types = [ { id : 'single', name : 'por persona' },{ id : 'group',name : 'por grupo' } ];
    if (angular.isUndefined($scope.tour.departurePoints)) {
        $scope.tour.departurePoints = [];
    }
    $scope.maxpax = [{id:0,name:'No aplica'}];
    for(var x=1;x<30;x++)
        $scope.maxpax.push({ id: x , name: x+' persona'+( x>1?'s':'' ) });
    $scope.tour.schedules = $scope.tour.schedules || [];
    for(var x in $scope.tour.schedules)
        $scope.tour.schedules[x] = typeof $scope.tour.schedules[x] == 'string'?JSON.parse($scope.tour.schedules[x]):$scope.tour.schedules[x];
    $scope.user = user;
    $scope.tourcategories = tourcategories; //categorias normales
    $scope.rateCategories = []; //categorias tipo rate
    $scope.tourRateCategories = []; //categorias ya agregadas o por agregar

    /*io.socket.get('/tour/find/'+tour.id,function(data,jwres){
        $scope.tour = data;
	    $scope.tour.seasonScheme = data.seasonScheme && data.seasonScheme.id || null;
        $scope.tour.location = data.location && data.location.id || null;
	    $scope.tour.provider = data.provider && data.provider.id || null;
        $scope.$apply();
    });*/
	$scope.content = content;
    $scope.company = company;
    $scope.saveClass = 'fa-save';
    $scope.extra_types = [
        { name : 'Hora extra', id : 'extra_hour' }
    ]
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        var form = {
            id : $scope.tour.id
            ,days : $scope.tour.days
            ,schedules : $scope.tour.schedules 
            ,rates : $scope.tourRateCategories
        };
        //$http({method: 'POST',url:'/tour/update',params:form}).success(function(tour){
        $http.post('/tour/update',form,{}).success(function(tour) {
            //console.log(tour);
            $scope.tour.days = tour.days;
            $scope.saveClass = 'fa-save';
        });
    };
    $scope.$on('SAVE_ALL', function () {
        $scope.save();
        //console.log('SAVE_ALL!!!!!!!!');
    });
    $scope.addSchedule = function(){
        var aux = { from : '' , to : '' };
        $scope.tour.schedules.push(aux);
    };
    $scope.deleteSchedule = function(index){
        $scope.tour.schedules.splice(index,1);
    };
    $scope.updateMarkers = function(markers,cb){
        //console.log($scope.item);
        //console.log(markers);
        var data = { id : $scope.tour.id , departurePoints : markers };
        //console.log(data);
        $http({method: 'POST', url: '/tour/update',data:data}).success(function (item){
            //$scope.tour = item;
            cb(null,item);
        });
    };
    $scope.center = {
        lat : 21.1667,
        lng : -86.8333,
        zoom : 6
    };
    $scope.getRateCategories = function(){
        $scope.theRC = false;
        var $ne = [];
        for( x in $scope.tourRateCategories ) $ne.push( $scope.tourRateCategories[x].category.id );

        var params = { type : 'rate' };
        if( $ne.length > 0 ) params.id = { '!' : $ne };
        $http({method: 'POST', url: '/tourcategory/find',params:params}).success(function (cats){
            if( cats && cats.results ){
                for(var x in cats.results) 
                    for(var y in cats.results[x].rating)
                        cats.results[x].rating[y] = typeof cats.results[x].rating[y] == 'string'?JSON.parse(cats.results[x].rating[y]):cats.results[x].rating[y];
                $scope.rateCategories = cats.results;
            }
        });
    };
    $http.post('/tour/getrates',{tour:$scope.tour.id},{}).success(function(rates){
        if( rates )
            $scope.tourRateCategories = rates;
        $scope.getRateCategories();
    });
    $scope.addRC = function(){
        if( $scope.theRC ){
            var aux = { category : $scope.theRC , value : 1, titles : _.pluck($scope.theRC.rating,'label') };
            $scope.tourRateCategories.push(aux);
            //console.log($scope.tourRateCategories);
            $scope.getRateCategories();
        }
    };

    $scope.saveExtraPrice = function (){
        $http.post('/tour/addExtraPrices',{ tour : $scope.tour.id, prices : $scope.tour.extra_prices },{}).success(function(result){
            //console.log(result);
            if (result.success)
                $scope.tour.extra_prices = result.extra_prices;
            else
                console.log(result);
        });
    }

    $scope.addExtraPrice = function(){
        $scope.tour.extra_prices.push(angular.copy($scope.extra_price));
        $scope.extra_price = {
            fee : 0,
            feeChild : 0,
            description : '',
            tour : $scope.tour.id,
            type : 'extra_hour',
            hour : 0
        };
    }

    $scope.deleteExtraPrice = function(index){
        var extra_price_delete = $scope.tour.extra_prices[index];
        console.log(extra_price_delete);
        $scope.tour.extra_prices.splice(index,1);
    }
});
