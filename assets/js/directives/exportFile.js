;(function () {
    //<div export-file export-type="company"></div>
    var controller = function($scope, $rootScope, $http){
        $scope.translates = $rootScope.translates;
        var contentFields = window.content && window.content[$scope.exportType] || false;
        if(!$scope.exportType || !contentFields){
            return;
        }

        $scope.fields = JSON.parse(JSON.stringify(contentFields));
        $scope.fields.push({
            handle: 'createdAt',
            label: 'fecha',
            label_en:'date'
        });

        $scope.selectFields = {};
        $scope.filter = {};

        for(var k in $scope.fields){
            var f = $scope.fields[k];
            $scope.selectFields[f.handle] = true;
            if($scope.lang == 'es'){
                f.text = f.label;
            }else{
                f.text = f.label_en;
            }

            if(f.type == 'select')
                $scope.filter.active = true;
        }
        $scope.allbox = true;
        $scope.limit = 1;
        $scope.allElements = true;
        $scope.sort = 'asc';
        $scope.sortField = $scope.fields[$scope.fields.length - 1];
        $scope.maxDate = new Date();
        $scope.format = 'yyyy/MM/dd';
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var today = new Date();
        $scope.date = {
            from: new Date(today.getFullYear(), today.getMonth(), 1),
            to: new Date()
        };

        $scope.changeAllbox = function(){
            for(var k in $scope.selectFields){
                $scope.selectFields[k] = $scope.allbox;
            }        
        };

        $scope.filterFieldOptions = [];
        $scope.updateFilter = function(i){
            if(!i) return;
            var field = $scope.fields[i],
                obj = field.object;
            if(obj && window[obj]){
                $scope.filter.options = window[obj].slice();
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

            if($scope.filter.active && $scope.filter.field >= 0 && $scope.filter.key && $scope.filter.key.id){
                var f = $scope.fields[$scope.filter.field];
                url += '&filterField=' + f.handle + '&filter=' + $scope.filter.key.id;
            }

            if($scope.date && $scope.date.from && $scope.date.to)
                url += '&dateFrom=' + $scope.date.from.toISOString() + '&dateTo='+$scope.date.to.toISOString();
            
            //console.log('url', url);
            location.href = url;
        };
    };

    controller.$inject = ['$scope','$rootScope', '$http'];
    var directive = function () {
        return {
            controller: controller,
            scope: {
                exportType: '@',
                lang: '@',
            },
            templateUrl : '/templates/partials/exportFile.html'
        };
    };
    app.directive('exportFile', directive);
}());
