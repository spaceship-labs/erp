app.controller('roomEditCTL',function($scope,$upload,$http){
    $scope.room = room;
    io.socket.get('/room/find/'+room.id,function(data,jwres){
        $scope.room = data;
        $scope.$apply();
        
    });


    $scope.payScheme = 'base';
    $scope.hotel = hotel;
    $scope.scheme = scheme;
    $scope.company = company;
    $scope.content = content;
    $scope.views = views;

    //Inicializa el arreglo de precios para cada categoria si no hay ninguno aun para evitar errores con formHelper
    $scope.room.fees = $scope.room.fees || {base:{}};
    $scope.hotel.foodSchemes.forEach(function(scheme){
        $scope.room.fees[scheme.id] = $scope.room.fees[scheme.id] || {};
    });
    console.log($scope.room.fees);

    $scope.seasonFields = [];
    if($scope.scheme && $scope.scheme.seasons){
        $scope.scheme.seasons.forEach(function(season){
            $scope.seasonFields.push({
                label : season.title,
                type : 'money',
                handle : season.id,
            });
        });
    }
    $scope.selectScheme = function(scheme){
        $scope.payScheme = scheme.id;
    }
    //if($scope.room.fees) $scope.room.fees = JSON.parse($scope.room.fees);
    $scope.saveFees = function(fees,cb){
        var object = {id:room.id,fees:$scope.room.fees};
          $http({method: 'POST', url: '/room/update',params:object}).success(function (room){
            $scope.room.fees = room.fees;
            jQuery('#myModal').modal('hide');
            cb();   
        });    
    };  
    
});