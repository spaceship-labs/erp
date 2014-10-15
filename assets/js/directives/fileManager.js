(function () {
	var controller = function($scope,$upload,$http,$modal){
		$scope.show = true;
		$scope.selected = false;
		$scope.format = 'all';
		$scope.loading = [];
		$scope.page = 0;
		$scope.pageLength = 16;
		$scope.object.files = $scope.object.files ? $scope.object.files : [];
		$scope.uploadFiles = function($files){
			$scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
			$scope.loading[0] = 0;
			$scope.upload = $upload.upload({
                url: $scope.addMethod,
                data: {id: $scope.object.id},
                file: $files, 	                
            }).progress(function(evt){
            	$scope.loading[0] = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                $scope.object.files = data.files;
            	$scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
                $scope.loading.splice(0, 1);
            });
		}
		$scope.fileFilter = function () {
			return function(file){
				if($scope.format == 'all'){
					var start = $scope.page * $scope.pageLength;
					var end = start + $scope.pageLength;
					var index = $scope.object.files.indexOf(file);
					return index >= start && index < end;
				}else{
					$scope.page = 0;
					return $scope.format == file.type.split('/')[0];
				}
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
		$scope.fileClass = function(file){
			var c = '';
			if(file.selected) c += "selected ";
			if(file.deleting) c += "deleting ";
			return c;
		}
		$scope.removeSelected = function(file){
			var files = [];
			$scope.object.files.forEach(function(file){
				if(file.selected){
					file.deleting = true;
					files.push(file);
				}
			});
			var modalInstance = $modal.open({
				templateUrl: '/template/find/deleteModal.html',
				size: 'sm',
				controller : modalController,
				resolve: {
					files: function () {
						return files;
					}
				}
			});
			modalInstance.result.then(function() {
				jQuery('#myModal').modal('hide');
				$scope.object.removeFiles = files;
				$http({method: 'POST', url: '/hotel/removeFiles',params:$scope.object}).success(function (object){
					$scope.object.files = object.files;
				});
			},function(){
				$scope.object.files.forEach(function(file){	
					if(file.selected) file.deleting = false;
				});

			});
			
		}
		
	}
	controller.$inject = ['$scope','$upload','$http','$modal'];
	var modalController = function($scope,$modalInstance,files){
		$scope.files = files;
		$scope.ok = function(){			
			$modalInstance.close();
		}
		$scope.cancel = function(){
			$modalInstance.dismiss('cancel');
		}	
	}
	modalController.$inject = ['$scope','$modalInstance','files'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
        		addMethod : '@',
        		dir : '@',
        	},
        	templateUrl : '/template/find/fileManager.html',
        };
    };
    app.directive('fileManager', directive);

}());
