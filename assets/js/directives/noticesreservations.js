(function () {
    var controller = function($scope,$http,$q,$rootScope){
        $scope.translates = $rootScope.translates;
        var options = { 'sort':'updatedAt desc', 'limit':10 };
        io.socket.get('/order/getorder',options,function(data){
            if(!data)
                return;
            $scope.noticesR = data;
            console.log(data);
        });
        io.socket.on('order',function(data){
            if(data && data.id){
                $http.get('/order/'+data.id).then(function(order){
                    if(order && order.data)
                        $scope.noticesR.unshift(notice.data)
                });
            }
        });
        $scope.fromNow = function(tm){
            return moment(tm).lang('es').fromNow()
        }
        $scope.formatFields = function(){
            var requests = [];
        };
    };
    controller.$inject = ['$scope','$http','$q','$rootScope'];
    var directive = function () {
        return {
            controller : controller,
            scope : { },
            templateUrl : '/template/find/noticesreservations.html'
        };
    };
    app.directive('noticesreservations', directive);
}());
