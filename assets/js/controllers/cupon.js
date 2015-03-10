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
    $scope.cupons = cupons;
    $scope.cuponsSingle = cuponsSingle;
    $scope.content = content;
    $scope.getInfo = function(cupon){
        return cupon;
    };
    $scope.createInstance = function(instance){
        $http({method: 'POST', url: '/cuponSingle/create',data:instance}).success(function(res){
            jQuery('#myModal').modal('hide');
        });
    };
});
