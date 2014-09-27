(function () {
	var controller = function($scope){
		console.log('hi');
        $scope.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']; 
        $scope.alphabetIndex = [];
        $scope.objects.forEach(function(object){
            $scope.alphabetIndex.push(object.name[0].toUpperCase());
        });
        $scope.currentLetter = $scope.alphabetIndex[0];
        $scope.objectFilter = function(obj){        
            if($scope.currentLetter && !$scope.searchInput){
                return $scope.currentLetter == obj.name[0].toUpperCase();
            }else{
                var regex = new RegExp('^'+$scope.searchInput,'i');
                var name = obj.name;
                return name.match(regex);
            }
        }
        $scope.selectLetter = function(l){
            if(l) $scope.currentLetter = l;
        }
        $scope.$watch('objects',function(){
            $scope.alphabetIndex = [];
            $scope.objects.forEach(function(object){
                $scope.alphabetIndex.push(object.name[0].toUpperCase());
            });
        })
	};
	controller.$inject = ['$scope'];
    var directive = function () {
        return {
        	controller : controller,
        	scope : {
        		objects : '=',
                searchInput : '=',
                dir : '@',
                editUrl : '@',
        	},
        	templateUrl : '/template/find/directoryListing.html'
        };
    };
    app.directive('directoryListing', directive);

}());
