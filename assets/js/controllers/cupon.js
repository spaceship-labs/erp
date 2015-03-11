app.controller('cuponCTL',function($scope,$http,$window){
    $scope.cupons = cupons;
    $scope.content = content;
    $scope.hotels = hotels;
    $scope.tours = tours;
    $scope.transfers = transfers;

    $scope.getInfo = function(cupon){
        return cupon;
    }


    $scope.createCupon = function(cupon){
        cupon.user = user.id;
        cupon.company = user.company;
        cupon.hotels = cupon.hotels || [];
        cupon.tours = cupon.tours || [];
        cupon.transfers = transfers || [];
        $http({method: 'POST', url: '/cupon/create',params:cupon}).success(function(res){
            jQuery('#myModal').modal('hide');
            if(res && res.id){
                console.log('redirect!');
                cupon.hotels.forEach(function(e,i){
                    $http({method: 'POST', url: '/cupon/'+res.id+'/hotels/add/'+e.id}).success(function(res){
                    });
                });
                cupon.tours.forEach(function(e,i){
                    $http({method: 'POST', url: '/cupon/'+res.id+'/tours/add/'+e.id}).success(function(res){
                    });
                });
                cupon.transfers.forEach(function(e,i){
                    $http({method: 'POST', url: '/cupon/'+res.id+'/transfers/add/'+e.id}).success(function(res){
                    });
                });
                $scope.cupons.unshift(res);
            }
        });    
    };

});

app.controller('cuponEditCTL',function($scope,$http,$window){
    $scope.cupon = cupon;
    $scope.hotels = hotels;
    $scope.tours = tours;
    $scope.content = content;
    $scope.transfers = transfers;
    $scope.saveClass = 'fa-save';
});

app.controller('cuponSingleCTL',function($scope,$http,$window){
    $scope.cupon = cupon;
    $scope.cuponsSingle = cuponsSingle.map(function(e){
            e.name = e.cupon.name;
            e.expiration = (moment(e.expiration).format('LL'));
            return e;
        });
    $scope.content = content;
    $scope.getInfo = function(cupon){
        return cupon;
    };
    $scope.createInstance = function(instance){
        $http({method: 'POST', url: '/cuponSingle/create',data:instance}).success(function(res){
            res = res.map(function(e){
                    e.expiration = (moment(e.expiration).format('LL'));
                    return e;
                });
            $scope.cuponsSingle = res.concat($scope.cuponsSingle);
            jQuery('#myModal').modal('hide');
        });
    };
});

app.controller('cuponSingleEditCTL',function($scope,$http,$window){
    cuponSingle.cupon = cuponSingle.cupon.id;
    $scope.cupon = cupons;
    $scope.cuponSingle = cuponSingle;
    $scope.content = content;
});
