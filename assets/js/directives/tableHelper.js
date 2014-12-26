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
	};
	controller.$inject = ['$scope','$http','$modal'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		objects : '=',
                columns : '=',
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
