(function () {
	var controller = function($scope,$upload,$http){
		$scope.loadingProgress = 0;
		$scope.loading = false;
		$scope.updateIcon = function($files) {
			$scope.loading = true;
            $scope.upload = $upload.upload({
                url: $scope.updateMethod,
                data: {id: $scope.object.id},
                file: $files, 	                
            }).progress(function(evt){
            	$scope.loadingProgress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
            	$scope.loading = false;
            	$scope.loadingProgress = 0;
                $scope.object[$scope.imageAttr] = data[$scope.imageAttr];
            });
		};
	};
	controller.$inject = ['$scope', '$upload','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
        		updateMethod : '@',
        		deleteMethod : '@',
        		imageAttr : '@',
        		dir : '@',
        	},
        	templateUrl : '/template/find/profileImage.html'
        };
    };
    app.directive('profileImage', directive);

}());
