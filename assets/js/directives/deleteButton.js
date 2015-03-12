(function () {
    var controller = function($scope,$http,$window,$rootScope){
        console.log($rootScope);
        $scope.translates = $rootScope.translates;
        $scope.showOverlay = false;
        $scope.user = user;
        $scope.iconSrc = $scope.user.icon ? '/uploads/users/80x80'+$scope.user.icon.filename : 'http://placehold.it/80x80';
        $scope.submitDelete = function(){
            var data = {
                id : $scope.object.id,
                pass :  $scope.passwd,
            };

            var url = $scope.url+'/'+$scope.object.id;
            $http({method:'DELETE',url:url,data:data}).then(function(response){
                window.location = $scope.redirectUrl;
            });
        };
    };
    controller.$inject = ['$scope','$http','$window','$rootScope'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                object : '=',
                url : '@',
                redirectUrl : '@',
                user : '=',
            },
            templateUrl : '/template/find/deleteButton.html'
        };
    };
    app.directive('deleteButton', directive);

}());