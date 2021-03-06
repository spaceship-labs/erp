(function () {
	var controller = function($scope,$rootScope,$http){
        $scope.translates = $rootScope.translates;
        $scope.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
        $scope.filter_by = 'name'
        $scope.search_text_input = '';
        $scope.alphabetIndex = [];
        $scope.totalItems = 0;
        $scope.searching = false;
        //$scope.dlPage = 1;
        $scope.myView = 'list';
        $scope.setView = function(view){
            $scope.myView = view;
        };
        $scope.objects.forEach(function(object){
            if(object && object.name)
                $scope.alphabetIndex.push(object.name[0].toUpperCase());
        });
        $scope.currentLetter = $scope.alphabetIndex[0];
        $scope.objectFilter = function(obj){
            var name = $scope.fieldName || 'name';
            if($scope.filter_by != 'name')
                return true;
            if($scope.currentLetter && !$scope.searchInput){
                return $scope.currentLetter == obj[name][0].toUpperCase();
            }else{
                var regex = new RegExp('^'+$scope.searchInput,'i');
                var name = obj[name];
                return name.match(regex);
            }
        };

        var objectDefaultsLength = $scope.objects && $scope.objects.length || 0;
        var objectDefaultsFilterByName = $scope.objects && $scope.objects.slice() || [];

        var getMore = function(skip){
            if($scope.searching) return;
            $scope.searching = true;
            var params = { 'skip':skip , 'limit': 30 , 'sort' : 'name asc' };
            if( $scope.objFilters )
                for(var x in $scope.objFilters)
                    params[x] = $scope.objFilters[x];
            console.log($scope.searchFind);
            if( $scope.searchFind && $scope.search_text_input != '' )
                params.name = $scope.search_text_input;
            if($scope.filter_by == 'date'){
                params.sort = 'createdAt desc';
            }
                
            $http.get($scope.getUrl, { params: params  }).then(function(response){ 
                $scope.searching = false;
                if(response.data.results && response.data.count){
                    $scope.objects = response.data.results;
                    $scope.totalItems = response.data.count;
                }else{
                    $scope.totalItems = objectDefaultsLength;
                    $scope.objects = response.data;
                }
            });
        };
        if( $scope.getUrl ) getMore(0);
        $scope.pageChanged = function(page) {
            var skip = (page-1) * 30;
            getMore(skip);
        };
        $scope.selectLetter = function(l){
            if(l) $scope.currentLetter = l;
        };
        $scope.$watch('objects',function(){
            var name = $scope.fieldName || 'name';
            $scope.alphabetIndex = [];
            if($scope.objects)
                $scope.objects.forEach(function(object){
                    $scope.alphabetIndex.push(object[name][0].toUpperCase());
                });
            $scope.currentLetter = $scope.alphabetIndex[0];
        });
        $scope.$watch('search_text_input',function(){
            console.log('searching...');
            if( $scope.getUrl ) getMore(0);
        });
        $scope.$watch('filter_by',function(newV, oldV){
            console.log($scope.objects);
            if(newV == 'name'){
                $scope.objects = objectDefaultsFilterByName;
                $scope.totalItems = 4;
            }else if(oldV == 'name' && $scope.getUrl){
                getMore(0);
            }
        });

        $scope.info = function(object){
            return $scope.getInfo()(object);
        };

	};
	controller.$inject = ['$scope','$rootScope','$http'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		objects : '=',
                objFilters : '=',
                searchInput : '=',
                dir : '@',
                editUrl : '@',
                getInfo : '&',
                buttonText : '@',
                buttonTextImport : '@',
                buttonTextExport : '@',
                typeImport : '@',
                typeExport : '@',
                typeExportText : '@',
                fieldName: '@',//si no tiene campo name
                searchFind : '=',//para agregar un buscador y afectar el getMore()
                lang: '@',
                getUrl : '@' // para la paginación del alfabeto, en caso de no tenerlo tampoco afecta
        	},
        	templateUrl : '/template/find/directoryListing.html'
        };
    };
    app.directive('directoryListing', directive);

}());
