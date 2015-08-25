;(function () {
    //<div export-file export-type="company"></div>
    var controller = function($scope, $http){
        var contentFields = window.content && window.content[$scope.exportType] || false;
        if(!$scope.exportType || !contentFields){
            return;
        }

        $scope.fields = JSON.parse(JSON.stringify(contentFields));
        $scope.fields.push({
            handle: 'createdAt',
            label: 'fecha'
        });

        $scope.selectFields = {};

        for(var k in $scope.fields){
            $scope.selectFields[$scope.fields[k].handle] = true;
        }
        $scope.allbox = true;
        $scope.limit = 1;
        $scope.allElements = true;
        $scope.sort = 'asc';
        $scope.sortField = $scope.fields[$scope.fields.length - 1];

        $scope.changeAllbox = function(){
            for(var k in $scope.selectFields){
                $scope.selectFields[k] = $scope.allbox;
            }        
        };

        $scope.download = function(){
            var selected = [];
            for(var k in $scope.selectFields){
                if($scope.selectFields[k])
                    selected.push(k);
            }
            if(!selected.length)
                return;
            
            var url = '/exportdata/csv/?model=' + $scope.exportType + '&fieldNames=' + selected.join(',');
            if(!$scope.allElements && $scope.limit)
                url = url + '&limit=' + $scope.limit;
            
            url = url + '&sortField=' + $scope.sortField.handle + '&sort=' + $scope.sort;
            location.href = url;
        };
    };

    controller.$inject = ['$scope', '$http'];
    var directive = function () {
        return {
            controller: controller,
            scope: {
                exportType: '@',
            },
            templateUrl : '/templates/partials/exportFile.html'
        };
    };
    app.directive('exportFile', directive);
}());
