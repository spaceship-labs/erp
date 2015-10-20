app.controller('transportCTL',function($scope,$http,$rootScope){
    $scope.transports = transports;
    $scope.content = content;
    $scope.serviceTypes = getTypes();
    $scope.companies = window.show_companies;


    $scope.createTransport = function(newTransport){
        $http({method: 'POST', url: '/transport/create',params:newTransport}).success(function (transport){
            $scope.transports.push(transport);
            jQuery('.reset').click();
            jQuery('#myModal').modal('hide');
        });
    };
    $scope.getInfo = function(transport){
        var r = {};
        r[$rootScope.translates.c_name] = transport["name_"+$rootScope.lang];
        r[$rootScope.translates.c_created] = transport.createdAt;
        return r;
    };

    $scope.validate = function(transport){
        $http({method: 'GET', url: '/transport/find?limit=1&car_id='+transport.car_id }).success(function (exist){
            if(exist && exist.length){
                angular.element('input[name=car_id]').addClass('has-error');
            }else{
                console.log("creando"); 
                $scope.createTransport(transport);
            }
        });
    };

    $scope.remove_invalid = function(){
        angular.element('input[name=car_id]').removeClass('has-error');
    };
});
app.controller('transportEditCTL',function($scope,$upload,$http,$window){
    $scope.transport = transport;
    $scope.content = content;
    $scope.user = user;
    $scope.serviceTypes = getTypes();
});

var getTypes = function(){
    r = [
        { name : 'Colectivo' , id : 'C' }
        ,{ name : 'Privado' , id : 'P' }
        ,{ name : 'Lujo' , id : 'L' }
    ];
    return r;
}
