app.controller('serviceCTL',function($scope,$http){
    $scope.services = services;
    $scope.content = content;

    $scope.createService = function(newService){
        $http({method: 'POST', url: '/service/create',params:newService}).success(function (service){
            $scope.services.push(service);
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(service){
        return {
            "Nombre" : service.name_es,
            "Creado" : service.createdAt
        }
    };
});
app.controller('serviceEditCTL',function($scope,$upload,$http){
    $scope.service = service;
    $scope.content = content;
});