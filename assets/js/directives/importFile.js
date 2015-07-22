;(function () {
    var controller = function($scope, $upload, $http){
        $scope.sheets = false;
        $scope.error = false;
        $scope.upload = function($files){
            $scope.loading = true;
            $scope.imports = [];
            $scope.upload = $upload.upload({
                url: '/importdata/upload',
                file: $files, 	                
            }).progress(function(evt){
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.loadingProgress = 0;
                if(data.success){
                    $scope.showData(data);
                }else{
                    $scope.error = data.error;
                }
            });

        };

        $scope.showData = function(data){
            $scope.sheets = data.sheets;
        };

        $scope.show = function($index){
            if($index == $scope.selected){
                $scope.selected = -1;
            }else{
                $scope.selected = $index;
            }
        };

        $scope.import = function(sheet, index){
            sheet.model = $scope.importType;
            $scope.imports[index] = true;
            $http.post('/importdata/importJson', sheet).then(function(res){
                if(res.data && res.data.success){
                    var creates = [];
                    creates.push(["name","id"]);
                    res.data.creates.forEach(function(create){
                        creates.push([create.name, create.id])
                    });
                    $scope.sheets[index].values = creates;
                    $scope.sheets[index].import = true;
                }else{
                    $scope.imports[index] = false;
                    $scope.error = res.data.error;
                }
            });
        };

    };
    controller.$inject = ['$scope', '$upload', '$http'];
    var directive = function () {
        return {
            controller: controller,
            scope: {
                importType: '@',
                url:'@'
            },
            templateUrl : '/templates/partials/importFiles.html'
        };
    };
    app.directive('importFiles', directive);
}());
