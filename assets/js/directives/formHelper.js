(function () {
	var controller = function($scope,$http){
		$scope.saveClass = 'fa-save';//check
        var ad = 1;
        $scope.ad = 1;
        //$scope.saveText = '';
        $scope.object = $scope.object || {};
        $scope.formClass = $scope.modal ? '' : 'widgetcontent nopadding';
        $scope.changed = false;

        //console.log(testForm);
        /*$scope.$watch('form',function(formObj){
            console.log(formObj);
        });*/

        $scope.getClass = function(){
            if ($scope.form.$dirty)
                $scope.saveClass = 'fa-save';
            else
                $scope.saveClass = 'fa-check';
        };
        $scope.removeRel = function(field,object){
            var data = {
                obj : $scope.object.id,
                rel : object.id,
            }
            $http({method:'POST',url:field.removeAction,data:data}).success(function (obj){
                $scope.object[field.handle] = obj[field.handle];
            });

        }
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
                    $scope.saveClass = 'fa-check';
                });
            }else{
                $http({method:'POST',url:$scope.action,data:submitObject}).success(function (obj){
                    //$scope.object = object;
                    $scope.saveClass = 'fa-check';
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
        };

        var saveMethod = $scope.formSave();
        if(!saveMethod) { //esto deberia ser un if update
            $scope.$on('SAVE_ALL', function () {
                $scope.save();
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
