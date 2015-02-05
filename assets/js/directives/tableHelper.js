(function () {
	var controller = function($scope,$http,$modal){
        $scope.destroyObject = function(object,key){
            var modalInstance = $modal.open({
                templateUrl: '/template/find/deleteModal.html',
                size: 'sm',
                controller : modalController,
                resolve: {
                    object: function () {
                        return object;
                    }
                }
            });
            modalInstance.result.then(function() {
                //jQuery('#myModal').modal('hide');
                $http({method:'POST',url:'/'+$scope.route+'/destroy/',data:object}).success(function (obj){
                    if(obj.id == object.id) $scope.objects.splice(key,1);
                });
            });
            
        }
        $scope.updateInline = function(data,object,handle){
            $data = { id:object.id };
            $data[handle] = data;
            $http({method:'POST' , url:$scope.inlineEdit , data:$data }).success(function (obj){
                if(obj.id == object.id) object[handle] = obj[handle];
            });
        }
	};
	controller.$inject = ['$scope','$http','$modal'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		objects : '=',
                columns : '=',
                inlineEdit : '@', //url to update object
                route : '@'
        	},
        	templateUrl : '/template/find/tableHelper.html'
        };
    };
    app.directive('tableHelper', directive);


    var modalController = function($scope,$modalInstance,object){
        $scope.object = object;
        $scope.ok = function(){         
            $modalInstance.close();
        }
        $scope.cancel = function(){
            $modalInstance.dismiss('cancel');
        }   
    }
    modalController.$inject = ['$scope','$modalInstance','object'];

}());
