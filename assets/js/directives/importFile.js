;(function () {
    var controller = function($scope, $upload, $http){
        $scope.sheets = false;

        $scope.upload = function($files){
            $scope.loading = true;
            $scope.upload = $upload.upload({
                url: '/importdata/upload',
                data: { model: $scope.model },
                file: $files, 	                
            }).progress(function(evt){
            }).success(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.loadingProgress = 0;
                if(data.success){
                    $scope.showData(data);
                }
                //$scope.object[$scope.imageAttr] = data[$scope.imageAttr];
            });

        };

        $scope.showData = function(data){
            $scope.sheets = data.sheets;
        };

        $scope.show = function($index){
            $scope.selected = $index;
        };

        $scope.import = function(sheet){
            console.log(sheet);
        };

    };
    controller.$inject = ['$scope', '$upload', '$http'];
    var directive = function () {
        return {
            controller : controller,
            templateUrl : '/templates/partials/importFiles.html'
        };
    };
    app.directive('importFiles', directive);
}());
