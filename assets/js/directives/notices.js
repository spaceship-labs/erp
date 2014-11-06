(function () {
	var controller = function($scope,$http){
        console.log($scope.app)
        $http.get('/notice/find',{}).then(function(data){
            if(!data.data)
                return;
            
            $scope.noticesN = data.data 
        	$scope.noticeTranslate = {
                update:'actualizo'
                ,create:'creo'
                ,destroy:'elimino'
            };
        });
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
