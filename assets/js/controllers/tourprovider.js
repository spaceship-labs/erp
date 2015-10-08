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
});
app.controller('tourproviderEditCTL',function($scope,$http){
    $scope.locations = locations;
    $scope.provider = provider;
    $scope.user = user;
    $scope.content = content;
    $scope.company = company;
    $scope.currencies = currencies;
    $scope.saveTour = function(data,tour,index){
        var aux = parseFloat(data.commission_agency);
        if( !isNaN(aux) ){
            angular.extend(data, { id : tour.id });
            data.fee_base = (tour.fee-(tour.fee*(data.commission_agency/100)));
            data.feeChild_base = (tour.feeChild-(tour.feeChild*(data.commission_agency/100)));
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
    }
});