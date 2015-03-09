app.controller('cuponCTL',function($scope,$http,$window){
    $scope.cupons = cupons;
    $scope.content = content;

    $scope.getInfo = function(cupon){
        return cupon;
    }

    $scope.createCupon = function(cupon){
        $http({method: 'POST', url: '/cupon/create',params:cupon}).success(function(res){
            jQuery('#myModal').modal('hide');
            console.log(res);
        });    
    };

});

app.controller('cuponEditCTL',function($scope,$http,$window){
    $scope.cupon = cupon;
    console.log(cupon);
    $scope.content = content;
    $scope.saveClass = 'fa-save';
});
