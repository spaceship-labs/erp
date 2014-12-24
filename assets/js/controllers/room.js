app.controller('roomEditCTL',function($scope,$upload,$http){
    $scope.room = room;
    io.socket.get('/room/find/'+room.id,function(data,jwres){
        $scope.room = data;
        $scope.$apply();
    });

    $scope.hotel = hotel;
    $scope.scheme = scheme;
    $scope.company = company;
    $scope.content = content;
    $scope.views = views;

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
    //if($scope.room.fees) $scope.room.fees = JSON.parse($scope.room.fees);
    $scope.saveFees = function(fees,cb){
        var object = {id:room.id,fees:$scope.room.fees};
          $http({method: 'POST', url: '/room/update',params:object}).success(function (room){
            $scope.room = room;
            jQuery('#myModal').modal('hide');
            cb();   
        });    
    };  
    
});