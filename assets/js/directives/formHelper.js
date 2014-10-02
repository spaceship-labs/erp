(function () {
	var controller = function($scope,$http){
		$scope.saveClass = 'fa-save';
        $scope.save = function(){
            $scope.saveClass = 'fa-upload';
            var submitObject = {id:$scope.object.id};
            $scope.fields.forEach(function(field){
                submitObject[field.handle] = $scope.object[field.handle];
            });
            $http({method:'POST',url:$scope.action,params:submitObject}).success(function (object){
                $scope.object = object;
                $scope.saveClass = 'fa-save';
            });
        }
	};
	controller.$inject = ['$scope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		object : '=',
                fields : '=',
                action : '@',
                formTitle : '@'
        	},
        	templateUrl : '/template/find/formHelper.html'
        };
    };
    app.directive('formHelper', directive);

}());
