(function () {
	var controller = function($scope,$http,$rootScope){
        $scope.translates = $rootScope.translates;
        $scope.page =  page;
		//TODO: meter estas variables con el scope no globalmente;
        $scope.broadcastSave = function(){
            console.log('broadcast');
            $rootScope.$broadcast('SAVE_ALL');
        };

	};
	controller.$inject = ['$scope','$http','$rootScope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        	},
        	templateUrl : '/template/find/pageHeader.html'
        };
    };
    app.directive('pageHeader', directive);

}());
