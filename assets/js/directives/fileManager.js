(function () {
    io.socket.get('/notice/find',function(data){});
    var controller = function($scope,$upload,$http,$modal){
        $scope.show = true;
        $scope.selected = false;
        $scope.format = 'all';
        $scope.loading = [];
        $scope.page = 0;
        $scope.pageLength = 16;
        $scope.object.files = $scope.object.files ? $scope.object.files : [];
        $scope.uploadFiles = function($files){
            $scope.object.files = $scope.object.files ? $scope.object.files : [];
            $scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
            //$scope.loading[0] = 0;
            $scope.uids = [];
            $scope.loading = [];
            var uid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            $scope.uids.push(uid);
            $scope.loading.push(0);
            io.socket.on(uid,function(data){
                var uid_index = parseInt(data.index);
                if(data && $scope.loading[uid_index]!=undefined)
                    $scope.loading[uid_index]=parseFloat(data.porcent);
            });
            //$files.forEach(function(e,i){
                /*var uid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                $scope.uids.push(uid);
                $scope.loading.push(0);            
                io.socket.on(uid,function(data){
                    var uid_index = parseInt(data.index);
                    if(data && $scope.loading[uid_index]!=undefined)
                        $scope.loading[uid_index]=parseFloat(data.porcent);
                });
				$scope.upload = $upload.upload({
                    url: $scope.addMethod,
                    data: {
                        id: $scope.object.id,
                        uid:uid,
                        index:i
                    },
                    file: e,
                }).progress(function(evt){
                    $scope.loading[0] = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {
                    var index_uid = $scope.uids.indexOf(uid);
                    $scope.loading.splice(index_uid,1);
                    $scope.uids.splice(index_uid, 1);
                    $scope.object.files = data.files;
                    $scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
                });*/
            //});
			$scope.upload = $upload.upload({
                url: $scope.addMethod,
                data: {id: $scope.object.id,uid:uid,index:0},
                file: $files,
            }).progress(function(evt){
                $scope.loading[0] = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                var index_uid = $scope.uids.indexOf(0);
                $scope.loading = [];
                $scope.uids.splice(index_uid, 1);
                $scope.object.files = data.files;
                $scope.page = Math.ceil($scope.object.files.length/$scope.pageLength) -1;
            });
        };
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
				templateUrl: '/template/find/deleteFileModal.html',
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
				$http({method: 'POST', url: $scope.removeMethod,data:$scope.object}).success(function (object){
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
        		removeMethod : '@',
        		dir : '@',
        	},
        	templateUrl : '/template/find/fileManager.html',
        };
    };
    app.directive('fileManager', directive);

}());
