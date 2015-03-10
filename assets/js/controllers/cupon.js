app.controller('cuponCTL',function($scope,$http,$window){
    $scope.cupons = cupons;
    $scope.content = content;
    $scope.hotels = hotels;

    $scope.getInfo = function(cupon){
        return cupon;
    }


    $scope.createCupon = function(cupon){
        $http({method: 'POST', url: '/cupon/create',params:cupon}).success(function(res){
            jQuery('#myModal').modal('hide');
            if(res && res.id){
                console.log('redirect!');
                cupon.hotels.forEach(function(e,i){
                    $http({method: 'POST', url: '/cupon/'+res.id+'/hotels/add/'+e.id}).success(function(res){
                    });
                });
            }
        });    
    };

});

app.controller('cuponEditCTL',function($scope,$http,$window){
    $scope.cupon = cupon;
    $scope.hotels = hotels;
    $scope.content = content;
    $scope.saveClass = 'fa-save';
});
