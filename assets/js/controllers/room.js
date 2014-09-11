app.controller('roomEditCTL',function($scope,$upload,$http){
    $scope.room = room;
    $scope.seasons = seasons;
    $scope._content = _content;
    $scope.saveClass = 'fa-save';
    if($scope.room.fees) $scope.room.fees = JSON.parse($scope.room.fees);

    $scope.updateIcon = function($files) {
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            $scope.upload = $upload.upload({
                url: '/room/updateIcon',
                data: {userId: $scope.room.id,method:"icon"},
                file: file, 
                fileFormDataName: 'icon_input', 
                
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
                $scope.room.avatar2 = data.avatar2;
            });
        }
    };
    $scope.save = function(){
        $scope.saveClass = 'fa-upload';
        $http({method: 'POST', url: '/room/update',params:$scope.room}).success(function (room){
            $scope.room = room;
            if($scope.room.fees) $scope.room.fees = JSON.parse($scope.room.fees);
            $scope.saveClass = 'fa-save';
        });
    }
    
});