app.controller('roomEditCTL',function($scope,$upload,$http){
    $scope.room = room;
    $scope.seasons = seasons;
    $scope._content = _content;
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
   
    
});