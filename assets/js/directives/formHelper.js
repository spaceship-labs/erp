(function () {
	var controller = function($scope,$http){
		$scope.saveClass = 'fa-save';
        $scope.object = $scope.object || {};
        $scope.formClass = $scope.modal ? '' : 'widgetcontent nopadding';
        $scope.save = function(){
            var submitObject =  $scope.object ? {id:$scope.object.id} : {};
            var restrictArray = $scope.restrict ? $scope.restrict.split(',') : [];
            $scope.fields.forEach(function(field){
                var isRestricted = false;
                for (var i in restrictArray) {
                    if (field.handle == restrictArray[i]) {
                        isRestricted = true;
                    }
                }
                if (!isRestricted) {
                    submitObject[field.handle] = $scope.object[field.handle];
                }
            });
            if ($scope.hiddenFields) {
                $scope.hiddenFields.forEach(function(field){
                    submitObject[field.key] = field.value;
                });
            }
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
            
        };

        $scope.formFilter = function(item){
            if ($scope.restrict) {
                var restrictArray = $scope.restrict.split(',');
                for (var i in restrictArray) {
                    if (item.handle == restrictArray[i]) {
                        return false;
                    }
                }
            }
            return true;
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
                currency : '=',
                restrict : '@',
                hiddenFields : '='
        	},
        	templateUrl : '/template/find/formHelper.html'
        };
    };
    app.directive('formHelper', directive);

}());
