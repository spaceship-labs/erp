app.controller('transferCTL',function($scope,$http,$rootScope){
    $scope.transfers = transfers;
    $scope.content = content;
    $scope.serviceTypes = getTypes();

    $scope.createTransfer = function(newTransfer){
        $http({method: 'POST', url: '/transfer/create',params:newTransfer}).success(function (transfer){
            $scope.transfers.push(transfer);
            jQuery('.reset').click();
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(transfer){
        var r = {};
        r[$rootScope.translates.c_name] = transfer["name_"+$rootScope.lang];
        r[$rootScope.translates.c_created] = transfer.createdAt;
        return r;
    };
});
app.controller('transferEditCTL',function($scope,$upload,$http,$window){
    $scope.transfer = transfer;
    $scope.content = content;
    $scope.user = user;
    $scope.serviceTypes = getTypes();
});

var getTypes = function(){
    r = [
        { name : 'Colectivo' , id : 'C' }
        ,{ name : 'Privado' , id : 'P' }
        ,{ name : 'Directo' , id : 'D' }
    ];
    return r;
}