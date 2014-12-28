(function () {
    var controller = function($scope,$http){
        var options = {
            'sort':'updatedAt desc',
            'limit':10
        }
        io.socket.get('/notice/find',options,function(data){
            if(!data)
                return;

            console.log(data)
            $scope.noticesN = data;
            $scope.$apply();
            $scope.noticeTranslate = {
                update:'actualizo',
                create:'creo',
                destroy:'elimino'
            };
        });
        io.socket.on('notice',function(data){
            if(data && data.id)
                $http.get('/notice/'+data.id).then(function(notice){
                    console.log(notice);
                    if(notice && notice.data)
                        $scope.noticesN.unshift(notice.data)
                });
        });

        $scope.fromNow = function(tm){
            return moment(tm).lang('es').fromNow()
        }
    };
    controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                object : '=',
                app : '=',
                apps : '=',
            },
            templateUrl : '/template/find/notices.html'
        };
    };
    app.directive('notices', directive);
}());
