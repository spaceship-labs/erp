(function () {
	var controller = function($scope,$upload,$http){
		$scope.updateIcon = function($files) {
	        for (var i = 0; i < $files.length; i++) {
	            var file = $files[i];
	            $scope.upload = $upload.upload({
	                url: $scope.updateMethod,
	                data: {id: $scope.object.id},
	                file: file, 	                
	            }).progress(function(evt){
	                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	            }).success(function(data, status, headers, config) {
	                $scope.object[$scope.imageAttr] = data[$scope.imageAttr];
	            });
		    }
		};
	}

    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
        		updateMethod : '@',
        		deleteMethod : '@',
        		imageAttr : '@'
        	},
        	templateUrl : '/template/find/profileImage.html'
        };
    };
    app.directive('profileImage', directive);

}());
