(function () {
	var controller = function($scope,$http){
		$scope.saveClass = 'fa-save';
        $scope.object = $scope.object || {};
        $scope.formClass = $scope.modal ? '' : 'widgetcontent nopadding';
        $scope.save = function(){
            var submitObject =  $scope.object ? {id:$scope.object.id} : {};
            $scope.fields.forEach(function(field){
                submitObject[field.handle] = $scope.object[field.handle];
            });
            $scope.saveClass = 'fa-upload';
            var saveMethod = $scope.formSave();
            if(saveMethod){
                $scope.formSave()(submitObject,function(){
                    $scope.saveClass = 'fa-save';
                });
            }else{
                $http({method:'POST',url:$scope.action,params:submitObject}).success(function (object){
                    $scope.object = object;
                    $scope.saveClass = 'fa-save';
                });
            }
            
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
                formTitle : '@',
                formFooter : '@',
                modal : '@',
                formSave : '&',
                objects : '=',
                currency : '='
        	},
        	templateUrl : '/template/find/formHelper.html'
        };
    };
    app.directive('formHelper', directive);

}());
