(function () {
	var controller = function($scope,$upload,$http){
		$scope.show = true;
		$scope.selected = false;
		$scope.format = 'all';
		$scope.loading = [];
		$scope.page = 0;
		$scope.pageLength = 16;
		$scope.uploadFiles = function($files){
			$scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
 			for (var i = 0; i < $files.length; i++) {
 				$scope.loading.push(1);
	            var file = $files[i];
	            $scope.upload = $upload.upload({
	                url: $scope.addMethod,
	                data: {id: $scope.object.id},
	                file: file, 	                
	            }).progress(function(evt){
	                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	            }).success(function(data, status, headers, config) {
	                $scope.object.files = data.files;
	                $scope.loading.splice(0, 1);
	            });
		    }
		}
		$scope.fileFilter = function () {
			return function(file){
				var start = $scope.page * $scope.pageLength;
				var end = start + $scope.pageLength;
				var index = $scope.object.files.indexOf(file);
				return index >= start && index < end;
				//return true;
			};
		}
		$scope.changePage = function(val){
			var page = $scope.page + val;
			var pages = Math.ceil($scope.object.files.length/$scope.pageLength);
			if(page<0) page = pages - 1;
			if(page >= pages) page = 0;
			$scope.page = page;
		}
		$scope.selectAll = function(){			
			$scope.selected = !$scope.selected;
			$scope.object.files.forEach(function(file){
				file.selected = $scope.selected;
			});
		}
	}

    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
        		addMethod : '@',
        		dir : '@',
        	},
        	templateUrl : '/template/find/fileManager.html'
        };
    };
    app.directive('fileManager', directive);

}());
