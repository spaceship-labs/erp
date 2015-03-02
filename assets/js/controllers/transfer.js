app.controller('transferCTL',function($scope,$http){
    $scope.transfers = transfers;
    $scope.content = content;

    $scope.createTransfer = function(newTransfer){
        $http({method: 'POST', url: '/transfer/create',params:newTransfer}).success(function (transfer){
            $scope.transfers.push(transfer);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(transfer){
        return {
            "Nombre" : transfer.name_es,
            "Creado" : transfer.createdAt
        }
    };
});
app.controller('transferEditCTL',function($scope,$upload,$http,$window){
    $scope.transfer = transfer;
    $scope.content = content;
    $scope.user = user;
});